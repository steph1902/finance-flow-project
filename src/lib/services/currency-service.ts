/**
 * Multi-Currency Service
 * 
 * Handles currency conversion, rate fetching, and localized formatting.
 * Uses external API (Fixer.io) for exchange rates with caching.
 */

import { prisma } from '@/lib/prisma';
import { logInfo, logError, logWarn } from '@/lib/logger';
import { ENV } from '@/lib/env';
import { Decimal } from '@prisma/client/runtime/library';

export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'SGD',
  'HKD', 'NZD', 'SEK', 'KRW', 'NOK', 'MXN', 'BRL', 'ZAR', 'RUB', 'TRY',
] as const;

export type Currency = typeof SUPPORTED_CURRENCIES[number];

export interface ConversionResult {
  fromCurrency: Currency;
  toCurrency: Currency;
  originalAmount: number;
  convertedAmount: number;
  rate: number;
  rateDate: Date;
}

/**
 * Fetch exchange rate from external API (Fixer.io)
 */
async function fetchExchangeRate(from: Currency, to: Currency): Promise<number> {
  if (from === to) return 1.0;

  if (!ENV.FIXER_API_KEY) {
    logWarn('Fixer API key not configured, using fallback rates');
    return getFallbackRate(from, to);
  }

  try {
    const response = await fetch(
      `https://api.fixer.io/latest?access_key=${ENV.FIXER_API_KEY}&base=${from}&symbols=${to}`
    );

    if (!response.ok) {
      throw new Error(`Fixer API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.info || 'Unknown error');
    }

    return data.rates[to];
  } catch (error) {
    logError('Failed to fetch exchange rate from API', error);
    return getFallbackRate(from, to);
  }
}

/**
 * Fallback rates (approximate, for development)
 * In production, you should always use a real API
 */
function getFallbackRate(from: Currency, to: Currency): number {
  const rates: Record<Currency, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.88,
    CNY: 7.24,
    INR: 83.12,
    SGD: 1.34,
    HKD: 7.82,
    NZD: 1.65,
    SEK: 10.52,
    KRW: 1328.50,
    NOK: 10.72,
    MXN: 17.15,
    BRL: 4.97,
    ZAR: 18.65,
    RUB: 92.50,
    TRY: 32.15,
  };

  const fromRate = rates[from] || 1.0;
  const toRate = rates[to] || 1.0;

  return toRate / fromRate;
}

/**
 * Get cached exchange rate or fetch new one
 */
async function getExchangeRate(from: Currency, to: Currency): Promise<{ rate: number; date: Date }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check cache first
  const cached = await prisma.currencyRate.findFirst({
    where: {
      fromCurrency: from,
      toCurrency: to,
      date: {
        gte: today,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (cached) {
    logInfo('Using cached exchange rate', { from, to, rate: Number(cached.rate) });
    return { rate: Number(cached.rate), date: cached.date };
  }

  // Fetch new rate
  const rate = await fetchExchangeRate(from, to);

  // Cache the rate
  try {
    await prisma.currencyRate.create({
      data: {
        fromCurrency: from,
        toCurrency: to,
        rate: new Decimal(rate),
        date: today,
      },
    });
  } catch (error) {
    // Ignore cache errors
    logWarn('Failed to cache exchange rate', { error });
  }

  return { rate, date: today };
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): Promise<ConversionResult> {
  try {
    if (from === to) {
      return {
        fromCurrency: from,
        toCurrency: to,
        originalAmount: amount,
        convertedAmount: amount,
        rate: 1.0,
        rateDate: new Date(),
      };
    }

    const { rate, date } = await getExchangeRate(from, to);
    const convertedAmount = amount * rate;

    logInfo('Currency converted', {
      from,
      to,
      amount,
      convertedAmount,
      rate,
    });

    return {
      fromCurrency: from,
      toCurrency: to,
      originalAmount: amount,
      convertedAmount,
      rate,
      rateDate: date,
    };
  } catch (error) {
    logError('Currency conversion failed', error);
    throw new Error('Failed to convert currency');
  }
}

/**
 * Format amount with currency symbol
 */
export function formatCurrency(amount: number, currency: Currency, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency, locale = 'en-US'): string {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(0);

  // Extract symbol (remove digits and spaces)
  return formatted.replace(/[\d\s.,]/g, '').trim();
}

/**
 * Get all supported currencies with names
 */
export function getSupportedCurrencies() {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  ];
}

/**
 * Update user's preferred currency
 */
export async function updateUserCurrency(userId: string, currency: Currency) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { preferredCurrency: currency },
    });

    logInfo('User currency updated', { userId, currency });
  } catch (error) {
    logError('Failed to update user currency', error);
    throw new Error('Failed to update currency preference');
  }
}
