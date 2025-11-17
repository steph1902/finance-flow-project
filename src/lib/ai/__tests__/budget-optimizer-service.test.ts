/**
 * @jest-environment node
 */
import { calculateActualSpending, analyzeVariance } from '../budget-optimizer-service';

describe('budget-optimizer-service', () => {
  describe('calculateActualSpending', () => {
    it('should calculate average spending per category', () => {
      const transactions = [
        {
          id: '1',
          userId: 'user1',
          description: 'Grocery',
          amount: 100,
          type: 'EXPENSE' as const,
          category: 'Food',
          date: new Date('2024-01-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: null,
        },
        {
          id: '2',
          userId: 'user1',
          description: 'Restaurant',
          amount: 50,
          type: 'EXPENSE' as const,
          category: 'Food',
          date: new Date('2024-02-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: null,
        },
        {
          id: '3',
          userId: 'user1',
          description: 'Uber',
          amount: 30,
          type: 'EXPENSE' as const,
          category: 'Transport',
          date: new Date('2024-01-20'),
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: null,
        },
      ];

      const result = calculateActualSpending(transactions, 2);

      expect(result.Food).toBe(75); // (100 + 50) / 2 months
      expect(result.Transport).toBe(15); // 30 / 2 months
    });

    it('should handle empty transactions', () => {
      const result = calculateActualSpending([], 3);
      expect(result).toEqual({});
    });

    it('should handle single month', () => {
      const transactions = [
        {
          id: '1',
          userId: 'user1',
          description: 'Test',
          amount: 100,
          type: 'EXPENSE' as const,
          category: 'Food',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: null,
        },
      ];

      const result = calculateActualSpending(transactions, 1);
      expect(result.Food).toBe(100);
    });
  });

  describe('analyzeVariance', () => {
    it('should categorize budgets as over/under/balanced', () => {
      const budgets = [
        {
          id: '1',
          userId: 'user1',
          category: 'Food',
          amount: 100,
          month: 1,
          year: 2024,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          category: 'Transport',
          amount: 50,
          month: 1,
          year: 2024,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          userId: 'user1',
          category: 'Entertainment',
          amount: 100,
          month: 1,
          year: 2024,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const actualSpending = {
        Food: 150, // 50% over budget
        Transport: 25, // 50% under budget
        Entertainment: 95, // 5% under (balanced)
      };

      const result = analyzeVariance(budgets, actualSpending);

      expect(result.overBudget).toHaveLength(1);
      expect(result.overBudget[0].category).toBe('Food');
      expect(result.overBudget[0].variance).toBe(50);

      expect(result.underBudget).toHaveLength(1);
      expect(result.underBudget[0].category).toBe('Transport');
      expect(result.underBudget[0].variance).toBe(-50);

      expect(result.balanced).toHaveLength(1);
      expect(result.balanced[0].category).toBe('Entertainment');
    });

    it('should handle categories with no spending', () => {
      const budgets = [
        {
          id: '1',
          userId: 'user1',
          category: 'Food',
          amount: 100,
          month: 1,
          year: 2024,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const actualSpending = {}; // No spending

      const result = analyzeVariance(budgets, actualSpending);

      expect(result.underBudget).toHaveLength(1);
      expect(result.underBudget[0].actual).toBe(0);
    });
  });
});
