import Dexie, { Table } from 'dexie';
import { Transaction, Category } from '@/types';

class FinanceDB extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;

  constructor() {
    super('FinTrackDB');
    this.version(1).stores({
      transactions: '++id, type, category, date, title', // Added title for search
      categories: '++id, name, type'
    });
  }
}

export const db = new FinanceDB();

db.on('populate', () => {
  db.categories.bulkAdd([
    { name: 'Gaji', type: 'income' },
    { name: 'Freelance', type: 'income' },
    { name: 'Investasi', type: 'income' },
    { name: 'Makan', type: 'expense' },
    { name: 'Transportasi', type: 'expense' },
    { name: 'Tempat Tinggal', type: 'expense' },
    { name: 'Hiburan', type: 'expense' },
    { name: 'Belanja', type: 'expense' },
    { name: 'Tagihan', type: 'expense' },
  ]);
});
