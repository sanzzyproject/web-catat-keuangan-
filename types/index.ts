export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id?: number;
  type: TransactionType;
  title: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface Category {
  id?: number;
  name: string;
  type: TransactionType;
}

export interface KPIData {
  income: number;
  expense: number;
  balance: number;
}
