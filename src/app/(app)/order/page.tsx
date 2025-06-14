
// src/app/(app)/order/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { categories, menuItems as defaultMenuItems } from "@/lib/data"
import type { MenuItem as MenuItemType, OrderItem, MenuCategory, Order, OrderType } from "@/lib/types"
import { MenuItemCard } from "@/components/order/MenuItemCard"
import { CurrentOrderPanel } from "@/components/order/CurrentOrderPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, PackageOpen, Info } from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext" 
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

const MENU_ITEMS_STORAGE_KEY = "annapurnaMenuItems";
const ORDERS_STORAGE_KEY = "annapurnaPosOrders";

export default function OrderPage() {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [allMenuItems, setAllMenuItems] = useState<MenuItemType[]>([]);
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || "all")
  
  const [orderType, setOrderType] = useState<OrderType | ''>(''); // Can be empty initially
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(''); // String for input flexibility

  const [isOrderInfoPanelOpen, setIsOrderInfoPanelOpen] = useState(true); // Control visibility of info panel section

  const { toast } = useToast()
  const { settings, isLoading: settingsLoading } = useSettings(); 

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

  const isOrderInfoComplete = useMemo(() => {
    if (!orderType) return false;
    if (!customerName.trim()) return false;
    if (orderType === 'delivery' && !deliveryAddress.trim()) return false;
    return true;
  }, [orderType, customerName, deliveryAddress]);

  const handleAddItem = (item: MenuItemType) => {
    if (!isOrderInfoComplete) {
      toast({
        title: "Order Details Incomplete",
        description: "Please select an order type and fill in customer details before adding items.",
        variant: "destructive"
      });
      setIsOrderInfoPanelOpen(true); // Ensure panel is open
      return;
    }
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
    if (settingsLoading || currentOrder.length === 0 || !isOrderInfoComplete) {
      let description = "Your order is empty or order details are incomplete.";
      if (settingsLoading) description = "Settings are still loading.";
      else if (!isOrderInfoComplete) description = "Please complete order type and customer details.";
      else if (currentOrder.length === 0) description = "Your order is empty.";
      
      toast({ title: "Cannot Place Order", description, variant: "destructive" });
      if (!isOrderInfoComplete) setIsOrderInfoPanelOpen(true);
      return;
    }
    
    const subtotal = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vatAmount = subtotal * settings.vatRate;
    const serviceChargeAmount = subtotal * settings.serviceChargeRate;
    const deliveryChargeAmount = parseFloat(deliveryCharge) || 0;
    const total = subtotal + vatAmount + serviceChargeAmount + deliveryChargeAmount;

    const newOrder: Order = {
      id: `order${Date.now()}`,
      orderNumber: `ORD${Date.now().toString().slice(-6)}`,
      items: currentOrder,
      subtotal,
      vat: vatAmount,
      vatRate: settings.vatRate,
      serviceCharge: serviceChargeAmount,
      serviceChargeRate: settings.serviceChargeRate,
      deliveryCharge: deliveryChargeAmount > 0 ? deliveryChargeAmount : undefined,
      total,
      status: 'paid', 
      createdAt: new Date().toISOString(),
      orderType: orderType as OrderType, // orderType is validated by isOrderInfoComplete
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
    };

    try {
      const existingOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
      const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
      const updatedOrders = [newOrder, ...existingOrders]; 
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
      
      toast({
        title: "Order Placed!",
        description: `Total: NPR ${total.toFixed(2)}. Order #${newOrder.orderNumber}`,
        variant: "default",
      })
      setCurrentOrder([]) 
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
      setDeliveryCharge('');
      setOrderType(''); 
      setIsOrderInfoPanelOpen(true); // Reopen for next order
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
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setDeliveryCharge('');
    setOrderType('');
    setIsOrderInfoPanelOpen(true);
    toast({
      title: "Order Cleared",
      description: "All items and customer details removed from the current order.",
      variant: "default",
    })
  }

  const handleEditOrderDetails = () => {
    setIsOrderInfoPanelOpen(true); 
  }

  useEffect(() => {
    // If order info becomes complete, and panel was open for input, close it
    if (isOrderInfoComplete && isOrderInfoPanelOpen) {
      setIsOrderInfoPanelOpen(false);
    }
  }, [isOrderInfoComplete, isOrderInfoPanelOpen]);


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
                        </Card>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-1">
                <Card className="sticky top-16 h-[calc(100vh-8rem)] flex flex-col">
                </Card>
            </div>
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 h-full">
      <div className="lg:col-span-2 flex flex-col">
        <div className="mb-4">
            <h1 className="text-2xl font-headline font-bold text-primary mb-1">Take-Out & Delivery Orders</h1>
            <p className="text-muted-foreground text-sm">
              {isOrderInfoComplete ? "Add items to the order." : "Select order type and fill customer details below to begin."}
            </p>
        </div>

        {(!isOrderInfoComplete || isOrderInfoPanelOpen) && (
            <div className="lg:hidden mb-4">
                {/* This section will be effectively handled by the CurrentOrderPanel on mobile */}
                {/* A placeholder or a prompt might be useful here if CurrentOrderPanel wasn't sticky */}
            </div>
        )}

        <div className={`mb-4 sticky top-0 bg-background/80 backdrop-blur-sm py-3 z-10 ${!isOrderInfoComplete && 'opacity-50 pointer-events-none'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full text-base"
              disabled={!isOrderInfoComplete}
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
            <ScrollArea orientation="horizontal" className="pb-2">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md" disabled={!isOrderInfoComplete}>All Items</TabsTrigger>
              {categories.map((category: MenuCategory) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md" disabled={!isOrderInfoComplete}>
                  {category.icon && <category.icon className="mr-2 h-4 w-4" />}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            </ScrollArea>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-grow pr-2 -mr-2"> 
          {!isOrderInfoComplete ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
              <Info className="h-16 w-16 mb-4 text-primary" />
              <p className="text-xl font-semibold">Order Details Required</p>
              <p>Please complete the order type and customer information in the right panel to activate the menu.</p>
            </div>
          ) : filteredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onAddItem={handleAddItem} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
              <PackageOpen className="h-16 w-16 mb-4" />
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
          orderType={orderType}
          setOrderType={setOrderType}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          deliveryAddress={deliveryAddress}
          setDeliveryAddress={setDeliveryAddress}
          deliveryCharge={deliveryCharge}
          setDeliveryCharge={setDeliveryCharge}
          isOrderInfoComplete={isOrderInfoComplete}
          onEditOrderDetails={handleEditOrderDetails}
        />
      </div>
    </div>
  )
}

