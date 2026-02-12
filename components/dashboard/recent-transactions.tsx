import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Belum ada transaksi.</div>;
  }

  return (
    <div className="space-y-4">
      {transactions.map((t) => (
        <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm leading-none">{t.title}</p>
              <p className="text-xs text-muted-foreground">{t.category} • {formatDate(t.date)}</p>
            </div>
          </div>
          <div className={`font-semibold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
