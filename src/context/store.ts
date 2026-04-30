import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, SummaryCard, MonthlyExpense } from '../types';
import { transactions as mockTransactions, summaryCards as mockSummaryCards, monthlyExpenses as mockMonthlyExpenses } from '../data/mockData';
import { sanitizeString, sanitizeAmount, sanitizeDate } from '../utils/validation';
import { logTransactionAdded, logTransactionRemoved, logThemeChanged, logDataExported, logAppStarted } from '../utils/auditLogger';
import { toast } from '../components/Toast';

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
      theme: 'night',
      loading: false,
      searchQuery: '',
      dateFilter: null,

      setFilter: (filter) => set({ filter }),

      setTheme: (theme) => {
        const oldTheme = get().theme;
        set({ theme });
        logThemeChanged(oldTheme, theme);
      },

      toggleTheme: () => {
        const current = get().theme;
        const newTheme = current === 'paper' ? 'night' : 'paper';
        set({ theme: newTheme });
        logThemeChanged(current, newTheme);
      },

      setLoading: (loading) => set({ loading }),
      setSearchQuery: (query) => set({ searchQuery: sanitizeString(query) }),
      setDateFilter: (filter) => set({ dateFilter: filter }),

      addTransaction: (transaction) => {
        const { transactions } = get();

        const sanitized = {
          name: sanitizeString(transaction.name),
          category: sanitizeString(transaction.category),
          type: transaction.type === 'entrada' ? 'entrada' : 'saida',
          amount: transaction.amount,
          date: sanitizeDate(transaction.date),
        };

        if (sanitized.name.length < 2) {
          toast.error('Erro', 'Nome inválido');
          return;
        }

        const newId = Math.max(...transactions.map(t => t.id), 0) + 1;
        const newTransaction = { ...sanitized, id: newId };

        set({ transactions: [...transactions, newTransaction] });
        logTransactionAdded(sanitized.name, sanitized.amount);
        toast.success('Sucesso', 'Transação adicionada');
      },

      removeTransaction: (id) => {
        const { transactions } = get();
        const target = transactions.find(t => t.id === id);

        if (target) {
          set({ transactions: transactions.filter(t => t.id !== id) });
          logTransactionRemoved(id, target.name);
          toast.success('Removido', 'Transação removida');
        }
      },

      updateTransaction: (id, data) => {
        const { transactions } = get();

        const sanitized = {
          ...data,
          name: data.name ? sanitizeString(data.name) : undefined,
          category: data.category ? sanitizeString(data.category) : undefined,
        };

        set({
          transactions: transactions.map(t =>
            t.id === id ? { ...t, ...sanitized } : t
          ),
        });
      },

      resetData: () => {
        set({
          transactions: mockTransactions,
          summaryCards: mockSummaryCards,
          monthlyExpenses: mockMonthlyExpenses,
        });
        logDataExported('RESET');
        toast.success('Resetado', 'Dados restaurados');
      },
    }),
    {
      name: 'atlas-finance-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        summaryCards: state.summaryCards,
        monthlyExpenses: state.monthlyExpenses,
        theme: state.theme,
      }),
    }
  )
);

logAppStarted();