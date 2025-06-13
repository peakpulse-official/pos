// src/app/(app)/reports/page.tsx
"use client"

import { useState, useEffect } from "react"
import { mockDailySales } from "@/lib/data"
import type { DailySales, Order } from "@/lib/types"
import { SalesSummaryCard } from "@/components/reports/SalesSummaryCard"
import { PopularItemsChart } from "@/components/reports/PopularItemsChart"
import { DollarSign, ShoppingBag, TrendingUp, Utensils } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

const ORDERS_STORAGE_KEY = "annapurnaPosOrders";

export default function ReportsPage() {
  const [salesData, setSalesData] = useState<DailySales | null>(null)
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentDate(format(new Date(), "MMMM d, yyyy"));
    try {
      const storedOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
      const storedOrders: Order[] = storedOrdersRaw ? JSON.parse(storedOrdersRaw) : [];
      
      const paidOrders = storedOrders.filter(order => order.status === 'paid');
      const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = paidOrders.length;

      // For popular items and item sales details, we'll still use mock data for this iteration.
      // A more robust solution would aggregate from all order items in localStorage.
      const updatedSalesData: DailySales = {
        ...mockDailySales, // Use mock for popular items structure
        totalRevenue: totalRevenue,
        totalOrders: totalOrders,
        date: new Date().toISOString().split('T')[0],
      };
      setSalesData(updatedSalesData);

    } catch (error) {
      console.error("Error processing orders for reports", error);
      setSalesData(mockDailySales); // Fallback to full mock data on error
    }
    setIsLoading(false);
  }, []);

  if (isLoading || !salesData) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-1/2 mb-1" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  const averageOrderValue = salesData.totalOrders > 0 ? salesData.totalRevenue / salesData.totalOrders : 0;
  const topMockItem = mockDailySales.popularItems[0]; // Still using mock for this specific card

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Sales Reports</h1>
        <p className="text-muted-foreground">Overview of sales performance for {currentDate}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SalesSummaryCard 
          title="Total Revenue" 
          value={salesData.totalRevenue.toFixed(2)} 
          icon={DollarSign} 
          description="Total income from all paid sales."
          // Trend data could be calculated if historical data was stored and compared
        />
        <SalesSummaryCard 
          title="Total Paid Orders" 
          value={salesData.totalOrders} 
          icon={ShoppingBag} 
          description="Number of paid orders processed."
        />
        <SalesSummaryCard 
          title="Average Order Value" 
          value={averageOrderValue.toFixed(2)} 
          icon={TrendingUp} 
          description="Avg. amount per paid order."
        />
         <SalesSummaryCard 
          title="Top Item (Mock)" 
          value={topMockItem?.name || 'N/A'}
          icon={Utensils} 
          description={`Sold ${topMockItem?.quantitySold || 0} times (mock data)`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* PopularItemsChart still uses mockDailySales.popularItems for its detailed breakdown */}
        <PopularItemsChart data={mockDailySales.popularItems} /> 
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Item Sales Details (Mock)</CardTitle>
            <CardDescription>Breakdown of sales by item (using mock data for detail).</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Quantity Sold</TableHead>
                    <TableHead className="text-right">Revenue (NPR)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDailySales.popularItems.map((item) => {
                    const price = (Math.random() * 300 + 50); 
                    const revenue = item.quantitySold * price;
                    return (
                      <TableRow key={item.itemId}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantitySold}</TableCell>
                        <TableCell className="text-right">{revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
