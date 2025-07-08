
// src/components/billing/BillDisplay.tsx
"use client"

import type { Bill, OrderItem, OrderType } from "@/lib/types"
import { useSettings } from "@/contexts/SettingsContext"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Printer, ChefHat, ShoppingBag, Truck, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface BillDisplayProps {
  bill: Bill | null 
  onPrint?: () => void
  isKitchenCopy?: boolean 
  title?: string 
}

export const generateAdHocBillStructure = (
  items: OrderItem[], 
  settings: ReturnType<typeof useSettings>['settings'],
  orderNumber?: string,
  customerName?: string,
  orderType?: OrderType,
  customerPhone?: string,
  deliveryAddress?: string,
  deliveryCharge?: number,
): Omit<Bill, 'id' | 'createdAt' | 'orderStatus' | 'paymentStatus'> => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatAmount = subtotal * settings.vatRate;
  const serviceChargeAmount = subtotal * settings.serviceChargeRate;
  const actualDeliveryCharge = deliveryCharge || 0;
  const total = subtotal + vatAmount + serviceChargeAmount + actualDeliveryCharge;

  return {
    orderNumber: orderNumber || `ORDER-${Date.now().toString().slice(-5)}`,
    billNumber: `BILL-${Date.now().toString().slice(-4)}`,
    items: items,
    subtotal,
    vat: vatAmount,
    vatRate: settings.vatRate,
    serviceCharge: serviceChargeAmount,
    serviceChargeRate: settings.serviceChargeRate,
    deliveryCharge: actualDeliveryCharge > 0 ? actualDeliveryCharge : undefined,
    total,
    printedAt: new Date().toISOString(),
    customerName: customerName,
    orderType: orderType || 'dine-in',
    customerPhone: customerPhone,
    deliveryAddress: deliveryAddress,
  };
};


export function BillDisplay({ bill, onPrint, isKitchenCopy = false, title }: BillDisplayProps) {
  const { settings, isLoading: settingsLoading } = useSettings();

  if (!bill && !isKitchenCopy) { 
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
  
  const displayData = bill; 

  if (!displayData) { 
     return <p>Error: Bill data is missing.</p>;
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

  const billTitle = title ? title : (isKitchenCopy ? "KITCHEN ORDER TICKET (KOT)" : "TAX INVOICE");
  const orderTypeDisplay = displayData.orderType === 'takeout' ? 'Take-Out' : displayData.orderType === 'delivery' ? 'Delivery' : 'Dine-In';

  return (
    <Card className="shadow-xl print-area max-w-xs mx-auto">
      <CardHeader className="border-b pb-3 p-4">
        <div className="flex justify-between items-start mb-1">
            <div className="flex items-center space-x-1.5">
                <ChefHat className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="font-headline text-lg">{restaurantName}</CardTitle>
                    {!isKitchenCopy && <p className="text-xs text-muted-foreground">{restaurantAddress}</p>}
                    {!isKitchenCopy && !settingsLoading && settings.restaurantContact && <p className="text-xs text-muted-foreground">{restaurantContact}</p>}
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-sm">{billTitle}</p>
                <p className="text-xs text-muted-foreground">Bill: {displayData.billNumber}</p>
            </div>
        </div>
        <div className="text-xs text-muted-foreground flex justify-between items-center">
            <p>Order: {displayData.orderNumber}</p>
            <div className="flex items-center">
                {displayData.orderType === 'takeout' && <ShoppingBag className="h-3 w-3 mr-1"/>}
                {displayData.orderType === 'delivery' && <Truck className="h-3 w-3 mr-1"/>}
                <span>{orderTypeDisplay}</span>
            </div>
        </div>
        <p className="text-xs text-muted-foreground">Date: {format(new Date(displayData.printedAt), "dd/MM/yy HH:mm")}</p>
        {displayData.customerName && <p className="text-xs mt-1">Cust: {displayData.customerName} {displayData.customerPhone && `(${displayData.customerPhone})`}</p>}
        {displayData.orderType === 'delivery' && displayData.deliveryAddress && <p className="text-xs mt-0.5">Addr: {displayData.deliveryAddress}</p>}
      </CardHeader>
      <CardContent className="p-3">
        <div className="flow-root">
          <ul role="list" className="-my-2 divide-y divide-border">
            {displayData.items.map((item: OrderItem) => (
              <li key={item.id} className="flex py-2">
                <div className="ml-0 flex-1 flex flex-col">
                  <div>
                    <div className={`flex justify-between text-xs font-medium ${isKitchenCopy ? 'text-lg' : ''} text-foreground`}>
                      <h3>{item.name} <span className="font-bold"> (x{item.quantity})</span></h3>
                      {!isKitchenCopy && <p className="ml-2">{(item.price * item.quantity).toFixed(2)}</p>}
                    </div>
                    {!isKitchenCopy && 
                        <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.quantity} x {item.price.toFixed(2)}
                        </p>
                    }
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {!isKitchenCopy && (
          <>
            <Separator className="my-3" />
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{displayData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT ({(displayData.vatRate * 100).toFixed(0)}%):</span>
                <span>{displayData.vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Svc Chg ({(displayData.serviceChargeRate * 100).toFixed(0)}%):</span>
                <span>{displayData.serviceCharge.toFixed(2)}</span>
              </div>
              {displayData.deliveryCharge && displayData.deliveryCharge > 0 && (
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charge:</span>
                    <span>{displayData.deliveryCharge.toFixed(2)}</span>
                </div>
              )}
              <Separator className="my-1" />
              <div className="flex justify-between text-sm font-bold text-primary">
                <span>Total:</span>
                <span>NPR {displayData.total.toFixed(2)}</span>
              </div>
            </div>
            {displayData.paymentMethod && <p className="text-xs text-muted-foreground mt-2">Paid by: {displayData.paymentMethod.toUpperCase()}</p>}
          </>
        )}
      </CardContent>
      <CardFooter className="border-t p-3 flex flex-col items-center space-y-2 print:hidden">
        {!isKitchenCopy && <p className="text-xs text-muted-foreground text-center">Thank you! Visit again.</p>}
        <Button onClick={handlePrint} className="w-full max-w-xs" variant="default" size="sm" disabled={settingsLoading}>
          <Printer className="mr-2 h-4 w-4" /> {isKitchenCopy ? "Print KOT" : "Print Bill"}
        </Button>
        {!isKitchenCopy && 
            <p className="text-xs text-muted-foreground text-center mt-1">
            (Uses browser print. For POS thermal printing, see Setup Guide.)
            </p>
        }
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
            width: auto; 
            margin: 0;
            padding: 0;
            font-size: 10pt; 
            font-family: 'Courier New', Courier, monospace; /* Monospace font for kitchen */
          }
          .print-area .text-lg { font-size: ${isKitchenCopy ? '14pt' : '12pt'}; font-weight: bold; }
          .print-area .text-sm { font-size: 9pt; }
          .print-area .text-xs { font-size: 8pt; }
          .print-area .font-bold { font-weight: bold; }
          .print-area .font-headline { font-family: 'Arial', sans-serif; } 
          .print-area .text-primary { color: black !important; } 
          .print-area .text-muted-foreground { color: #333 !important; }
          .print-area .bg-primary\\/10 { background-color: transparent !important; }
          .print-area .border-b, .print-area .border-t, .print-area .divide-y > :not([hidden]) ~ :not([hidden]) { border-color: #666 !important; border-style: dashed !important; }
          .print-area hr, .print-area .separator { border-top: 1px dashed #666 !important; margin: 0.25rem 0 !important;}
          .print-area .shadow-xl, .print-area .shadow-lg { box-shadow: none !important; }
          .print-area .p-3, .print-area .p-4, .print-area .pb-3 { padding: 0.2rem !important; } 
          .print-area .mb-1, .print-area .mb-2, .print-area .my-3, .print-area .mt-1, .print-area .mt-2 { margin: 0.1rem 0 !important; }
          .print-area .space-x-1_5 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.2rem !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </Card>
  )
}
