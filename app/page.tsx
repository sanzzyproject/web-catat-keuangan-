'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { KPICard } from '@/components/dashboard/kpi-card';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { OverviewChart } from '@/components/charts/overview-chart';
import { TransactionForm } from '@/components/forms/transaction-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Wallet, Plus } from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  const transactions = useLiveQuery(() => 
    db.transactions.orderBy('date').reverse().limit(5).toArray()
  );

  const stats = useLiveQuery(async () => {
    const all = await db.transactions.toArray();
    const income = all.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = all.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  });

  const chartData = useLiveQuery(async () => {
    const all = await db.transactions.orderBy('date').limit(50).toArray();
    // Simplified: Show last 50 transactions as bars
    // In production: Group by Month/Week
    return all.map(t => ({
      name: t.title.substring(0, 10),
      amount: t.type === 'income' ? t.amount : t.amount // Just showing magnitude
    })).slice(-7); // Last 7 items for cleanliness
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Ringkasan keuangan Anda hari ini.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-5 w-5" /> Transaksi Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Transaksi</DialogTitle>
            </DialogHeader>
            <TransactionForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPICard 
          title="Total Saldo" 
          amount={stats?.balance || 0} 
          icon={Wallet} 
          variant="default"
        />
        <KPICard 
          title="Pemasukan" 
          amount={stats?.income || 0} 
          icon={ArrowUp} 
          variant="success"
        />
        <KPICard 
          title="Pengeluaran" 
          amount={stats?.expense || 0} 
          icon={ArrowDown} 
          variant="danger"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle>Aktivitas Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewChart data={chartData || []} />
          </CardContent>
        </Card>

        <Card className="col-span-3 rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle>Riwayat Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={transactions || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
