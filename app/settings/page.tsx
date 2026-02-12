'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { Download, Trash2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const handleExport = async () => {
    const transactions = await db.transactions.toArray();
    // Simple CSV construction manually to avoid extra dependencies for this demo, 
    // but in real app stick to Papaparse if preferred.
    const headers = ['Type', 'Category', 'Title', 'Amount', 'Date', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => 
        [t.type, t.category, `"${t.title}"`, t.amount, t.date.toISOString(), `"${t.notes || ''}"`].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fintrack_backup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearData = async () => {
    if (confirm('PERINGATAN: Semua data akan dihapus permanen. Lanjutkan?')) {
      await db.transactions.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">Sesuaikan preferensi aplikasi Anda.</p>
      </div>

      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>Tampilan</CardTitle>
          <CardDescription>Pilih tema terang atau gelap.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-medium">Mode Tema</span>
            <p className="text-xs text-muted-foreground">{theme === 'dark' ? 'Gelap' : 'Terang'}</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-xl">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-red-100 dark:border-red-900 shadow-sm">
        <CardHeader>
          <CardTitle>Data</CardTitle>
          <CardDescription>Kelola data lokal browser Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="space-y-1">
              <span className="font-medium">Ekspor CSV</span>
              <p className="text-xs text-muted-foreground">Unduh riwayat transaksi.</p>
            </div>
            <Button variant="outline" onClick={handleExport} className="rounded-xl">
              <Download className="mr-2 h-4 w-4" /> Ekspor
            </Button>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <span className="font-medium text-red-600">Hapus Semua Data</span>
              <p className="text-xs text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <Button variant="destructive" onClick={handleClearData} className="rounded-xl">
              <Trash2 className="mr-2 h-4 w-4" /> Reset Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
