// src/app/(app)/order/page.tsx
"use client"

import { useState, useMemo } from "react"
import { categories, menuItems as allMenuItems } from "@/lib/data"
import type { MenuItem as MenuItemType, OrderItem, MenuCategory } from "@/lib/types"
import { MenuItemCard } from "@/components/order/MenuItemCard"
import { CurrentOrderPanel } from "@/components/order/CurrentOrderPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"

export default function OrderPage() {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || "all")
  const { toast } = useToast()

  const handleAddItem = (item: MenuItemType) => {
    setCurrentOrder((prevOrder) => {
      const existingItem = prevOrder.find((orderItem) => orderItem.id === item.id)
      if (existingItem) {
        return prevOrder.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      }
      return [...prevOrder, { ...item, quantity: 1 }]
    })
    toast({
      title: `${item.name} added`,
      description: "Item successfully added to your order.",
      variant: "default",
    })
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
      return
    }
    setCurrentOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setCurrentOrder((prevOrder) => prevOrder.filter((item) => item.id !== itemId))
    const removedItem = allMenuItems.find(item => item.id === itemId);
    if (removedItem) {
      toast({
        title: `${removedItem.name} removed`,
        description: "Item removed from your order.",
        variant: "destructive",
      })
    }
  }

  const handlePlaceOrder = () => {
    // In a real app, this would send the order to a backend
    console.log("Placing order:", currentOrder)
    toast({
      title: "Order Placed!",
      description: `Total: NPR ${currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.23}`, // Assuming 13% VAT and 10% SC
      variant: "default",
    })
    setCurrentOrder([]) // Clear order after placing
  }

  const handleClearOrder = () => {
    setCurrentOrder([])
    toast({
      title: "Order Cleared",
      description: "All items removed from the current order.",
      variant: "default",
    })
  }

  const filteredMenuItems = useMemo(() => {
    return allMenuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === "all" || item.category === activeTab)
    )
  }, [searchTerm, activeTab])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 h-full">
      <div className="lg:col-span-2 flex flex-col">
        <div className="mb-4 sticky top-0 bg-background/80 backdrop-blur-sm py-3 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full text-base"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
            <ScrollArea orientation="horizontal" className="pb-2">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">All Items</TabsTrigger>
              {categories.map((category: MenuCategory) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
                  {category.icon && <category.icon className="mr-2 h-4 w-4" />}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            </ScrollArea>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-grow pr-2 -mr-2"> {/* pr and -mr for custom scrollbar spacing if needed */}
          {filteredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onAddItem={handleAddItem} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
              <Search className="h-16 w-16 mb-4" />
              <p className="text-xl font-semibold">No items match your search.</p>
              <p>Try a different search term or category.</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="lg:col-span-1">
        <CurrentOrderPanel
          orderItems={currentOrder}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onPlaceOrder={handlePlaceOrder}
          onClearOrder={handleClearOrder}
        />
      </div>
    </div>
  )
}
