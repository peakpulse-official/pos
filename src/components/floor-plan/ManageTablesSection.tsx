// src/components/floor-plan/ManageTablesSection.tsx
"use client"

import { useState } from "react"
import { useSettings } from "@/contexts/SettingsContext"
import type { TableDefinition } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit, Trash2, ListChecks } from "lucide-react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TableForm } from "@/components/floor-plan/TableForm"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function ManageTablesSection() {
  const { settings, addTable, updateTable, removeTable, currentUser } = useSettings()
  const [isTableFormOpen, setIsTableFormOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<TableDefinition | undefined>(undefined)
  const [tableToDelete, setTableToDelete] = useState<TableDefinition | null>(null)
  const { toast } = useToast()

  const handleTableFormSubmit = (data: Omit<TableDefinition, 'id' | 'status' | 'waiterId' | 'notes' | 'currentOrderItems'>) => {
    if (editingTable) {
      updateTable(editingTable.id, data)
      toast({ title: "Table Updated", description: `${data.name} has been updated.` })
    } else {
      addTable(data)
      const toastMessage = currentUser?.role === 'Waiter'
        ? `${data.name} created and assigned to you.`
        : `${data.name} has been added.`
      toast({ title: "Table Added", description: toastMessage })
    }
    setIsTableFormOpen(false)
    setEditingTable(undefined)
  }

  const handleEditTable = (table: TableDefinition) => {
    setEditingTable(table)
    setIsTableFormOpen(true)
  }

  const handleDeleteTable = () => {
    if (tableToDelete) {
      removeTable(tableToDelete.id)
      toast({ title: "Table Deleted", description: `${tableToDelete.name} has been removed.`, variant: "destructive" })
      setTableToDelete(null)
    }
  }
  
  const getStatusBadgeVariant = (status: TableDefinition['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch(status) {
      case 'occupied': return 'default'; // Or a more vibrant color
      case 'vacant': return 'secondary';
      case 'needs_bill': return 'destructive'; // Or 'warning' if available
      case 'needs_cleaning': return 'outline';
      default: return 'outline';
    }
  }


  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-xl flex items-center">
            <ListChecks className="mr-2 h-6 w-6 text-primary" /> Manage Tables
          </CardTitle>
          <CardDescription>Add, edit, or remove tables for your restaurant floor plan.</CardDescription>
        </div>
        <Button onClick={() => { setEditingTable(undefined); setIsTableFormOpen(true) }}>
          <PlusCircle className="mr-2 h-5 w-5" /> Add Table
        </Button>
      </CardHeader>
      <CardContent>
        {settings.tables.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">No tables configured yet. Click "Add Table" to get started.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name/Number</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Shape</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Waiter</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.tables.map((table) => {
                  const assignedWaiter = settings.users.find(w => w.id === table.waiterId);
                  return (
                    <TableRow key={table.id}>
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>{table.capacity}</TableCell>
                      <TableCell className="capitalize">{table.shape}</TableCell>
                      <TableCell><Badge variant={getStatusBadgeVariant(table.status)}>{table.status.replace("_", " ").toUpperCase()}</Badge></TableCell>
                      <TableCell>{assignedWaiter ? assignedWaiter.username : <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTable(table)} className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setTableToDelete(table)} className="text-destructive">
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

      <Dialog open={isTableFormOpen} onOpenChange={(open) => { setIsTableFormOpen(open); if (!open) { setEditingTable(undefined); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">
              {editingTable ? "Edit Table" : "Add New Table"}
            </DialogTitle>
          </DialogHeader>
          <TableForm
            onCancel={() => { setIsTableFormOpen(false); setEditingTable(undefined); }}
            onSubmit={handleTableFormSubmit}
            initialData={editingTable}
          />
        </DialogContent>
      </Dialog>

      {tableToDelete && (
        <AlertDialog open={!!tableToDelete} onOpenChange={() => setTableToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the table "{tableToDelete.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setTableToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTable} className="bg-destructive hover:bg-destructive/90">
                Delete Table
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  )
}
