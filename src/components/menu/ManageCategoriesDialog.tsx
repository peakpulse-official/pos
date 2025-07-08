
// src/components/menu/ManageCategoriesDialog.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/SettingsContext"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Trash2 } from "lucide-react"
import { CategoryForm } from "./CategoryForm"
import type { MenuCategory } from "@/lib/types"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { DynamicIcon } from "../DynamicIcon"

interface ManageCategoriesDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ManageCategoriesDialog({ isOpen, onClose }: ManageCategoriesDialogProps) {
  const { settings, addCategory, updateCategory, removeCategory } = useSettings()
  const { toast } = useToast()
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<MenuCategory | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(false)

  const handleFormSubmit = (data: Omit<MenuCategory, "id">) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data)
      toast({ title: "Category Updated", description: `"${data.name}" has been updated.` })
    } else {
      addCategory(data)
      toast({ title: "Category Added", description: `"${data.name}" has been added.` })
    }
    setEditingCategory(null)
    setIsFormVisible(false)
  }

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category)
    setIsFormVisible(true)
  }
  
  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormVisible(true);
  }

  const handleCancelForm = () => {
    setEditingCategory(null);
    setIsFormVisible(false);
  }
  
  const handleDelete = () => {
    if (categoryToDelete) {
      const success = removeCategory(categoryToDelete.id);
      if (success) {
        toast({ title: "Category Deleted", description: `"${categoryToDelete.name}" has been removed.`, variant: "destructive" })
      } else {
        toast({ title: "Deletion Failed", description: `"${categoryToDelete.name}" cannot be deleted because it is still used by some menu items.`, variant: "destructive" })
      }
      setCategoryToDelete(null)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">Manage Categories</DialogTitle>
            <DialogDescription>Add, edit, or remove your menu categories.</DialogDescription>
          </DialogHeader>
          
          {isFormVisible ? (
            <CategoryForm 
              onSubmit={handleFormSubmit}
              initialData={editingCategory ?? undefined}
              onCancel={handleCancelForm}
            />
          ) : (
            <div className="space-y-4">
              <ScrollArea className="h-72">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Icon</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settings.categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          {category.iconName && <DynamicIcon name={category.iconName} className="h-5 w-5" />}
                        </TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setCategoryToDelete(category)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <div className="flex justify-end">
                <Button onClick={handleAddNew}>Add New Category</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {categoryToDelete && (
         <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete the category "{categoryToDelete.name}". This cannot be undone. You can only delete a category if no menu items are using it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
