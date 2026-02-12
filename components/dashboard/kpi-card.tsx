import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string; // e.g., "+12%"
  variant?: 'default' | 'success' | 'danger';
}

export function KPICard({ title, amount, icon: Icon, variant = 'default' }: KPICardProps) {
  const colorStyles = {
    default: "text-primary",
    success: "text-green-600 dark:text-green-400",
    danger: "text-red-600 dark:text-red-400",
  };

  const bgStyles = {
    default: "bg-blue-100 dark:bg-blue-900/30",
    success: "bg-green-100 dark:bg-green-900/30",
    danger: "bg-red-100 dark:bg-red-900/30",
  };

  return (
    <Card className="rounded-2xl shadow-sm border-none bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", bgStyles[variant])}>
          <Icon className={cn("h-4 w-4", colorStyles[variant])} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold tracking-tight", colorStyles[variant])}>
          {formatCurrency(amount)}
        </div>
      </CardContent>
    </Card>
  );
}
