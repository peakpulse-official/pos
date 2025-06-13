// src/components/floor-plan/TableCard.tsx
"use client";

import type { TableDefinition, Waiter, TableStatus } from "@/lib/types";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Clock, CheckCircle, Utensils, Edit3, MessageSquare, Ban } from "lucide-react";
import type { LucideIcon } from "lucide-react"; 
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { cn } from "@/lib/utils";


export const statusConfig: Record<TableStatus, { icon: LucideIcon, label: string, colorClass: string, badgeVariant: "default" | "secondary" | "destructive" | "outline", borderClass: string }> = {
  vacant: { icon: CheckCircle, label: "Vacant", colorClass: "text-green-600 dark:text-green-500", badgeVariant: "secondary", borderClass: "border-green-500" },
  occupied: { icon: Users, label: "Occupied", colorClass: "text-blue-600 dark:text-blue-500", badgeVariant: "default", borderClass: "border-blue-500" },
  needs_bill: { icon: Clock, label: "Needs Bill", colorClass: "text-orange-600 dark:text-orange-500", badgeVariant: "destructive", borderClass: "border-orange-500" },
  needs_cleaning: { icon: Utensils, label: "Needs Cleaning", colorClass: "text-purple-600 dark:text-purple-500", badgeVariant: "outline", borderClass: "border-purple-500" },
};

interface TableCardProps {
  table: TableDefinition;
  waiters: Waiter[];
}

export function TableCard({ table, waiters }: TableCardProps) {
  const { updateTable } = useSettings();
  const { toast } = useToast();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [currentNotes, setCurrentNotes] = useState(table.notes || "");

  const assignedWaiter = waiters.find(w => w.id === table.waiterId);
  const currentStatusDetails = statusConfig[table.status];

  const handleStatusChange = (newStatus: TableStatus) => {
    updateTable(table.id, { status: newStatus });
    toast({ title: `Table ${table.name} status updated to ${statusConfig[newStatus].label}` });
  };

  const handleWaiterAssign = (waiterId: string | null) => {
    updateTable(table.id, { waiterId: waiterId });
    const waiterName = waiterId ? waiters.find(w=>w.id === waiterId)?.name : "unassigned";
    toast({ title: `Table ${table.name} ${waiterId ? 'assigned to' : ''} ${waiterName}` });
  };

  const handleNotesSave = () => {
    updateTable(table.id, { notes: currentNotes });
    toast({ title: `Notes for table ${table.name} updated.` });
    setIsEditingNotes(false);
  };

  return (
    <Card className={cn(
        "shadow-md hover:shadow-lg transition-shadow border-l-4",
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
      <CardContent className="py-2 px-3 space-y-2">
         <div className="flex items-center text-xs text-muted-foreground">
            <User className="mr-2 h-3.5 w-3.5" />
            <span>Waiter: {assignedWaiter ? assignedWaiter.name : <span className="italic">Unassigned</span>}</span>
        </div>
        
        {isEditingNotes ? (
          <div className="space-y-1">
            <Textarea 
              value={currentNotes} 
              onChange={(e) => setCurrentNotes(e.target.value)} 
              placeholder="Add notes..."
              className="text-xs h-16" 
            />
            <div className="flex justify-end space-x-1">
              <Button size="sm" variant="ghost" onClick={() => setIsEditingNotes(false)} className="text-xs px-2 h-7">Cancel</Button>
              <Button size="sm" onClick={handleNotesSave} className="text-xs px-2 h-7">Save</Button>
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
      <CardFooter className="py-2 px-3 flex justify-end space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs px-2 h-8">
              <Edit3 className="mr-1 h-3 w-3" /> Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Table Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <currentStatusDetails.icon className="mr-2 h-4 w-4" />
                    <span>Change Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={table.status} onValueChange={(value) => handleStatusChange(value as TableStatus)}>
                            {Object.entries(statusConfig).map(([statusKey, config]) => (
                                <DropdownMenuRadioItem key={statusKey} value={statusKey}>
                                    <config.icon className={cn("mr-2 h-4 w-4", config.colorClass)} /> {config.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <User className="mr-2 h-4 w-4" />
                    <span>Assign Waiter</span>
                </DropdownMenuSubTrigger>
                 <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                         <DropdownMenuRadioGroup value={table.waiterId || ""} onValueChange={(value) => handleWaiterAssign(value === "" ? null : value)}>
                            <DropdownMenuRadioItem value="">
                                <Ban className="mr-2 h-4 w-4 text-muted-foreground" /> Unassign
                            </DropdownMenuRadioItem>
                            {waiters.map(waiter => (
                                <DropdownMenuRadioItem key={waiter.id} value={waiter.id}>
                                    {waiter.name}
                                </DropdownMenuRadioItem>
                            ))}
                            {waiters.length === 0 && <DropdownMenuItem disabled>No waiters available</DropdownMenuItem>}
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
  );
}
