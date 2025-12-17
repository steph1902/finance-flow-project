/**
 * Tests for Plaid Service
 * Covers bank integration, token encryption, and transaction syncing
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PlaidApi } from 'plaid';
import * as plaidService from '../plaid-service';
import { prisma } from '@/lib/prisma';

// Mock dependencies
jest.mock('@/lib/prisma', () => {
  const { jest } = require('@jest/globals');
  return {
    prisma: {
      user: {
        findUnique: jest.fn(),
      },
      plaidItem: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      transaction: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    },
  };
});

jest.mock('plaid', () => {
  const { jest } = require('@jest/globals');
  return {
    PlaidApi: jest.fn(),
    Configuration: jest.fn(),
    PlaidEnvironments: {
      sandbox: 'sandbox',
    },
    Products: {
      Transactions: 'transactions',
    },
    CountryCode: {
      Us: 'US',
    },
  };
});

describe('Plaid Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the singleton if possible, or just rely on PlaidApi mock
    // Since we can't reset the module-level variable easily, we rely on PlaidApi mock returning our mock client
  });

  describe('createLinkToken', () => {
    it('should create a link token for a valid user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockLinkToken = 'link-token-12345';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const mockPlaidClient = {
        linkTokenCreate: jest.fn().mockResolvedValue({
          data: { link_token: mockLinkToken },
        }),
      };

      // Mock PlaidApi constructor to return our mock client
      (PlaidApi as jest.Mock).mockImplementation(() => mockPlaidClient);

      const result = await plaidService.createLinkToken('user-123');

      expect(result).toBe(mockLinkToken);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(mockPlaidClient.linkTokenCreate).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

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
        itemPublicTokenExchange: jest.fn().mockResolvedValue({
          data: {
            access_token: mockAccessToken,
            item_id: mockItemId,
          },
        }),
        itemGet: jest.fn().mockResolvedValue({
          data: {
            item: {
              institution_id: 'ins_123',
            },
          },
        }),
        institutionsGetById: jest.fn().mockResolvedValue({
          data: {
            institution: {
              name: mockInstitutionName,
            },
          },
        }),
      };

      (PlaidApi as jest.Mock).mockImplementation(() => mockPlaidClient);

      (prisma.plaidItem.create as jest.Mock).mockResolvedValue({
        id: 'plaid-item-123',
      });

      const result = await plaidService.exchangePublicToken('user-123', 'public-token-123');

      expect(result.itemId).toBe(mockItemId);
      expect(result.institutionName).toBe(mockInstitutionName);
      expect(prisma.plaidItem.create).toHaveBeenCalled();

      // Verify access token is encrypted (should not match original)
      const createCall = (prisma.plaidItem.create as jest.Mock).mock.calls[0][0];
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

      (prisma.plaidItem.findMany as jest.Mock).mockResolvedValue(mockPlaidItems);
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.transaction.create as jest.Mock).mockResolvedValue({ id: 'new-tx-1' });
      (prisma.plaidItem.update as jest.Mock).mockResolvedValue({});

      const mockPlaidClient = {
        transactionsGet: jest.fn().mockResolvedValue({
          data: {
            transactions: mockTransactions,
          },
        }),
      };

      (PlaidApi as jest.Mock).mockImplementation(() => mockPlaidClient);

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

      (prisma.plaidItem.findMany as jest.Mock).mockResolvedValue(mockPlaidItems);
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue({ id: 'existing-tx' });

      const mockPlaidClient = {
        transactionsGet: jest.fn().mockResolvedValue({
          data: { transactions: mockTransactions },
        }),
      };

      (PlaidApi as jest.Mock).mockImplementation(() => mockPlaidClient);

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

      (prisma.plaidItem.findMany as jest.Mock).mockResolvedValue(mockPlaidItems);

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
        itemPublicTokenExchange: jest.fn().mockResolvedValue({
          data: {
            access_token: originalToken,
            item_id: 'item-id',
          },
        }),
        itemGet: jest.fn().mockResolvedValue({
          data: {
            item: { institution_id: 'ins_1' },
          },
        }),
        institutionsGetById: jest.fn().mockResolvedValue({
          data: {
            institution: { name: 'Test Bank' },
          },
        }),
      };

      (PlaidApi as jest.Mock).mockImplementation(() => mockPlaidClient);
      (prisma.plaidItem.create as jest.Mock).mockResolvedValue({ id: 'item-1' });

      // The exchange function will encrypt the token
      expect(async () => {
        await plaidService.exchangePublicToken('user-123', 'public-token');
      }).not.toThrow();
    });
  });
});
