
// src/components/waiter-view/WaiterTableCard.tsx
"use client";

import type { TableDefinition, Waiter, TableStatus, OrderItem, Bill } from "@/lib/types";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useState }
from "react";
import { cn } from "@/lib/utils";
import { statusConfig } from "@/components/floor-plan/TableCard"; // Reuse statusConfig
import { Users, User, Clock, CheckCircle, Utensils, MessageSquare, Edit3, Send, Receipt, Handshake } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
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


interface WaiterTableCardProps {
  table: TableDefinition;
  allWaiters: Waiter[];
  currentWaiterId: string | null;
}

export function WaiterTableCard({ table, allWaiters, currentWaiterId }: WaiterTableCardProps) {
  const { settings, updateTable, assignMockOrderToTable, clearMockOrderFromTable } = useSettings();
  const { toast } = useToast();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [currentNotes, setCurrentNotes] = useState(table.notes || "");
  const [showBillDialog, setShowBillDialog] = useState(false);
  const [billDialogContent, setBillDialogContent] = useState<{billData: Omit<Bill, 'id' | 'createdAt' | 'status'>, isKitchen: boolean} | null>(null);


  const assignedWaiter = allWaiters.find(w => w.id === table.waiterId);
  const currentStatusDetails = statusConfig[table.status];
  const isAssignedToCurrentUser = table.waiterId === currentWaiterId;

  const handleNotesSave = () => {
    updateTable(table.id, { notes: currentNotes });
    toast({ title: `Notes for table ${table.name} updated.` });
    setIsEditingNotes(false);
  };

  const handleAssignToSelf = () => {
    if (currentWaiterId) {
      updateTable(table.id, { waiterId: currentWaiterId, status: 'occupied' });
      assignMockOrderToTable(table.id); 
      toast({ title: `Table ${table.name} assigned to you and marked as occupied.` });
    } else {
      toast({ title: "Error", description: "No waiter selected.", variant: "destructive" });
    }
  };
  
  const handleStatusChange = (newStatus: TableStatus) => {
    updateTable(table.id, { status: newStatus });
    if (newStatus === 'vacant' || newStatus === 'needs_cleaning') {
      clearMockOrderFromTable(table.id); 
      if (newStatus === 'vacant' && table.waiterId === currentWaiterId) {
         updateTable(table.id, { waiterId: null }); 
      }
    } else if (newStatus === 'occupied' && !table.currentOrderItems) {
      // If table becomes occupied and has no items (e.g. from admin panel), assign mock items
      assignMockOrderToTable(table.id);
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
        'dine-in' // orderType
    );
    setBillDialogContent({ billData: adHocBill, isKitchen });
    setShowBillDialog(true);
    toast({ title: `${isKitchen ? "Kitchen Order" : "Bill"} ready for table ${table.name}` });
  };


  return (
    <>
      <Card className={cn(
        "shadow-md hover:shadow-lg transition-shadow border-l-4 flex flex-col",
        currentStatusDetails.borderClass
      )}>
        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-headline">{table.name}</CardTitle>
            <Badge variant={currentStatusDetails.badgeVariant} className="text-xs">
              <currentStatusDetails.icon className={cn("mr-1 h-3 w-3", currentStatusDetails.colorClass)} />
              {currentStatusDetails.label}
            </Badge>
          </div>
          <CardDescription className="text-xs">Capacity: {table.capacity}</CardDescription>
        </CardHeader>
        <CardContent className="py-2 px-3 space-y-2 flex-grow">
          <div className="flex items-center text-xs text-muted-foreground">
              <User className="mr-2 h-3.5 w-3.5" />
              <span>Waiter: {assignedWaiter ? assignedWaiter.name : <span className="italic">Unassigned</span>}</span>
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
              className="text-xs text-muted-foreground min-h-[2.5rem] p-1.5 rounded-sm hover:bg-muted/50 cursor-pointer flex items-start space-x-1.5"
              onClick={() => setIsEditingNotes(true)}
              title="Click to edit notes"
            >
              <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              {table.notes ? (
                  <p className="whitespace-pre-wrap line-clamp-2 flex-grow">{table.notes}</p>
              ) : (
                  <p className="italic flex-grow">No notes. Click to add.</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="py-2 px-3 flex flex-col items-stretch space-y-1.5">
          {table.status === 'vacant' && currentWaiterId && (
            <Button onClick={handleAssignToSelf} size="sm" className="w-full">
              <Handshake className="mr-2 h-4 w-4" /> Assign to Me & Occupy
            </Button>
          )}

          {(table.status === 'occupied' || table.status === 'needs_bill') && isAssignedToCurrentUser && (
            <>
              <Button onClick={() => prepareAndShowBill(true)} variant="outline" size="sm" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send Order to Kitchen
              </Button>
              <Button onClick={() => prepareAndShowBill(false)} variant="default" size="sm" className="w-full">
                <Receipt className="mr-2 h-4 w-4" /> Finalize & Print Bill
              </Button>
            </>
          )}

          {currentWaiterId && (isAssignedToCurrentUser || table.status === 'vacant') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  <Edit3 className="mr-1 h-3 w-3" /> More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Table Actions for {table.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled={!isAssignedToCurrentUser && table.status !== 'vacant'}>
                        <currentStatusDetails.icon className="mr-2 h-4 w-4" />
                        <span>Change Status</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup 
                                value={table.status} 
                                onValueChange={(value) => handleStatusChange(value as TableStatus)}
                            >
                                {Object.entries(statusConfig).map(([statusKey, config]) => {
                                    if (statusKey === 'occupied' && !isAssignedToCurrentUser && table.status !== 'vacant') return null; 
                                    return (
                                        <DropdownMenuRadioItem key={statusKey} value={statusKey}>
                                            <config.icon className={cn("mr-2 h-4 w-4", config.colorClass)} /> {config.label}
                                        </DropdownMenuRadioItem>
                                    );
                                })}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => setIsEditingNotes(true)} disabled={!isAssignedToCurrentUser && table.status !== 'vacant'}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>{table.notes ? "Edit Note" : "Add Note"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
