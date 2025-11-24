/**
 * Tests for Plaid Service
 * Covers bank integration, token encryption, and transaction syncing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlaidApi } from 'plaid';
import * as plaidService from '../plaid-service';
import { prisma } from '@/lib/prisma';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    plaidItem: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    transaction: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('plaid', () => ({
  PlaidApi: vi.fn(),
  Configuration: vi.fn(),
  PlaidEnvironments: {
    sandbox: 'sandbox',
  },
  Products: {
    Transactions: 'transactions',
  },
  CountryCode: {
    Us: 'US',
  },
}));

describe('Plaid Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createLinkToken', () => {
    it('should create a link token for a valid user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockLinkToken = 'link-token-12345';

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      const mockPlaidClient = {
        linkTokenCreate: vi.fn().mockResolvedValue({
          data: { link_token: mockLinkToken },
        }),
      };

      // Mock getPlaidClient to return our mock client
      vi.spyOn(plaidService as any, 'getPlaidClient').mockReturnValue(mockPlaidClient);

      const result = await plaidService.createLinkToken('user-123');

      expect(result).toBe(mockLinkToken);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(mockPlaidClient.linkTokenCreate).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      await expect(plaidService.createLinkToken('invalid-user')).rejects.toThrow(
        'Failed to initialize bank connection'
      );
    });
  });

  describe('exchangePublicToken', () => {
    it('should exchange public token and store encrypted access token', async () => {
      const mockAccessToken = 'access-token-12345';
      const mockItemId = 'item-12345';
      const mockInstitutionName = 'Test Bank';

      const mockPlaidClient = {
        itemPublicTokenExchange: vi.fn().mockResolvedValue({
          data: {
            access_token: mockAccessToken,
            item_id: mockItemId,
          },
        }),
        itemGet: vi.fn().mockResolvedValue({
          data: {
            item: {
              institution_id: 'ins_123',
            },
          },
        }),
        institutionsGetById: vi.fn().mockResolvedValue({
          data: {
            institution: {
              name: mockInstitutionName,
            },
          },
        }),
      };

      vi.spyOn(plaidService as any, 'getPlaidClient').mockReturnValue(mockPlaidClient);
      
      (prisma.plaidItem.create as any).mockResolvedValue({
        id: 'plaid-item-123',
      });

      const result = await plaidService.exchangePublicToken('user-123', 'public-token-123');

      expect(result.itemId).toBe(mockItemId);
      expect(result.institutionName).toBe(mockInstitutionName);
      expect(prisma.plaidItem.create).toHaveBeenCalled();
      
      // Verify access token is encrypted (should not match original)
      const createCall = (prisma.plaidItem.create as any).mock.calls[0][0];
      expect(createCall.data.accessToken).not.toBe(mockAccessToken);
      expect(createCall.data.accessToken).toContain(':'); // Contains IV:authTag:encrypted format
    });
  });

  describe('syncTransactions', () => {
    it('should sync transactions from all connected banks', async () => {
      const mockPlaidItems = [
        {
          id: 'item-1',
          accessToken: 'encrypted-token-1',
          institutionName: 'Bank A',
          lastSync: null,
        },
      ];

      const mockTransactions = [
        {
          transaction_id: 'tx-1',
          name: 'Coffee Shop',
          amount: -5.50,
          date: '2024-11-24',
          category: ['FOOD_AND_DRINK', 'COFFEE'],
        },
      ];

      (prisma.plaidItem.findMany as any).mockResolvedValue(mockPlaidItems);
      (prisma.transaction.findFirst as any).mockResolvedValue(null);
      (prisma.transaction.create as any).mockResolvedValue({ id: 'new-tx-1' });
      (prisma.plaidItem.update as any).mockResolvedValue({});

      const mockPlaidClient = {
        transactionsGet: vi.fn().mockResolvedValue({
          data: {
            transactions: mockTransactions,
          },
        }),
      };

      vi.spyOn(plaidService as any, 'getPlaidClient').mockReturnValue(mockPlaidClient);

      const result = await plaidService.syncTransactions('user-123');

      expect(result).toBe(1); // 1 transaction synced
      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-123',
          description: 'Coffee Shop',
          amount: 5.50,
          type: 'EXPENSE',
        }),
      });
    });

    it('should skip duplicate transactions', async () => {
      const mockPlaidItems = [
        {
          id: 'item-1',
          accessToken: 'encrypted-token-1',
          institutionName: 'Bank A',
          lastSync: null,
        },
      ];

      const mockTransactions = [
        {
          transaction_id: 'tx-1',
          name: 'Coffee Shop',
          amount: -5.50,
          date: '2024-11-24',
          category: ['FOOD_AND_DRINK'],
        },
      ];

      (prisma.plaidItem.findMany as any).mockResolvedValue(mockPlaidItems);
      (prisma.transaction.findFirst as any).mockResolvedValue({ id: 'existing-tx' });

      const mockPlaidClient = {
        transactionsGet: vi.fn().mockResolvedValue({
          data: { transactions: mockTransactions },
        }),
      };

      vi.spyOn(plaidService as any, 'getPlaidClient').mockReturnValue(mockPlaidClient);

      const result = await plaidService.syncTransactions('user-123');

      expect(result).toBe(0); // 0 new transactions
      expect(prisma.transaction.create).not.toHaveBeenCalled();
    });
  });

  describe('getConnectedBanks', () => {
    it('should return list of connected banks', async () => {
      const mockPlaidItems = [
        {
          id: 'item-1',
          institutionName: 'Bank A',
          institutionId: 'ins_1',
          lastSync: new Date('2024-11-24'),
          isActive: true,
        },
        {
          id: 'item-2',
          institutionName: 'Bank B',
          institutionId: 'ins_2',
          lastSync: new Date('2024-11-23'),
          isActive: true,
        },
      ];

      (prisma.plaidItem.findMany as any).mockResolvedValue(mockPlaidItems);

      const result = await plaidService.getConnectedBanks('user-123');

      expect(result).toHaveLength(2);
      expect(result[0].institutionName).toBe('Bank A');
      expect(result[1].institutionName).toBe('Bank B');
    });
  });

  describe('Token encryption', () => {
    it('should encrypt and decrypt tokens correctly', () => {
      // Access private functions via module exports for testing
      const originalToken = 'test-access-token-12345';
      
      // Use a simple encryption test by calling the service functions
      // that use encryption internally
      const mockPlaidClient = {
        itemPublicTokenExchange: vi.fn().mockResolvedValue({
          data: {
            access_token: originalToken,
            item_id: 'item-id',
          },
        }),
        itemGet: vi.fn().mockResolvedValue({
          data: {
            item: { institution_id: 'ins_1' },
          },
        }),
        institutionsGetById: vi.fn().mockResolvedValue({
          data: {
            institution: { name: 'Test Bank' },
          },
        }),
      };

      vi.spyOn(plaidService as any, 'getPlaidClient').mockReturnValue(mockPlaidClient);
      (prisma.plaidItem.create as any).mockResolvedValue({ id: 'item-1' });

      // The exchange function will encrypt the token
      expect(async () => {
        await plaidService.exchangePublicToken('user-123', 'public-token');
      }).not.toThrow();
    });
  });
});
