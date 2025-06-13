// src/components/floor-plan/ManageWaitersSection.tsx
"use client"

import { useState } from "react"
import { useSettings } from "@/contexts/SettingsContext"
import type { Waiter } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2, UserCog } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { WaiterForm } from "@/components/floor-plan/WaiterForm" // To be created
import { useToast } from "@/hooks/use-toast"

export function ManageWaitersSection() {
  const { settings, addWaiter, removeWaiter } = useSettings()
  const [isWaiterFormOpen, setIsWaiterFormOpen] = useState(false)
  // Editing waiter state can be added later if needed
  // const [editingWaiter, setEditingWaiter] = useState<Waiter | undefined>(undefined)
  const [waiterToDelete, setWaiterToDelete] = useState<Waiter | null>(null)
  const { toast } = useToast()

  const handleWaiterFormSubmit = (data: Omit<Waiter, 'id'>) => {
    // For now, only adding. Editing can be added.
    addWaiter(data)
    toast({ title: "Waiter Added", description: `${data.name} has been added.` })
    setIsWaiterFormOpen(false)
  }

  const handleDeleteWaiter = () => {
    if (waiterToDelete) {
      removeWaiter(waiterToDelete.id)
      toast({ title: "Waiter Deleted", description: `${waiterToDelete.name} has been removed.`, variant: "destructive" })
      setWaiterToDelete(null)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-xl flex items-center">
            <UserCog className="mr-2 h-6 w-6 text-primary" /> Manage Waiters
          </CardTitle>
          <CardDescription>Add or remove waiter staff.</CardDescription>
        </div>
        <Button onClick={() => setIsWaiterFormOpen(true)}>
          <PlusCircle className="mr-2 h-5 w-5" /> Add Waiter
        </Button>
      </CardHeader>
      <CardContent>
        {settings.waiters.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">No waiters configured yet. Click "Add Waiter" to get started.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waiter Name</TableHead>
                  <TableHead>Assigned Tables</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.waiters.map((waiter) => {
                  const assignedTablesCount = settings.tables.filter(t => t.waiterId === waiter.id).length;
                  return (
                    <TableRow key={waiter.id}>
                      <TableCell className="font-medium">{waiter.name}</TableCell>
                      <TableCell>{assignedTablesCount > 0 ? `${assignedTablesCount} table(s)` : <span className="text-muted-foreground italic">None</span>}</TableCell>
                      <TableCell className="text-right">
                        {/* Edit button can be added later */}
                        {/* <Button variant="ghost" size="icon" onClick={() => {}} className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button> */}
                        <Button variant="ghost" size="icon" onClick={() => setWaiterToDelete(waiter)} className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <WaiterForm
        isOpen={isWaiterFormOpen}
        onClose={() => setIsWaiterFormOpen(false)}
        onSubmit={handleWaiterFormSubmit}
      />

      {waiterToDelete && (
        <AlertDialog open={!!waiterToDelete} onOpenChange={() => setWaiterToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the waiter "{waiterToDelete.name}". They will also be unassigned from any tables.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setWaiterToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteWaiter} className="bg-destructive hover:bg-destructive/90">
                Delete Waiter
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  )
}
