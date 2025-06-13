
// src/components/billing/BillDisplay.tsx
"use client"

import type { Bill, OrderItem } from "@/lib/types"
import { useSettings } from "@/contexts/SettingsContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Printer, ChefHat } from "lucide-react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface BillDisplayProps {
  bill: Bill | null
  onPrint?: () => void
}

export function BillDisplay({ bill, onPrint }: BillDisplayProps) {
  const { settings, isLoading: settingsLoading } = useSettings();

  if (!bill) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[400px] text-center shadow-lg md:max-w-md mx-auto">
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
      window.print();
    }
  }

  const restaurantName = settingsLoading ? <Skeleton className="h-5 w-3/4 mb-1" /> : settings.restaurantName;
  const restaurantAddress = settingsLoading ? <Skeleton className="h-3 w-1/2" /> : settings.restaurantAddress;
  const restaurantContact = settingsLoading ? <Skeleton className="h-3 w-1/2" /> : settings.restaurantContact;

  return (
    <Card className="shadow-xl print-area max-w-xs mx-auto"> {/* max-w-xs for thermal receipt width */}
      <CardHeader className="border-b pb-3 p-4"> {/* Reduced padding */}
        <div className="flex justify-between items-start mb-1">
            <div className="flex items-center space-x-1.5"> {/* Reduced space */}
                <ChefHat className="h-8 w-8 text-primary" /> {/* Slightly smaller icon */}
                <div>
                    <CardTitle className="font-headline text-lg">{restaurantName}</CardTitle> {/* Smaller title */}
                    <p className="text-xs text-muted-foreground">{restaurantAddress}</p>
                    {!settingsLoading && settings.restaurantContact && <p className="text-xs text-muted-foreground">{restaurantContact}</p>}
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-sm">TAX INVOICE</p> {/* Smaller text */}
                <p className="text-xs text-muted-foreground">Bill: {bill.billNumber}</p>
            </div>
        </div>
        <div className="text-xs text-muted-foreground flex justify-between">
            <p>Order: {bill.orderNumber}</p>
            <p>Date: {format(new Date(bill.createdAt), "dd/MM/yy HH:mm")}</p> {/* Shorter date format */}
        </div>
        {bill.customerName && <p className="text-xs mt-1">Cust: {bill.customerName}</p>} {/* Smaller customer name */}
      </CardHeader>
      <CardContent className="p-3"> {/* Reduced padding */}
        <div className="flow-root">
          <ul role="list" className="-my-2 divide-y divide-border"> {/* Reduced item padding */}
            {bill.items.map((item: OrderItem) => (
              <li key={item.id} className="flex py-2">
                <div className="ml-0 flex-1 flex flex-col">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-foreground"> {/* Smaller item text */}
                      <h3>{item.name}</h3>
                      <p className="ml-2">{(item.price * item.quantity).toFixed(2)}</p> {/* Removed NPR for space */}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.quantity} x {item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Separator className="my-3" /> {/* Reduced margin */}
        <div className="space-y-1 text-xs"> {/* Smaller text for totals */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>{bill.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT ({(bill.vatRate * 100).toFixed(0)}%):</span>
            <span>{bill.vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Svc Chg ({(bill.serviceChargeRate * 100).toFixed(0)}%):</span>
            <span>{bill.serviceCharge.toFixed(2)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between text-sm font-bold text-primary"> {/* Total can be slightly larger */}
            <span>Total:</span>
            <span>NPR {bill.total.toFixed(2)}</span>
          </div>
        </div>
         {bill.paymentMethod && <p className="text-xs text-muted-foreground mt-2">Paid by: {bill.paymentMethod.toUpperCase()}</p>}
      </CardContent>
      <CardFooter className="border-t p-3 flex flex-col items-center space-y-2 print:hidden"> {/* Reduced padding */}
        <p className="text-xs text-muted-foreground text-center">Thank you! Visit again.</p>
        <Button onClick={handlePrint} className="w-full max-w-xs" variant="default" size="sm" disabled={settingsLoading}>
          <Printer className="mr-2 h-4 w-4" /> Print Bill
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-1">
          (Uses browser print. For POS thermal printing, see Setup Guide.)
        </p>
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
            width: auto; /* Allow content to define width, good for narrow receipts */
            margin: 0;
            padding: 0;
            font-size: 10pt; /* Example base font size for print */
          }
          .print-area .text-lg { font-size: 12pt; }
          .print-area .text-sm { font-size: 9pt; }
          .print-area .text-xs { font-size: 8pt; }
          .print-area .font-bold { font-weight: bold; }
          .print-area .font-headline { font-family: 'Arial', sans-serif; } /* Simpler font for print */
          .print-area .text-primary { color: black !important; } /* Print in black */
          .print-area .text-muted-foreground { color: #333 !important; }
          .print-area .bg-primary\\/10 { background-color: transparent !important; }
          .print-area .border-b, .print-area .border-t { border-color: #ccc !important; }
          .print-area .shadow-xl { box-shadow: none !important; }
          .print-area .p-3, .print-area .p-4, .print-area .pb-3 { padding: 0.25rem !important; } /* Adjust padding for print */
          .print-area .mb-1, .print-area .mb-2, .print-area .my-3, .print-area .mt-1, .print-area .mt-2 { margin: 0.125rem 0 !important; }
          .print-area .space-x-1_5 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.25rem !important; }
           .print-area hr, .print-area .separator { border-top: 1px dashed #666 !important; margin: 0.25rem 0 !important;}

          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </Card>
  )
}

