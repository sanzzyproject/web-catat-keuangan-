'use client';
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  
  const categories = useLiveQuery(
    () => db.categories.where('type').equals(type).toArray(),
    [type]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !title) return;

    await db.transactions.add({
      type,
      title,
      amount: parseFloat(amount),
      category,
      date: date || new Date(),
      notes,
      createdAt: new Date(),
    });

    onSuccess();
    // Reset handled by parent closing dialog or manual reset here if needed
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-3 p-1 bg-muted rounded-xl">
        <Button
          type="button"
          variant={type === 'income' ? 'default' : 'ghost'}
          onClick={() => { setType('income'); setCategory(''); }}
          className="rounded-lg shadow-none"
        >
          Pemasukan
        </Button>
        <Button
          type="button"
          variant={type === 'expense' ? 'default' : 'ghost'}
          onClick={() => { setType('expense'); setCategory(''); }}
          className="rounded-lg shadow-none"
        >
          Pengeluaran
        </Button>
      </div>

      <div className="grid gap-2">
        <Label>Judul</Label>
        <Input placeholder="Contoh: Makan Siang" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="grid gap-2">
        <Label>Jumlah (Rp)</Label>
        <Input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>

      <div className="grid gap-2">
        <Label>Kategori</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Tanggal</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDate(date) : <span>Pilih tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label>Catatan (Opsional)</Label>
        <Textarea placeholder="Catatan tambahan..." value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <Button type="submit" className="w-full mt-2">Simpan Transaksi</Button>
    </form>
  );
}
