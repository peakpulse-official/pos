// src/components/reports/SalesSummaryCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react"

interface SalesSummaryCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  trend?: string // e.g., "+5.2% from last month"
}

export function SalesSummaryCard({ title, value, icon: Icon, description, trend }: SalesSummaryCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-headline text-foreground">{typeof value === 'number' && title.toLowerCase().includes('revenue') ? `NPR ${value.toLocaleString()}` : value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && <p className="text-xs text-green-600 dark:text-green-400 mt-1">{trend}</p>}
      </CardContent>
    </Card>
  )
}
