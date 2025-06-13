// src/components/reports/PopularItemsChart.tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DailySales } from "@/lib/types"

interface PopularItemsChartProps {
  data: DailySales['popularItems']
}

const chartConfig = {
  quantitySold: {
    label: "Quantity Sold",
    color: "hsl(var(--primary))", // Saffron
  },
} satisfies Record<string, { label: string; color: string }>


export function PopularItemsChart({ data }: PopularItemsChartProps) {
  const chartData = data.map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 12) + "..." : item.name, // Truncate long names
    quantitySold: item.quantitySold,
  }));
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Top Selling Items</CardTitle>
        <CardDescription>Based on quantity sold today.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              interval={0}
              tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: chartConfig.quantitySold.color }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="quantitySold" fill={chartConfig.quantitySold.color} name={chartConfig.quantitySold.label} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
