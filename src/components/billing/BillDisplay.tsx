// src/components/billing/BillDisplay.tsx
"use client"

import type { Bill, OrderItem } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Printer, ChefHat } from "lucide-react"
import { format } from "date-fns"

interface BillDisplayProps {
  bill: Bill | null
  onPrint?: () => void // Actual printing logic is complex and out of scope for pure web
}

export function BillDisplay({ bill, onPrint }: BillDisplayProps) {
  if (!bill) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[400px] text-center shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">No Bill Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select an order to view the bill.</p>
        </CardContent>
      </Card>
    )
  }

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Basic browser print
      window.print();
    }
  }

  return (
    <Card className="shadow-xl print-area">
      <CardHeader className="border-b pb-4">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
                <ChefHat className="h-10 w-10 text-primary" />
                <div>
                    <CardTitle className="font-headline text-2xl">Annapurna POS</CardTitle>
                    <p className="text-xs text-muted-foreground">Kathmandu, Nepal</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-lg">TAX INVOICE</p>
                <p className="text-xs text-muted-foreground">Bill No: {bill.billNumber}</p>
            </div>
        </div>
        <div className="text-xs text-muted-foreground flex justify-between">
            <p>Order No: {bill.orderNumber}</p>
            <p>Date: {format(new Date(bill.createdAt), "PPpp")}</p>
        </div>
        {bill.customerName && <p className="text-sm">Customer: {bill.customerName}</p>}
      </CardHeader>
      <CardContent className="p-6">
        <div className="flow-root">
          <ul role="list" className="-my-4 divide-y divide-border">
            {bill.items.map((item: OrderItem) => (
              <li key={item.id} className="flex py-4">
                <div className="flex-shrink-0">
                  {/* Placeholder for image if needed, or remove */}
                </div>
                <div className="ml-0 flex-1 flex flex-col">
                  <div>
                    <div className="flex justify-between text-sm font-medium text-foreground">
                      <h3>{item.name}</h3>
                      <p className="ml-4">NPR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.quantity} x NPR {item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Separator className="my-6" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>NPR {bill.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT (13%):</span>
            <span>NPR {bill.vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service Charge (10%):</span>
            <span>NPR {bill.serviceCharge.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-base font-bold text-primary">
            <span>Total Amount:</span>
            <span>NPR {bill.total.toFixed(2)}</span>
          </div>
        </div>
         {bill.paymentMethod && <p className="text-xs text-muted-foreground mt-4">Payment Method: {bill.paymentMethod.toUpperCase()}</p>}
      </CardContent>
      <CardFooter className="border-t p-6 flex flex-col items-center space-y-3 print:hidden">
        <p className="text-sm text-muted-foreground text-center">Thank you for your visit! Hope to see you again.</p>
        <Button onClick={handlePrint} className="w-full max-w-xs" variant="default">
          <Printer className="mr-2 h-5 w-5" /> Print Bill
        </Button>
      </CardFooter>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </Card>
  )
}
