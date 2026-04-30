import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction } from '../types';

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
}

interface BudgetState {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  removeBudget: (id: string) => void;
  updateBudget: (id: string, data: Partial<Budget>) => void;
  updateSpending: (category: string, amount: number) => void;
  getBudgetStatus: (category: string) => Budget | undefined;
  checkBudgetAlerts: () => { category: string; percentage: number }[];
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],

      addBudget: (budget) => {
        const id = `budget-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        set((state) => ({
          budgets: [...state.budgets, { ...budget, id }],
        }));
      },

      removeBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },

      updateBudget: (id, data) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        }));
      },

      updateSpending: (category, amount) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.category === category
              ? { ...b, spent: b.spent + amount }
              : b
          ),
        }));
      },

      getBudgetStatus: (category) => {
        return get().budgets.find((b) => b.category === category);
      },

      checkBudgetAlerts: () => {
        const alerts: { category: string; percentage: number }[] = [];
        get().budgets.forEach((b) => {
          const percentage = (b.spent / b.limit) * 100;
          if (percentage >= 80) {
            alerts.push({ category: b.category, percentage: Math.round(percentage) });
          }
        });
        return alerts;
      },
    }),
    {
      name: 'atlas-budgets',
    }
  )
);

export const calculateCategorySpending = (
  transactions: Transaction[],
  category: string
): number => {
  return transactions
    .filter((t) => t.category === category && t.type === 'saida')
    .reduce((acc, t) => {
      const value = parseFloat(
        t.amount.replace(/[R$\s.]/g, '').replace(',', '.')
      );
      return acc + (isNaN(value) ? 0 : value);
    }, 0);
};