// src/components/order/CurrentOrderPanel.tsx
"use client"

import type { OrderItem } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MinusCircle, PlusCircle, Trash2, ShoppingCart, CheckCircle } from "lucide-react"
import Image from "next/image"

interface CurrentOrderPanelProps {
  orderItems: OrderItem[]
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onRemoveItem: (itemId: string) => void
  onPlaceOrder: () => void
  onClearOrder: () => void
}

export function CurrentOrderPanel({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onClearOrder,
}: CurrentOrderPanelProps) {
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vatRate = 0.13 // 13% VAT
  const serviceChargeRate = 0.10 // 10% Service Charge

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
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-4">
          {orderItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">Your order is empty. Add items from the menu.</p>
          ) : (
            <ul className="space-y-3">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="text-sm w-5 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onRemoveItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
      {orderItems.length > 0 && (
        <CardFooter className="flex flex-col p-4 border-t">
          <div className="w-full space-y-1 text-sm mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>NPR {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (13%):</span>
              <span>NPR {vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charge (10%):</span>
              <span>NPR {serviceChargeAmount.toFixed(2)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-bold text-base text-primary">
              <span>Total:</span>
              <span>NPR {total.toFixed(2)}</span>
            </div>
          </div>
          <div className="w-full space-y-2">
            <Button onClick={onPlaceOrder} className="w-full text-base py-3" size="lg">
              <CheckCircle className="mr-2 h-5 w-5" /> Place Order
            </Button>
            <Button onClick={onClearOrder} variant="outline" className="w-full">
              Clear Order
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
