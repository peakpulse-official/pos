
// src/components/waiter-view/WaiterTableCard.tsx
"use client";

import type { TableDefinition, UserAccount, TableStatus, Bill, OrderItem, Order } from "@/lib/types";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { statusConfig } from "@/components/floor-plan/TableCard"; // Reuse statusConfig
import { User, MessageSquare, Edit3, Send, Receipt, Handshake } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { BillDisplay, generateAdHocBillStructure } from "@/components/billing/BillDisplay";
import { MOCK_WAITER_ORDER_ITEMS } from "@/lib/types"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const ORDERS_STORAGE_KEY = "annapurnaPosOrders";

interface WaiterTableCardProps {
  table: TableDefinition;
  allStaff: UserAccount[];
  selectedUserId: string | null;
}

export function WaiterTableCard({ table, allStaff, selectedUserId }: WaiterTableCardProps) {
  const { settings, updateTable, assignMockOrderToTable, clearMockOrderFromTable } = useSettings();
  const { toast } = useToast();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [currentNotes, setCurrentNotes] = useState(table.notes || "");
  const [showBillDialog, setShowBillDialog] = useState(false);
  const [billDialogContent, setBillDialogContent] = useState<{billData: Omit<Bill, 'id' | 'createdAt' | 'orderStatus' | 'paymentStatus'>, isKitchen: boolean} | null>(null);

  const assignedWaiter = allStaff.find(w => w.id === table.waiterId);
  const selectedUser = allStaff.find(u => u.id === selectedUserId);
  const currentStatusDetails = statusConfig[table.status];
  
  const isUserAllowedToManage = selectedUser?.role === 'Admin' || selectedUser?.role === 'Manager' || selectedUserId === table.waiterId;
  const isTableOccupiedBySelectedUser = isUserAllowedToManage && (table.status === 'occupied' || table.status === 'needs_bill');

  const handleNotesSave = () => {
    updateTable(table.id, { notes: currentNotes });
    toast({ title: `Notes for table ${table.name} updated.` });
    setIsEditingNotes(false);
  };

  const handleAssignTable = () => {
    if (selectedUserId) {
      updateTable(table.id, { waiterId: selectedUserId, status: 'occupied' });
      assignMockOrderToTable(table.id); 
      const selectedUserName = allStaff.find(s => s.id === selectedUserId)?.username || 'the selected staff';
      toast({ title: `Table ${table.name} assigned to ${selectedUserName} and marked as occupied.` });
    } else {
      toast({ title: "Error", description: "No staff profile selected.", variant: "destructive" });
    }
  };
  
  const handleStatusChange = (newStatus: TableStatus) => {
    if (newStatus === 'vacant') {
      clearMockOrderFromTable(table.id); 
      updateTable(table.id, { waiterId: null, status: 'vacant' });
    } else if (newStatus === 'needs_cleaning') {
       clearMockOrderFromTable(table.id);
       updateTable(table.id, { status: 'needs_cleaning' });
    } else if (newStatus === 'occupied' && !table.currentOrderItems) {
      assignMockOrderToTable(table.id);
      updateTable(table.id, { status: 'occupied' });
    } else {
      updateTable(table.id, { status: newStatus });
    }

    toast({ title: `Table ${table.name} status updated to ${statusConfig[newStatus].label}.` });
  };
  
  const prepareAndShowBill = (isKitchen: boolean) => {
    const itemsToDisplay = table.currentOrderItems || MOCK_WAITER_ORDER_ITEMS; 
    const adHocBill = generateAdHocBillStructure(
        itemsToDisplay, 
        settings, 
        table.name, // orderNumber (table name for KOT)
        `Table ${table.name}`, // customerName
        'dine-in', // orderType
        undefined, undefined, undefined,
        table.isModified
    );

    if (!isKitchen) {
      const { subtotal, vat, serviceCharge, total } = adHocBill;
      const newOrder: Order = {
        id: `order${Date.now()}`,
        tableId: table.id,
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        items: itemsToDisplay,
        subtotal,
        vat,
        serviceCharge,
        total,
        vatRate: settings.vatRate,
        serviceChargeRate: settings.serviceChargeRate,
        orderStatus: 'completed',
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString(),
        orderType: 'dine-in',
        customerName: `Table ${table.name}`,
      };

      try {
        const existingOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
        const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
        
        updateTable(table.id, { status: 'needs_bill', orderId: newOrder.id });
        toast({ title: "Bill Finalized", description: "Table awaiting payment. View in Billing page." });

        const finalBillData = { ...adHocBill, billNumber: `BILL-${newOrder.orderNumber}` };
        setBillDialogContent({ billData: finalBillData, isKitchen: false });
        setShowBillDialog(true);
      } catch (error) {
        console.error("Failed to save order:", error);
        toast({ title: "Error", description: "Could not save order to local storage.", variant: "destructive"});
      }

    } else {
      setBillDialogContent({ billData: adHocBill, isKitchen: true });
      setShowBillDialog(true);
      toast({ title: `Kitchen Order sent for table ${table.name}` });
      if (table.isModified) {
          updateTable(table.id, { isModified: false });
      }
    }
  };


  return (
    <>
      <Card className={cn(
        "shadow-md hover:shadow-lg transition-shadow border-l-4 flex flex-col",
        currentStatusDetails.borderClass,
        {
          'rounded-lg': table.shape === 'rectangle',
          'rounded-md': table.shape === 'square',
          'rounded-3xl': table.shape === 'circle',
        }
      )}>
        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-headline">{table.name}</CardTitle>
            <Badge variant={currentStatusDetails.badgeVariant} className="text-xs">
              <currentStatusDetails.icon className={cn("mr-1 h-3 w-3", currentStatusDetails.colorClass)} />
              {currentStatusDetails.label}
            </Badge>
          </div>
          <CardDescription className="text-xs">Capacity: {table.capacity} | Shape: <span className="capitalize">{table.shape}</span></CardDescription>
        </CardHeader>
        <CardContent className="py-2 px-3 space-y-2 flex-grow">
          <div className="flex items-center text-xs text-muted-foreground">
              <User className="mr-2 h-3.5 w-3.5" />
              <span>Staff: {assignedWaiter ? assignedWaiter.username : <span className="italic">Unassigned</span>}</span>
          </div>
          
          {isEditingNotes ? (
            <div className="space-y-1">
              <Textarea 
                value={currentNotes} 
                onChange={(e) => setCurrentNotes(e.target.value)} 
                placeholder="Add notes for this table..."
                className="text-xs h-16" 
              />
              <div className="flex justify-end space-x-1">
                <Button size="sm" variant="ghost" onClick={() => setIsEditingNotes(false)} className="text-xs px-2 h-7">Cancel</Button>
                <Button size="sm" onClick={handleNotesSave} className="text-xs px-2 h-7">Save Note</Button>
              </div>
            </div>
          ) : (
            <div 
              className={cn(
                "text-xs text-muted-foreground min-h-[2.5rem] p-1.5 rounded-sm flex items-start space-x-1.5",
                isUserAllowedToManage && "hover:bg-muted/50 cursor-pointer"
              )}
              onClick={() => isUserAllowedToManage && setIsEditingNotes(true)}
              title={isUserAllowedToManage ? "Click to edit notes" : "Notes"}
            >
              <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              {table.notes ? (
                  <p className="whitespace-pre-wrap line-clamp-2 flex-grow">{table.notes}</p>
              ) : (
                  <p className="italic flex-grow">No notes.</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="py-2 px-3 flex flex-col items-stretch space-y-1.5">
          {table.status === 'vacant' && selectedUserId && (
            <Button onClick={handleAssignTable} size="sm" className="w-full">
              <Handshake className="mr-2 h-4 w-4" /> Assign & Occupy
            </Button>
          )}

          {isTableOccupiedBySelectedUser && (
            <>
              <Button onClick={() => prepareAndShowBill(true)} variant="outline" size="sm" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send Order to Kitchen
              </Button>
              <Button onClick={() => prepareAndShowBill(false)} variant="default" size="sm" className="w-full" disabled={table.status === 'needs_bill'}>
                <Receipt className="mr-2 h-4 w-4" /> Finalize & Print Bill
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full text-xs" disabled={!isUserAllowedToManage}>
                <Edit3 className="mr-1 h-3 w-3" /> More Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Table Actions for {table.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                      <currentStatusDetails.icon className="mr-2 h-4 w-4" />
                      <span>Change Status</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup 
                              value={table.status} 
                              onValueChange={(value) => handleStatusChange(value as TableStatus)}
                          >
                              {Object.entries(statusConfig).map(([statusKey, config]) => (
                                  <DropdownMenuRadioItem key={statusKey} value={statusKey}>
                                      <config.icon className={cn("mr-2 h-4 w-4", config.colorClass)} /> {config.label}
                                  </DropdownMenuRadioItem>
                              ))}
                          </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                  </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={() => setIsEditingNotes(true)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>{table.notes ? "Edit Note" : "Add Note"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </CardFooter>
      </Card>

      {showBillDialog && billDialogContent && (
        <Dialog open={showBillDialog} onOpenChange={setShowBillDialog}>
          <DialogContent className="max-w-xs p-0 border-0">
            <BillDisplay 
                bill={billDialogContent.billData as Bill} 
                isKitchenCopy={billDialogContent.isKitchen} 
                title={billDialogContent.isKitchen ? `KOT - ${table.name}` : `Bill - ${table.name}`}
            />
             <DialogClose asChild>
                <Button type="button" variant="outline" className="m-2 print:hidden">Close</Button>
             </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
