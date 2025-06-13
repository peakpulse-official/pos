// src/app/(app)/menu/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { menuItems as defaultMenuItems, categories } from "@/lib/data"
import type { MenuItem as MenuItemType, MenuCategory } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MenuItemForm } from "@/components/menu/MenuItemForm"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash2, Search, PackageOpen } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const MENU_ITEMS_STORAGE_KEY = "annapurnaMenuItems";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItemType | undefined>(undefined)
  const [itemToDelete, setItemToDelete] = useState<MenuItemType | null>(null);

  const { toast } = useToast()

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(MENU_ITEMS_STORAGE_KEY);
      if (storedItems) {
        setMenuItems(JSON.parse(storedItems));
      } else {
        setMenuItems(defaultMenuItems); // Seed with default data if nothing in localStorage
        localStorage.setItem(MENU_ITEMS_STORAGE_KEY, JSON.stringify(defaultMenuItems));
      }
    } catch (error) {
      console.error("Failed to load menu items from localStorage", error);
      setMenuItems(defaultMenuItems); // Fallback to default
    }
    setIsLoading(false);
  }, []);

  const saveMenuItemsToLocalStorage = (items: MenuItemType[]) => {
    try {
      localStorage.setItem(MENU_ITEMS_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save menu items to localStorage", error);
      toast({ title: "Error Saving Menu", description: "Could not save menu changes to local storage.", variant: "destructive"})
    }
  };


  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || "Unknown"
  }

  const handleFormSubmit = (data: Omit<MenuItemType, "id"> & { id?: string }) => {
    let updatedItems;
    if (editingItem && editingItem.id) {
      updatedItems = menuItems.map(item => (item.id === editingItem.id ? { ...item, ...data, id: editingItem.id } : item));
      setMenuItems(updatedItems);
      toast({ title: "Menu Item Updated", description: `${data.name} has been updated.` })
    } else {
      const newItemId = `item${Date.now()}` 
      updatedItems = [...menuItems, { ...data, id: newItemId }];
      setMenuItems(updatedItems);
      toast({ title: "Menu Item Added", description: `${data.name} has been added to the menu.` })
    }
    saveMenuItemsToLocalStorage(updatedItems);
    setIsFormOpen(false)
    setEditingItem(undefined)
  }

  const handleEditItem = (item: MenuItemType) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }
  
  const openDeleteItemDialog = (item: MenuItemType) => {
    setItemToDelete(item);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    const updatedItems = menuItems.filter(item => item.id !== itemToDelete.id);
    setMenuItems(updatedItems);
    saveMenuItemsToLocalStorage(updatedItems);
    toast({ title: "Menu Item Deleted", description: `${itemToDelete.name} has been removed from the menu.`, variant: "destructive" })
    setItemToDelete(null); 
  }

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(item.category).toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [menuItems, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">Menu Management</h1>
        <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingItem(undefined); }}>
          <Button variant="default" onClick={() => { setEditingItem(undefined); setIsFormOpen(true); }}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Item
          </Button>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-headline text-xl">{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
            </DialogHeader>
            <MenuItemForm
              initialData={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => { setIsFormOpen(false); setEditingItem(undefined); }}
              isEditing={!!editingItem}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full sm:w-1/2 lg:w-1/3 text-base"
        />
      </div>

      {filteredMenuItems.length > 0 ? (
        <div className="rounded-lg border overflow-hidden shadow-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price (NPR)</TableHead>
                <TableHead className="text-center w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMenuItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="hidden sm:table-cell">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                        data-ai-hint={item.dataAiHint}
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] bg-muted rounded-md flex items-center justify-center">
                        <PackageOpen className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getCategoryName(item.category)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)} className="text-blue-600 hover:text-blue-700">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteItemDialog(item)} className="text-destructive hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground bg-card rounded-lg shadow-md">
          <Search className="mx-auto h-12 w-12 mb-4" />
          <p className="text-xl font-semibold">No menu items found.</p>
          <p>Try a different search or add new items to the menu.</p>
        </div>
      )}

      {itemToDelete && (
        <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the menu item "{itemToDelete.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
