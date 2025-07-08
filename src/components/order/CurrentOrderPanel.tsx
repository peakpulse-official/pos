// src/components/order/CurrentOrderPanel.tsx
"use client"

import type { OrderItem, OrderType, TableDefinition } from "@/lib/types"
import { useSettings } from "@/contexts/SettingsContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MinusCircle, PlusCircle, Trash2, ShoppingCart, CheckCircle, User, Phone, Home, DollarSign, Send, ChefHat } from "lucide-react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react";

interface CurrentOrderPanelProps {
  orderItems: OrderItem[]
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onRemoveItem: (itemId: string) => void
  onPlaceOrder: () => void
  onClearOrder: () => void
  orderType: OrderType | ''
  setOrderType: (type: OrderType) => void
  customerName: string
  setCustomerName: (name: string) => void
  customerPhone: string
  setCustomerPhone: (phone: string) => void
  deliveryAddress: string
  setDeliveryAddress: (address: string) => void
  deliveryCharge: string 
  setDeliveryCharge: (charge: string) => void
  isOrderInfoComplete: boolean
  tables: TableDefinition[]
  selectedTableId: string | null
}

export function CurrentOrderPanel({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onClearOrder,
  orderType,
  setOrderType,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  deliveryAddress,
  setDeliveryAddress,
  deliveryCharge,
  setDeliveryCharge,
  isOrderInfoComplete,
  tables,
  selectedTableId,
}: CurrentOrderPanelProps) {
  const { settings, isLoading: settingsLoading } = useSettings();

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  const vatRate = settingsLoading ? 0.13 : settings.vatRate;
  const serviceChargeRate = settingsLoading ? 0.10 : settings.serviceChargeRate;
  const deliveryChargeAmount = (orderType === 'delivery' && parseFloat(deliveryCharge)) || 0;

  const vatAmount = subtotal * vatRate
  const serviceChargeAmount = subtotal * serviceChargeRate
  const total = subtotal + vatAmount + serviceChargeAmount + deliveryChargeAmount;
  
  const selectedTableName = useMemo(() => {
    if (!selectedTableId) return null;
    return tables.find(t => t.id === selectedTableId)?.name;
  }, [selectedTableId, tables]);

  return (
    <Card className="sticky top-16 h-[calc(100vh-8rem)] flex flex-col shadow-xl">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-xl flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6 text-primary" /> Current Order
          </CardTitle>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-grow">
        <CardContent className="p-4">
            <div className="space-y-3">
              {orderType === 'dine-in' ? (
                <div className="p-3 rounded-md border bg-muted/80">
                  <div className="flex items-center text-sm font-medium">
                    <ChefHat className="h-4 w-4 mr-2"/>
                    Dine-In Order
                  </div>
                  {selectedTableName ? (
                    <p className="text-xs text-muted-foreground">For Table: <span className="font-semibold text-primary">{selectedTableName}</span></p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Select a table to begin.</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="customerName" className="text-xs">Customer Name*</Label>
                    <div className="relative"> <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> <Input id="customerName" placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="pl-8 text-sm h-9" disabled={!orderType} /> </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="customerPhone" className="text-xs">Phone (Optional)</Label>
                    <div className="relative"> <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> <Input id="customerPhone" placeholder="Contact Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="pl-8 text-sm h-9" disabled={!orderType} /> </div>
                  </div>
                  {orderType === 'delivery' && (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="deliveryAddress" className="text-xs">Delivery Address*</Label>
                        <div className="relative"> <Home className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> <Input id="deliveryAddress" placeholder="Full Address for Delivery" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="pl-8 text-sm h-9" /> </div>
                      </div>
                       <div className="space-y-1">
                        <Label htmlFor="deliveryCharge" className="text-xs">Delivery Charge (NPR, Optional)</Label>
                        <div className="relative"> <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> <Input id="deliveryCharge" type="number" placeholder="e.g., 50" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} className="pl-8 text-sm h-9" /> </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

          {orderItems.length === 0 && isOrderInfoComplete && (
            <p className="text-muted-foreground text-center py-6 mt-4">Order is empty. Add items from the menu.</p>
          )}

          {orderItems.length > 0 && (
            <>
            <Separator className="my-4"/>
            <ul className="space-y-3 max-h-48 overflow-y-auto">
              {orderItems.map((item) => (
                <li key={item.id} className="flex items-center space-x-3 p-2 rounded-md bg-card hover:bg-muted/50 transition-colors">
                  {item.imageUrl && ( <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-sm object-cover" data-ai-hint={item.dataAiHint} /> )}
                  <div className="flex-grow"> <p className="font-medium text-sm">{item.name}</p> <p className="text-xs text-muted-foreground">NPR {item.price.toFixed(2)}</p> </div>
                  <div className="flex items-center space-x-1.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} > <MinusCircle className="h-4 w-4" /> </Button>
                    <span className="text-sm w-5 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} > <PlusCircle className="h-4 w-4" /> </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onRemoveItem(item.id)}> <Trash2 className="h-4 w-4" /> </Button>
                </li>
              ))}
            </ul>
            </>
          )}
        </CardContent>
      </ScrollArea>
      
      {orderItems.length > 0 && (
        <CardFooter className="flex flex-col p-4 border-t">
         {settingsLoading ? (
            <div className="w-full space-y-2 mb-3">
              <Skeleton className="h-4 w-3/4" /> <Skeleton className="h-4 w-1/2" /> <Skeleton className="h-4 w-2/3" /> <Skeleton className="h-4 w-1/3" />
              <Separator className="my-1" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <div className="w-full space-y-1 text-sm mb-3">
              <div className="flex justify-between"> <span>Subtotal:</span> <span>NPR {subtotal.toFixed(2)}</span> </div>
              <div className="flex justify-between"> <span>VAT ({ (vatRate * 100).toFixed(0) }%):</span> <span>NPR {vatAmount.toFixed(2)}</span> </div>
              <div className="flex justify-between"> <span>Service Charge ({ (serviceChargeRate * 100).toFixed(0) }%):</span> <span>NPR {serviceChargeAmount.toFixed(2)}</span> </div>
              {deliveryChargeAmount > 0 && ( <div className="flex justify-between"> <span>Delivery Charge:</span> <span>NPR {deliveryChargeAmount.toFixed(2)}</span> </div> )}
              <Separator className="my-1" />
              <div className="flex justify-between font-bold text-base text-primary"> <span>Total:</span> <span>NPR {total.toFixed(2)}</span> </div>
            </div>
          )}
          <div className="w-full space-y-2">
            <Button onClick={onPlaceOrder} className="w-full text-base py-3" size="lg" disabled={settingsLoading || orderItems.length === 0 || !isOrderInfoComplete}> 
                {orderType === 'dine-in' ? <Send className="mr-2 h-5 w-5" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                {orderType === 'dine-in' ? 'Send to Kitchen' : 'Place Order'}
            </Button>
            <Button onClick={onClearOrder} variant="outline" className="w-full" disabled={settingsLoading || (!isOrderInfoComplete && orderItems.length === 0)}> Clear Order </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
