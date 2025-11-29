import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Lazy initialization to prevent build-time errors
let stripe: Stripe | null = null;
let webhookSecret: string | null = null;

function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }
  return stripe;
}

function getWebhookSecret() {
  if (!webhookSecret) {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }
  return webhookSecret;
}

export async function POST(request: NextRequest) {
  try {
    const stripeClient = getStripe();
    const secret = getWebhookSecret();
    
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(body, signature, secret);
    } catch (err) {
      logger.error('Webhook signature verification failed', err);
      return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        logger.info('Unhandled Stripe event type', { eventType: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler failed', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscription = await getStripe().subscriptions.retrieve(
    session.subscription as string
  );

  if (!subscription.items.data[0]) return;

  const tier = getPlanTier(subscription.items.data[0].price.id);

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      tier,
      status: subscription.status === 'active' ? 'ACTIVE' : 'TRIAL',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId,
      tier,
      status: subscription.status === 'active' ? 'ACTIVE' : 'TRIAL',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!sub) return;

  const stripeSubscription = await getStripe().subscriptions.retrieve(subscription.id);
  if (!stripeSubscription.items.data[0]) return;

  const tier = getPlanTier(stripeSubscription.items.data[0].price.id);

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      tier,
      status: subscription.status === 'active' ? 'ACTIVE' : subscription.status === 'canceled' ? 'CANCELLED' : 'EXPIRED',
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!sub) return;

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      tier: 'FREE',
      status: 'CANCELLED',
    },
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscription = await getStripe().subscriptions.retrieve(
    invoice.subscription as string
  );

  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!sub) return;

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      status: 'ACTIVE',
    },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await getStripe().subscriptions.retrieve(
    invoice.subscription as string
  );

  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!sub) return;

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      status: 'EXPIRED',
    },
  });

  // TODO: Send email notification about payment failure
}

function getPlanTier(priceId: string): 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE' {
  const priceTierMap: Record<string, 'BASIC' | 'PREMIUM' | 'ENTERPRISE'> = {
    'price_basic_monthly': 'BASIC',
    'price_premium_monthly': 'PREMIUM',
    'price_business_monthly': 'ENTERPRISE',
  };

  return priceTierMap[priceId] || 'FREE';
}
