// src/app/(app)/billing/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { initialOrders as defaultInitialOrders } from "@/lib/data" // Keep as fallback/seed
import type { Order, Bill } from "@/lib/types"
import { BillDisplay } from "@/components/billing/BillDisplay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { Search, ListOrdered, FileText } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const ORDERS_STORAGE_KEY = "annapurnaPosOrders";

export default function BillingPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        // Optional: Seed with default orders if localStorage is empty
        // setOrders(defaultInitialOrders); 
        // localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(defaultInitialOrders));
        setOrders([]); // Or start with an empty list
      }
    } catch (error) {
      console.error("Failed to load orders from localStorage", error);
      setOrders([]); // Fallback to empty or defaultInitialOrders
    }
    setIsLoading(false);
  }, []);

  const generateBill = (order: Order): Bill => {
    const billNumber = `BILL-${order.orderNumber.replace('ORD', '')}-${Date.now().toString().slice(-4)}`
    return {
      ...order,
      billNumber,
      printedAt: new Date().toISOString(),
    }
  }

  const handleSelectOrder = (order: Order) => {
    const bill = generateBill(order)
    setSelectedBill(bill)
  }

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());
  }, [orders, searchTerm])

  const getStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch(status) {
      case 'paid': return 'default'; 
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 h-full">
        <div className="md:col-span-1 flex flex-col">
          <Card className="shadow-lg flex-grow flex flex-col">
            <CardHeader className="border-b">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-hidden">
              <div className="p-3 space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="flex flex-col items-center justify-center min-h-[400px] text-center shadow-lg h-full">
            <Skeleton className="h-16 w-16 mb-4 rounded-full" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </Card>
        </div>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 h-full">
      <div className="md:col-span-1 flex flex-col">
        <Card className="shadow-lg flex-grow flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="font-headline text-xl flex items-center">
              <ListOrdered className="mr-2 h-6 w-6 text-primary" /> Recent Orders
            </CardTitle>
            <div className="relative mt-2">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full text-sm"
                />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-grow overflow-hidden">
            <ScrollArea className="h-[calc(100vh-16rem)] md:h-full p-3">
              {filteredOrders.length > 0 ? (
                <ul className="space-y-3">
                  {filteredOrders.map((order) => (
                    <li key={order.id}>
                      <Button
                        variant={selectedBill?.orderNumber === order.orderNumber ? "secondary" : "ghost"}
                        className="w-full justify-start h-auto p-3 text-left rounded-md hover:bg-muted/50 transition-colors"
                        onClick={() => handleSelectOrder(order)}
                      >
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm">{order.orderNumber}</span>
                                <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">{order.status.toUpperCase()}</Badge>
                            </div>
                            {order.customerName && <p className="text-xs text-muted-foreground">{order.customerName}</p>}
                            <p className="text-xs text-muted-foreground">{format(parseISO(order.createdAt), "MMM d, yyyy h:mm a")}</p>
                            <p className="text-xs font-medium mt-1">Total: NPR {order.total.toFixed(2)}</p>
                        </div>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  {orders.length === 0 ? (
                    <>
                      <ListOrdered className="mx-auto h-10 w-10 mb-2" />
                      <p className="text-sm">No orders found.</p>
                      <p className="text-xs">Place some orders on the 'Order' page to see them here.</p>
                    </>
                  ) : (
                    <>
                      <Search className="mx-auto h-10 w-10 mb-2" />
                      <p className="text-sm">No orders match your search.</p>
                    </>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        {selectedBill ? (
          <BillDisplay bill={selectedBill} />
        ) : (
          <Card className="flex flex-col items-center justify-center min-h-[400px] text-center shadow-lg h-full">
            <CardHeader>
                <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4"/>
              <CardTitle className="font-headline text-2xl">View Bill Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select an order from the list to display the bill.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
