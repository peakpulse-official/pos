
// src/app/(app)/reports/page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import type { Order, OrderItem } from "@/lib/types"
import { SalesSummaryCard } from "@/components/reports/SalesSummaryCard"
import { PopularItemsChart } from "@/components/reports/PopularItemsChart"
import { DollarSign, ShoppingBag, TrendingUp, Utensils, CalendarDays, LineChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO,isToday } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

const ORDERS_STORAGE_KEY = "annapurnaPosOrders";

interface AggregatedSalesData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  popularItems: { itemId: string, name: string, quantitySold: number, revenue: number }[];
}

const initialAggregatedSalesData: AggregatedSalesData = {
  totalRevenue: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  popularItems: [],
};

export default function ReportsPage() {
  const [localStorageOrders, setLocalStorageOrders] = useState<Order[]>([]);
  const [currentMonthName, setCurrentMonthName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
      const orders: Order[] = storedOrdersRaw ? JSON.parse(storedOrdersRaw) : [];
      setLocalStorageOrders(orders.filter(order => order.status === 'paid')); // Only use paid orders
      
      const now = new Date();
      setCurrentMonthName(format(now, "MMMM yyyy"));

    } catch (error) {
      console.error("Error processing orders for reports", error);
      setLocalStorageOrders([]);
    }
    setIsLoading(false);
  }, []);

  const aggregateSalesData = (orders: Order[], startDate?: Date, endDate?: Date): AggregatedSalesData => {
    const relevantOrders = orders.filter(order => {
      const orderDate = parseISO(order.createdAt);
      if (startDate && endDate) { // Monthly or custom range
        return isWithinInterval(orderDate, { start: startDate, end: endDate });
      } else if (startDate && !endDate) { // Daily (startDate is the day)
        return isToday(orderDate);
      }
      return true; // No date filter, process all (though we'll use specific filters)
    });

    const totalRevenue = relevantOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = relevantOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const itemCounts: Record<string, { name: string, quantitySold: number, revenue: number }> = {};
    relevantOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCounts[item.id]) {
          itemCounts[item.id] = { name: item.name, quantitySold: 0, revenue: 0 };
        }
        itemCounts[item.id].quantitySold += item.quantity;
        itemCounts[item.id].revenue += item.quantity * item.price;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([itemId, data]) => ({ itemId, ...data }))
      .sort((a, b) => b.quantitySold - a.quantitySold);
      
    return { totalRevenue, totalOrders, averageOrderValue, popularItems };
  };

  const monthlySales = useMemo(() => {
    if (isLoading) return initialAggregatedSalesData;
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    return aggregateSalesData(localStorageOrders, monthStart, monthEnd);
  }, [localStorageOrders, isLoading]);

  const todaysSales = useMemo(() => {
    if (isLoading) return initialAggregatedSalesData;
     const todayStart = new Date(); // aggregateSalesData handles filtering for today correctly
    return aggregateSalesData(localStorageOrders, todayStart);
  }, [localStorageOrders, isLoading]);


  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-1/2 mb-1" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <Skeleton className="h-10 w-1/3 my-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Sales Performance Report</h1>
        <p className="text-muted-foreground">Dynamic overview of sales from completed orders.</p>
      </div>

      <Alert variant="default" className="bg-primary/5 border-primary/30 text-primary-foreground">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary/90">Data Source Note</AlertTitle>
        <AlertDescription className="text-primary/80">
          All sales data presented here is derived from 'paid' orders recorded in the application's local storage. 
          This primarily includes takeout and delivery orders. Dine-in table orders are managed separately in this prototype.
        </AlertDescription>
      </Alert>


      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center text-primary">
                <CalendarDays className="mr-3 h-7 w-7" /> Current Month Performance: {currentMonthName}
            </CardTitle>
            <CardDescription>Summary of sales activity for the current calendar month.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <SalesSummaryCard 
                title="Total Revenue (This Month)" 
                value={monthlySales.totalRevenue.toFixed(2)} 
                icon={DollarSign} 
                description={`From ${monthlySales.totalOrders} orders.`}
                />
                <SalesSummaryCard 
                title="Total Orders (This Month)" 
                value={monthlySales.totalOrders} 
                icon={ShoppingBag} 
                description="Number of paid orders this month."
                />
                <SalesSummaryCard 
                title="Avg. Order Value (This Month)" 
                value={monthlySales.averageOrderValue.toFixed(2)} 
                icon={TrendingUp} 
                description="Average amount per paid order."
                />
            </div>
            
            {monthlySales.popularItems.length > 0 ? (
                <PopularItemsChart data={monthlySales.popularItems} />
            ) : (
                <p className="text-muted-foreground text-center py-4">No sales data for popular items this month.</p>
            )}

            <div>
                <h3 className="text-lg font-semibold mb-3 font-headline flex items-center">
                    <LineChart className="mr-2 h-5 w-5 text-primary/80" /> Detailed Item Sales (This Month)
                </h3>
                {monthlySales.popularItems.length > 0 ? (
                    <ScrollArea className="h-[300px] border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead className="text-right">Quantity Sold</TableHead>
                            <TableHead className="text-right">Total Revenue (NPR)</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {monthlySales.popularItems.map((item) => (
                            <TableRow key={item.itemId}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.quantitySold}</TableCell>
                            <TableCell className="text-right">{item.revenue.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </ScrollArea>
                ) : (
                    <p className="text-muted-foreground text-center py-4">No itemized sales data available for this month.</p>
                )}
            </div>
        </CardContent>
      </Card>


      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center text-primary/90">
                <CalendarDays className="mr-2 h-5 w-5" /> Today's Sales Snapshot ({format(new Date(), "MMM d, yyyy")})
            </CardTitle>
            <CardDescription>Quick overview of sales activity for today.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="grid gap-4 md:grid-cols-2">
                <SalesSummaryCard 
                title="Total Revenue (Today)" 
                value={todaysSales.totalRevenue.toFixed(2)} 
                icon={DollarSign} 
                description={`From ${todaysSales.totalOrders} orders today.`}
                />
                <SalesSummaryCard 
                title="Total Orders (Today)" 
                value={todaysSales.totalOrders} 
                icon={ShoppingBag} 
                description="Number of paid orders today."
                />
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

