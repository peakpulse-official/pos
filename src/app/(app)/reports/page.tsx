// src/app/(app)/reports/page.tsx
"use client"

import { useState, useEffect } from "react"
import { mockDailySales } from "@/lib/data"
import type { DailySales } from "@/lib/types"
import { SalesSummaryCard } from "@/components/reports/SalesSummaryCard"
import { PopularItemsChart } from "@/components/reports/PopularItemsChart"
import { DollarSign, ShoppingBag, Users, TrendingUp, BarChartBig, Coffee, Utensils } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

export default function ReportsPage() {
  // In a real app, this data would be fetched
  const [salesData, setSalesData] = useState<DailySales>(mockDailySales)
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(format(new Date(), "MMMM d, yyyy"));
  }, []);

  if (!salesData) {
    // Basic loading state or skeleton
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-headline font-bold text-primary">Sales Reports</h1>
        <p>Loading sales data...</p>
      </div>
    )
  }

  const averageOrderValue = salesData.totalOrders > 0 ? salesData.totalRevenue / salesData.totalOrders : 0;

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
          description="Total income from all sales."
          trend="+2.5% vs yesterday"
        />
        <SalesSummaryCard 
          title="Total Orders" 
          value={salesData.totalOrders} 
          icon={ShoppingBag} 
          description="Number of orders processed."
          trend="-1.0% vs yesterday"
        />
        <SalesSummaryCard 
          title="Average Order Value" 
          value={averageOrderValue.toFixed(2)} 
          icon={TrendingUp} 
          description="Average amount spent per order."
          trend="+0.5% vs yesterday"
        />
         <SalesSummaryCard 
          title="Top Item" 
          value={salesData.popularItems[0]?.name || 'N/A'}
          icon={Utensils} 
          description={`Sold ${salesData.popularItems[0]?.quantitySold || 0} times`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PopularItemsChart data={salesData.popularItems} />
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Item Sales Details</CardTitle>
            <CardDescription>Breakdown of sales by item for today.</CardDescription>
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
                  {salesData.popularItems.map((item) => {
                    // Find item price (mocked logic, in real app, join with menu items)
                    const menuItem = mockDailySales.popularItems.find(mi => mi.itemId === item.itemId);
                    const price = menuItem ? (Math.random() * 300 + 50) : 0; // Mock price if not found
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
