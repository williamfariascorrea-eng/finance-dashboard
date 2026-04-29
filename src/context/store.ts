import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, SummaryCard, MonthlyExpense } from '../types';
import { transactions as mockTransactions, summaryCards as mockSummaryCards, monthlyExpenses as mockMonthlyExpenses } from '../data/mockData';

interface FinanceState {
  transactions: Transaction[];
  summaryCards: SummaryCard[];
  monthlyExpenses: MonthlyExpense[];
  filter: 'all' | 'entrada' | 'saida';
  theme: 'paper' | 'night';
  loading: boolean;
  searchQuery: string;
  dateFilter: { start: string; end: string } | null;
  setFilter: (filter: 'all' | 'entrada' | 'saida') => void;
  setTheme: (theme: 'paper' | 'night') => void;
  toggleTheme: () => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setDateFilter: (filter: { start: string; end: string } | null) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: number) => void;
  updateTransaction: (id: number, data: Partial<Transaction>) => void;
  resetData: () => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      summaryCards: mockSummaryCards,
      monthlyExpenses: mockMonthlyExpenses,
      filter: 'all',
      theme: 'paper',
      loading: false,
      searchQuery: '',
      dateFilter: null,
      setFilter: (filter) => set({ filter }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'paper' ? 'night' : 'paper' })),
      setLoading: (loading) => set({ loading }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setDateFilter: (filter) => set({ dateFilter: filter }),
      addTransaction: (transaction) => {
        const { transactions } = get();
        const newTransaction = {
          ...transaction,
          id: Math.max(...transactions.map(t => t.id), 0) + 1,
        };
        set({ transactions: [...transactions, newTransaction] });
      },
      removeTransaction: (id) => {
        const { transactions } = get();
        set({ transactions: transactions.filter(t => t.id !== id) });
      },
      updateTransaction: (id, data) => {
        const { transactions } = get();
        set({
          transactions: transactions.map(t =>
            t.id === id ? { ...t, ...data } : t
          ),
        });
      },
      resetData: () => {
        set({
          transactions: mockTransactions,
          summaryCards: mockSummaryCards,
          monthlyExpenses: mockMonthlyExpenses,
        });
      },
    }),
    {
      name: 'atlas-finance-storage',
    }
  )
);