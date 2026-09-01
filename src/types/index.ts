export interface SummaryCard {
  title: string;
  value: string;
  change: string;
  tone: 'positive' | 'negative';
}

export interface MonthlyExpense {
  month: string;
  value: number;
}

export interface Transaction {
  id: number;
  name: string;
  category: string;
  type: 'entrada' | 'saida';
  amount: number;
  date: string;
}

export interface MenuItem {
  label: string;
  path?: string;
  active?: boolean;
}