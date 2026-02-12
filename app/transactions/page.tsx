'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2, Search } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useState } from 'react';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const transactions = useLiveQuery(async () => {
    let collection = db.transactions.orderBy('date').reverse();
    
    // Filtering logic happens here or in memory
    // Since Dexie basic filtering is limited, we fetch and filter arrays for complex queries in small apps
    // For larger apps, use compound indices
    const all = await collection.toArray();
    
    return all.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                            t.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [search, filterType]);

  const handleDelete = async (id: number) => {
    if (confirm('Hapus transaksi ini?')) {
      await db.transactions.delete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaksi</h1>
        <p className="text-muted-foreground">Kelola semua riwayat pemasukan dan pengeluaran.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari transaksi..." 
            className="pl-9 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px] rounded-xl">
            <SelectValue placeholder="Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="income">Pemasukan</SelectItem>
            <SelectItem value="expense">Pengeluaran</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {transactions?.map((t) => (
              <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col gap-1 mb-2 sm:mb-0">
                  <span className="font-semibold">{t.title}</span>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className="bg-secondary px-2 py-0.5 rounded-md">{t.category}</span>
                    <span>{formatDate(t.date)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => t.id && handleDelete(t.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {transactions?.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">Tidak ada transaksi ditemukan.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
