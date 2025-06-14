// src/components/order/CurrentOrderPanel.tsx
"use client"

import type { OrderItem, OrderType } from "@/lib/types"
import { useSettings } from "@/contexts/SettingsContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MinusCircle, PlusCircle, Trash2, ShoppingCart, CheckCircle, User, Phone, Home, ShoppingBag, Truck } from "lucide-react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CurrentOrderPanelProps {
  orderItems: OrderItem[]
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onRemoveItem: (itemId: string) => void
  onPlaceOrder: () => void
  onClearOrder: () => void
  // New props for customer details
  orderType: OrderType
  setOrderType: (type: OrderType) => void
  customerName: string
  setCustomerName: (name: string) => void
  customerPhone: string
  setCustomerPhone: (phone: string) => void
  deliveryAddress: string
  setDeliveryAddress: (address: string) => void
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
}: CurrentOrderPanelProps) {
  const { settings, isLoading: settingsLoading } = useSettings();

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  const vatRate = settingsLoading ? 0.13 : settings.vatRate;
  const serviceChargeRate = settingsLoading ? 0.10 : settings.serviceChargeRate;

  const vatAmount = subtotal * vatRate
  const serviceChargeAmount = subtotal * serviceChargeRate
  const total = subtotal + vatAmount + serviceChargeAmount

  return (
    <Card className="sticky top-16 h-[calc(100vh-8rem)] flex flex-col shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="font-headline text-xl flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6 text-primary" /> Current Order
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-grow">
        <CardContent className="p-4 space-y-3">
          {orderItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">Order is empty.</p>
          ) : (
            <ul className="space-y-3 max-h-48 overflow-y-auto"> {/* Limit height for item list */}
              {orderItems.map((item) => (
                <li key={item.id} className="flex items-center space-x-3 p-2 rounded-md bg-card hover:bg-muted/50 transition-colors">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-sm object-cover" data-ai-hint={item.dataAiHint} />
                  )}
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">NPR {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} > <MinusCircle className="h-4 w-4" /> </Button>
                    <span className="text-sm w-5 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} > <PlusCircle className="h-4 w-4" /> </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onRemoveItem(item.id)}> <Trash2 className="h-4 w-4" /> </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>

        {orderItems.length > 0 && (
          <div className="px-4 py-3 border-t space-y-3">
             <div>
                <Label className="text-sm font-medium mb-2 block">Order Type</Label>
                <RadioGroup defaultValue="takeout" value={orderType} onValueChange={(value) => setOrderType(value as OrderType)} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="takeout" id="takeout" />
                        <Label htmlFor="takeout" className="flex items-center"><ShoppingBag className="mr-1.5 h-4 w-4"/>Take-Out</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="flex items-center"><Truck className="mr-1.5 h-4 w-4"/>Delivery</Label>
                    </div>
                </RadioGroup>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="customerName" className="text-xs">Customer Name*</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="customerName" placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="pl-8 text-sm h-9" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="customerPhone" className="text-xs">Phone (Optional)</Label>
               <div className="relative">
                <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="customerPhone" placeholder="Contact Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="pl-8 text-sm h-9" />
              </div>
            </div>
            {orderType === 'delivery' && (
              <div className="space-y-1">
                <Label htmlFor="deliveryAddress" className="text-xs">Delivery Address*</Label>
                <div className="relative">
                    <Home className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="deliveryAddress" placeholder="Full Address for Delivery" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="pl-8 text-sm h-9" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
      
      {orderItems.length > 0 && (
        <CardFooter className="flex flex-col p-4 border-t">
         {settingsLoading ? (
            <div className="w-full space-y-2 mb-3">
              <Skeleton className="h-4 w-3/4" /> <Skeleton className="h-4 w-1/2" /> <Skeleton className="h-4 w-2/3" />
              <Separator className="my-1" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <div className="w-full space-y-1 text-sm mb-3">
              <div className="flex justify-between"> <span>Subtotal:</span> <span>NPR {subtotal.toFixed(2)}</span> </div>
              <div className="flex justify-between"> <span>VAT ({ (vatRate * 100).toFixed(0) }%):</span> <span>NPR {vatAmount.toFixed(2)}</span> </div>
              <div className="flex justify-between"> <span>Service Charge ({ (serviceChargeRate * 100).toFixed(0) }%):</span> <span>NPR {serviceChargeAmount.toFixed(2)}</span> </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-bold text-base text-primary"> <span>Total:</span> <span>NPR {total.toFixed(2)}</span> </div>
            </div>
          )}
          <div className="w-full space-y-2">
            <Button onClick={onPlaceOrder} className="w-full text-base py-3" size="lg" disabled={settingsLoading || orderItems.length === 0}> <CheckCircle className="mr-2 h-5 w-5" /> Place Order </Button>
            <Button onClick={onClearOrder} variant="outline" className="w-full" disabled={settingsLoading || orderItems.length === 0}> Clear Order </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
