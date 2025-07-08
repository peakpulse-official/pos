
// src/app/(app)/orders/page.tsx
"use client"

import { useState, useEffect, useMemo } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { useSettings } from "@/contexts/SettingsContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { Package, MoreHorizontal, ChefHat, CheckCircle, Truck, Info } from "lucide-react";

const ORDERS_STORAGE_KEY = "annapurnaPosOrders";

const statusFlow: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_kitchen', 'cancelled'],
  in_kitchen: ['ready'],
  ready: ['completed'],
  completed: [],
  cancelled: [],
};


export default function OrdersPage() {
  const { currentUser } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    setIsLoading(false);
  }, []);

  const sortedOrders = useMemo(() => {
    return orders.sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());
  }, [orders]);
  
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, orderStatus: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  };
  
  const getOrderStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch(status) {
      case 'completed': return 'default';
      case 'confirmed': return 'secondary';
      case 'in_kitchen': return 'secondary';
      case 'ready': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  }

  const getPaymentStatusBadgeVariant = (status: Order['paymentStatus']): "default" | "secondary" | "destructive" | "outline" => {
    switch(status) {
      case 'paid': return 'default';
      case 'unpaid': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'outline';
    }
  }

  const getOrderTypeIcon = (type: Order['orderType']) => {
    switch(type) {
        case 'dine-in': return <ChefHat className="h-4 w-4" />;
        case 'takeout': return <CheckCircle className="h-4 w-4" />;
        case 'delivery': return <Truck className="h-4 w-4" />;
        default: return null;
    }
  }
  
  if (isLoading) {
    return <Skeleton className="w-full h-96" />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Package className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">All Orders</h1>
          <p className="text-muted-foreground">
            View and manage the status of all takeout and delivery orders.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order Queue</CardTitle>
          <CardDescription>Most recent orders are shown first. Update status via the actions menu.</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedOrders.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
              <Info className="mx-auto h-12 w-12 mb-3" />
              <p className="text-lg font-medium">No orders have been placed yet.</p>
              <p>Go to the "Take Order" page to create one.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Total (NPR)</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.map((order) => {
                    const currentOrderStatus = order.orderStatus || 'pending';
                    const possibleNextStatuses = statusFlow[currentOrderStatus] || [];

                    return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.customerName || 'N/A'}</TableCell>
                       <TableCell>
                          <div className="flex items-center gap-2" title={order.orderType}>
                             {getOrderTypeIcon(order.orderType)}
                             <span className="capitalize hidden md:inline">{order.orderType}</span>
                          </div>
                       </TableCell>
                      <TableCell>{format(parseISO(order.createdAt), "MMM d, h:mm a")}</TableCell>
                      <TableCell>{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                          <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus || 'unpaid')}>
                              {(order.paymentStatus || 'unpaid').toUpperCase()}
                          </Badge>
                      </TableCell>
                      <TableCell>
                          <Badge variant={getOrderStatusBadgeVariant(currentOrderStatus)}>
                              {currentOrderStatus.replace("_", " ").toUpperCase()}
                          </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={possibleNextStatuses.length === 0}>
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {possibleNextStatuses.map(nextStatus => (
                              <DropdownMenuItem
                                key={nextStatus}
                                onClick={() => handleStatusUpdate(order.id, nextStatus)}
                              >
                                Mark as {nextStatus.replace("_", " ")}
                              </DropdownMenuItem>
                            ))}
                             {possibleNextStatuses.length === 0 && <DropdownMenuItem disabled>No further actions</DropdownMenuItem>}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
