'use client';

import Link from "next/link";
import NextImage from "next/image";
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  TrendingUp,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Brain,
  Lock,
  BarChart3,
  CheckCircle2,
  Play,
  ChevronRight,
  Star,
} from "lucide-react";

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  if (isInView && count === 0) {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
  }

  return (
    <span ref={ref} className="stat-number">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Feature card component
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0
}: {
  icon: typeof Brain;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className="group relative"
    >
      <div className="card-premium rounded-2xl p-8 h-full transition-all duration-500">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-7 h-7 text-primary" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>

        {/* Learn more link */}
        <div className="mt-6 flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Learn more</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground">
      {/* Skip link */}
      <a href="#main-content" className="sr-only-focusable fixed top-4 left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg">
        Skip to main content
      </a>

      {/* Premium Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 md:mx-8 mt-4">
          <nav className="glass rounded-2xl px-6 py-4 flex items-center justify-between" aria-label="Main navigation">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 animate-pulse-glow">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight hidden sm:block">
                FinanceFlow
              </span>
            </Link>

            <div className="flex items-center gap-2 md:gap-6">
              <div className="hidden md:flex items-center gap-6">
                <Link href="/ai-guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {tNav('aiGuide')}
                </Link>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {tNav('docs')}
                </Link>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {tNav('login')}
                </Link>
              </div>
              <LanguageSwitcher />
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 font-medium">
                <Link href="/signup">{tNav('getStarted')}</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 grid-pattern opacity-50" />

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />

          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="relative z-10 container mx-auto px-4 md:px-8 pt-32 pb-20"
          >
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">{t('tagline')}</span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8"
              >
                <span className="text-foreground">{t('hero.title')}</span>
                <br />
                <span className="text-primary text-glow">{t('hero.titleHighlight')}</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
              >
                {t('hero.description')}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button size="lg" asChild className="h-14 px-8 rounded-full text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
                  <Link href="/signup">
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-full text-lg font-medium border-border hover:bg-secondary hover:border-primary/30 transition-all group">
                  <Link href="/ai-guide">
                    <Play className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                    {t('hero.ctaSecondary')}
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-20 relative max-w-6xl mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-black/50">
                {/* Glow effect behind image */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/10 to-primary/20 rounded-2xl blur-xl opacity-50" />

                <div className="relative glass">
                  <NextImage
                    src="/assets/dashboard-preview.png"
                    alt="FinanceFlow dashboard showing AI-powered financial insights"
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>

              {/* Floating stat cards */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -left-4 md:-left-12 top-1/4 card-premium rounded-xl p-4 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Savings</p>
                    <p className="text-lg font-bold text-green-500">+¥124,500</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute -right-4 md:-right-12 bottom-1/4 card-premium rounded-xl p-4 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">AI Confidence</p>
                    <p className="text-lg font-bold text-primary">98.7%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            </div>
          </motion.div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 border-y border-border/50 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: 50000, suffix: "+", label: "Active Users" },
                { value: 2, suffix: "B+", label: "Transactions Analyzed" },
                { value: 99.9, suffix: "%", label: "Uptime SLA" },
                { value: 4.9, suffix: "/5", label: "User Rating" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-50" />

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <span className="inline-block px-4 py-1.5 rounded-full glass border border-primary/20 text-primary text-sm font-medium mb-6">
                Features
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {t('features.sectionTitle')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Enterprise-grade financial intelligence, powered by AI trained on Big 4 methodologies.
              </p>
            </motion.div>

            {/* Feature grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Brain}
                title={t('features.big4.title')}
                description={t('features.big4.description')}
                delay={0}
              />
              <FeatureCard
                icon={Zap}
                title={t('features.categorization.title')}
                description={t('features.categorization.description')}
                delay={0.1}
              />
              <FeatureCard
                icon={Shield}
                title={t('features.riskProjection.title')}
                description={t('features.riskProjection.description')}
                delay={0.2}
              />
              <FeatureCard
                icon={BarChart3}
                title="Real-Time Analytics"
                description="Live dashboards with instant updates. Track cash flow, spending patterns, and investment performance in real-time."
                delay={0.3}
              />
              <FeatureCard
                icon={Lock}
                title="Bank-Level Security"
                description="256-bit encryption, SOC 2 Type II certified, and zero knowledge architecture. Your data stays absolutely private."
                delay={0.4}
              />
              <FeatureCard
                icon={Star}
                title="Premium Support"
                description="Dedicated account managers for enterprise clients. 24/7 support with guaranteed response times."
                delay={0.5}
              />
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 border-y border-border/50">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Trusted by Industry Leaders</h3>
              <p className="text-muted-foreground">Used by professionals at top institutions worldwide</p>
            </motion.div>

            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
              {['Goldman Sachs', 'Morgan Stanley', 'Deloitte', 'EY', 'PwC', 'KPMG'].map((company, i) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xl font-bold text-muted-foreground"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Ready to transform your
                <br />
                <span className="text-primary text-glow">financial future?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join 50,000+ professionals who trust FinanceFlow for their financial intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="h-14 px-10 rounded-full text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25">
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-10 rounded-full text-lg font-medium border-border hover:bg-secondary">
                  <Link href="/docs">View Documentation</Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 mt-10 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="py-16 border-t border-border/50 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">FinanceFlow</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AI-powered financial intelligence for modern professionals and enterprises.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
                <li><Link href="/enterprise" className="hover:text-foreground transition-colors">Enterprise</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/ai-guide" className="hover:text-foreground transition-colors">AI Guide</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/support" className="hover:text-foreground transition-colors">Support</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FinanceFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>🇯🇵 Tokyo</span>
              <span>🇺🇸 San Francisco</span>
              <span>🇸🇬 Singapore</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
