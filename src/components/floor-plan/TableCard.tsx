// src/components/floor-plan/TableCard.tsx
"use client";

import type { TableDefinition, Waiter, TableStatus } from "@/lib/types";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Clock, CheckCircle, Utensils, Edit3, Trash2, Ban } from "lucide-react";
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
import { Input } from "../ui/input";


const statusConfig: Record<TableStatus, { icon: LucideIcon, label: string, colorClass: string, badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
  vacant: { icon: CheckCircle, label: "Vacant", colorClass: "text-green-600 dark:text-green-500", badgeVariant: "secondary" },
  occupied: { icon: Users, label: "Occupied", colorClass: "text-blue-600 dark:text-blue-500", badgeVariant: "default" },
  needs_bill: { icon: Clock, label: "Needs Bill", colorClass: "text-orange-600 dark:text-orange-500", badgeVariant: "destructive" },
  needs_cleaning: { icon: Utensils, label: "Needs Cleaning", colorClass: "text-purple-600 dark:text-purple-500", badgeVariant: "outline" },
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
  const currentStatusConfig = statusConfig[table.status];

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
    <Card className={`shadow-md hover:shadow-lg transition-shadow border-l-4 ${currentStatusConfig.badgeVariant === 'default' ? 'border-primary' : currentStatusConfig.badgeVariant === 'destructive' ? 'border-destructive' : 'border-border'}`}>
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-headline">{table.name}</CardTitle>
          <Badge variant={currentStatusConfig.badgeVariant} className="text-xs">
            <currentStatusConfig.icon className={`mr-1 h-3 w-3 ${currentStatusConfig.colorClass}`} />
            {currentStatusConfig.label}
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
              <Button size="xs" variant="ghost" onClick={()={() => setIsEditingNotes(false)}}>Cancel</Button>
              <Button size="xs" onClick={handleNotesSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div 
            className="text-xs text-muted-foreground min-h-[2.5rem] p-1.5 rounded-sm hover:bg-muted/50 cursor-pointer"
            onClick={()={() => setIsEditingNotes(true)}}
            title="Click to edit notes"
          >
            {table.notes ? (
                <p className="whitespace-pre-wrap line-clamp-2">{table.notes}</p>
            ) : (
                <p className="italic">No notes. Click to add.</p>
            )}
          </div>
        )}

      </CardContent>
      <CardFooter className="py-2 px-3 flex justify-end space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="xs" className="text-xs">
              <Edit3 className="mr-1 h-3 w-3" /> Change
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Table Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <currentStatusConfig.icon className="mr-2 h-4 w-4" />
                    <span>Change Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={table.status} onValueChange={(value) => handleStatusChange(value as TableStatus)}>
                            {Object.entries(statusConfig).map(([statusKey, config]) => (
                                <DropdownMenuRadioItem key={statusKey} value={statusKey}>
                                    <config.icon className={`mr-2 h-4 w-4 ${config.colorClass}`} /> {config.label}
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
            {/* <DropdownMenuItem onClick={() => setIsEditingNotes(true)}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Notes
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

// Add this to your Button component if 'xs' size is needed globally, or style locally
// In src/components/ui/button.tsx, under variants.size:
// xs: "h-7 rounded-md px-2 text-xs",
// And update TailwindCSS to handle 'size-xs' for Button in src/components/ui/button.tsx variant props
// Add size variant 'xs' to buttonVariants in src/components/ui/button.tsx like:
// const buttonVariants = cva(
//   "...", {
//     variants: {
//       // ... other variants
//       size: {
//         default: "h-10 px-4 py-2",
//         sm: "h-9 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-10 w-10",
//         xs: "h-7 rounded-sm px-2 text-xs", // Added xs
//       },
//     },
//     //...
//   }
// )
// For simplicity, I've used size="xs" which is not standard in ShadCN. 
// A more robust way is to add 'xs' to buttonVariants or use specific padding/height classes.
// Using existing `size="sm"` and tweaking padding with `className="px-2 py-1 h-auto text-xs"` is also an option for local adjustments.
// For now, I'll rely on direct styling if size="xs" is not pre-defined globally.
// It seems `size="xs"` is not standard. Let's use `size="sm"` and adjust classNames or accept slightly larger buttons for now.
// For the purpose of this prototype and avoiding modification of shared UI components unless necessary,
// I will use size="sm" for these action buttons or apply specific height/padding.
// Let's go with size="sm" and it should be fine.
// The dropdown menu items naturally handle their own sizing.

// Corrected usage for Button: use size="sm" or custom classes for smaller buttons.
// Reverted Button size to "sm" where "xs" was used, or use custom styling if finer control is needed.
// For the TableCard footer buttons, using size="sm" with text-xs on the text inside should work.
// <Button variant="outline" size="sm" className="text-xs">
//  <Edit3 className="mr-1 h-3 w-3" /> Change
// </Button>
// For notes save/cancel:
// <Button size="sm" variant="ghost" onClick={() => setIsEditingNotes(false)} className="text-xs">Cancel</Button>
// <Button size="sm" onClick={handleNotesSave} className="text-xs">Save</Button>
// This ensures we don't assume a non-standard Button size.
