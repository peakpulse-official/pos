// src/app/(app)/order/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { categories, menuItems as defaultMenuItems } from "@/lib/data"
import type { MenuItem as MenuItemType, OrderItem, MenuCategory, Order } from "@/lib/types"
import { MenuItemCard } from "@/components/order/MenuItemCard"
import { CurrentOrderPanel } from "@/components/order/CurrentOrderPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext" // Import useSettings
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const MENU_ITEMS_STORAGE_KEY = "annapurnaMenuItems";
const ORDERS_STORAGE_KEY = "annapurnaPosOrders";

export default function OrderPage() {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [allMenuItems, setAllMenuItems] = useState<MenuItemType[]>([]);
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || "all")
  const { toast } = useToast()
  const { settings, isLoading: settingsLoading } = useSettings(); // Get settings

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(MENU_ITEMS_STORAGE_KEY);
      if (storedItems) {
        setAllMenuItems(JSON.parse(storedItems));
      } else {
        setAllMenuItems(defaultMenuItems);
        localStorage.setItem(MENU_ITEMS_STORAGE_KEY, JSON.stringify(defaultMenuItems));
      }
    } catch (error) {
      console.error("Failed to load menu items from localStorage", error);
      setAllMenuItems(defaultMenuItems);
    }
    setIsLoadingMenuItems(false);
  }, []);

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
    const itemToRemove = allMenuItems.find(item => item.id === itemId);
    setCurrentOrder((prevOrder) => prevOrder.filter((item) => item.id !== itemId))
    if (itemToRemove) {
      toast({
        title: `${itemToRemove.name} removed`,
        description: "Item removed from your order.",
        variant: "destructive",
      })
    }
  }

  const handlePlaceOrder = () => {
    if (settingsLoading || currentOrder.length === 0) {
      toast({
        title: "Cannot Place Order",
        description: settingsLoading ? "Settings are still loading." : "Your order is empty.",
        variant: "destructive"
      });
      return;
    }

    const subtotal = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vatAmount = subtotal * settings.vatRate;
    const serviceChargeAmount = subtotal * settings.serviceChargeRate;
    const total = subtotal + vatAmount + serviceChargeAmount;

    const newOrder: Order = {
      id: `order${Date.now()}`,
      orderNumber: `ORD${Date.now().toString().slice(-6)}`,
      items: currentOrder,
      subtotal,
      vat: vatAmount,
      vatRate: settings.vatRate,
      serviceCharge: serviceChargeAmount,
      serviceChargeRate: settings.serviceChargeRate,
      total,
      status: 'paid', // Default to paid for simplicity in this flow
      createdAt: new Date().toISOString(),
      // customerName and paymentMethod can be added via a modal or further UI enhancements
    };

    try {
      const existingOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
      const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
      const updatedOrders = [newOrder, ...existingOrders]; // Add new order to the beginning
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
      
      toast({
        title: "Order Placed!",
        description: `Total: NPR ${total.toFixed(2)}. Order #${newOrder.orderNumber}`,
        variant: "default",
      })
      setCurrentOrder([]) // Clear order after placing
    } catch (error) {
      console.error("Failed to save order to localStorage", error);
      toast({
        title: "Error Placing Order",
        description: "Could not save your order. Please try again.",
        variant: "destructive",
      })
    }
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
    if (isLoadingMenuItems) return [];
    return allMenuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === "all" || item.category === activeTab)
    )
  }, [allMenuItems, searchTerm, activeTab, isLoadingMenuItems])

  if (isLoadingMenuItems || settingsLoading) {
     return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 h-full">
            <div className="lg:col-span-2 flex flex-col">
                <div className="mb-4 sticky top-0 bg-background/80 backdrop-blur-sm py-3 z-10">
                    <Skeleton className="h-10 w-full mb-3" />
                    <div className="flex space-x-2 pb-2">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-9 w-24" />)}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="flex flex-col overflow-hidden">
                            <Skeleton className="h-40 w-full" />
                            <CardContent className="p-4 flex-grow space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                            <CardFooter className="p-4 border-t">
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-1">
                <Card className="sticky top-16 h-[calc(100vh-8rem)] flex flex-col">
                    <CardHeader className="border-b"><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent className="p-4 flex-grow"><Skeleton className="h-20 w-full" /></CardContent>
                    <CardFooter className="flex flex-col p-4 border-t space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            </div>
        </div>
     );
  }

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
        
        <ScrollArea className="flex-grow pr-2 -mr-2"> 
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
