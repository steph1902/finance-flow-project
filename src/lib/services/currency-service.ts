/**
 * Currency Service (Display Preference Only)
 * 
 * Handles static currency data and user preference updates.
 * Real-time conversion logic has been removed to simplify the architecture.
 */

import { prisma } from '@/lib/prisma';
import { logInfo, logError } from '@/lib/logger';

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
];

export const SUPPORTED_CURRENCIES = CURRENCIES.map(c => c.code) as [string, ...string[]];

export type Currency = typeof SUPPORTED_CURRENCIES[number];

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
/**
 * Get all supported currencies with names
 */
export function getSupportedCurrencies() {
  return CURRENCIES;
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
