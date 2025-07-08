
// src/app/(app)/order/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import type { MenuItem as MenuItemType, OrderItem, MenuCategory, Order, OrderType, TableDefinition } from "@/lib/types"
import { MenuItemCard } from "@/components/order/MenuItemCard"
import { CurrentOrderPanel } from "@/components/order/CurrentOrderPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, PackageOpen, Info, PlusCircle } from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext" 
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DynamicIcon } from "@/components/DynamicIcon"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TableForm } from "@/components/floor-plan/TableForm"
import { cn } from "@/lib/utils"
import { ChefHat, ShoppingBag, Truck } from "lucide-react"

const MENU_ITEMS_STORAGE_KEY = "annapurnaMenuItems";
const ORDERS_STORAGE_KEY = "annapurnaPosOrders";

export default function OrderPage() {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [allMenuItems, setAllMenuItems] = useState<MenuItemType[]>([]);
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<string>("all")
  
  const [orderType, setOrderType] = useState<OrderType | ''>(''); 
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isCreateTableDialogOpen, setIsCreateTableDialogOpen] = useState(false);


  const { toast } = useToast()
  const { settings, addTable, updateTable, isLoading: settingsLoading, currentUser } = useSettings(); 

  const selectedTable = useMemo(() => {
    if (!selectedTableId) return null;
    return settings.tables.find(t => t.id === selectedTableId);
  }, [selectedTableId, settings.tables]);

  // When a table is selected, load its existing order into the panel
  useEffect(() => {
    if (selectedTable && (selectedTable.status === 'occupied' || selectedTable.status === 'needs_bill')) {
        setCurrentOrder(selectedTable.currentOrderItems || []);
    } else {
        setCurrentOrder([]);
    }
  }, [selectedTable]);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(MENU_ITEMS_STORAGE_KEY);
      if (storedItems) {
        setAllMenuItems(JSON.parse(storedItems));
      } else {
        const defaultItems = [
            { id: 'item1', name: 'Espresso', price: 150, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'coffee cup', description: 'Strong black coffee.', recipe: '1. Grind coffee beans. 2. Tamp grounds. 3. Brew with espresso machine for 25-30 seconds. 4. Serve immediately.' },
        ];
        setAllMenuItems(defaultItems);
        localStorage.setItem(MENU_ITEMS_STORAGE_KEY, JSON.stringify(defaultItems));
      }
    } catch (error)
 {
      console.error("Failed to load menu items from localStorage", error);
      setAllMenuItems([]);
    }
    setIsLoadingMenuItems(false);
  }, []);

  const isOrderInfoComplete = useMemo(() => {
    if (!orderType) return false;
    if (orderType === 'delivery') return !!customerName.trim() && !!deliveryAddress.trim();
    if (orderType === 'takeout') return !!customerName.trim();
    if (orderType === 'dine-in') return !!selectedTableId;
    return false;
  }, [orderType, customerName, deliveryAddress, selectedTableId]);
  
  const canEditOrder = useMemo(() => {
    if (!currentUser) return false;
    // For non-dine-in, it's always editable before order placement
    if (orderType !== 'dine-in') return true;
    
    if (selectedTable) {
        // Can always start an order on a vacant table
        if (selectedTable.status === 'vacant') return true;

        // Admins and Managers can edit occupied or needs_bill tables.
        if (currentUser.role === 'Admin' || currentUser.role === 'Manager') {
          return selectedTable.status === 'occupied' || selectedTable.status === 'needs_bill';
        }

        // Waiters can ONLY edit tables that are 'occupied' and assigned to them.
        if (currentUser.role === 'Waiter') {
            return selectedTable.status === 'occupied' && selectedTable.waiterId === currentUser.id;
        }
    }
    
    return false;
  }, [currentUser, orderType, selectedTable]);

  const isUserAllowedToSelect = (table: TableDefinition): boolean => {
    if (!currentUser) return false;
    if (table.status === 'vacant') return true;

    // Allow selecting occupied/needs_bill tables to view/edit order based on permissions
    if (table.status === 'occupied' || table.status === 'needs_bill') {
        if (currentUser.role === 'Admin' || currentUser.role === 'Manager') return true;
        if (currentUser.role === 'Waiter' && table.waiterId === currentUser.id) return true;
    }
    return false;
  };

  const handleSelectTable = (table: TableDefinition) => {
    if (isUserAllowedToSelect(table)) {
        if (selectedTableId === table.id) {
            setSelectedTableId(null); // Deselect if clicking the same table again
        } else {
            setSelectedTableId(table.id);
        }
    } else {
        let description = `Table ${table.name} is currently ${table.status}.`;
        if (table.status === 'occupied' || table.status === 'needs_bill') {
            const assignedWaiter = settings.users.find(u => u.id === table.waiterId);
            description = `You do not have permission. Table is assigned to ${assignedWaiter?.username || 'another waiter'}.`
        }
        toast({ title: "Access Denied", description, variant: "destructive" });
    }
  };

  const handleAddItem = (item: MenuItemType) => {
    if (!isOrderInfoComplete) {
      toast({
        title: "Order Details Incomplete",
        description: "Please select an order type and fill in the required details before adding items.",
        variant: "destructive"
      });
      return;
    }
    if (!canEditOrder) {
      toast({ title: "Order Locked", description: "This order cannot be edited.", variant: "destructive" });
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
  
  const handleTableCreate = (data: Omit<TableDefinition, 'id' | 'status' | 'waiterId' | 'notes' | 'currentOrderItems'>) => {
    const newTable = addTable(data);
    toast({ title: "Table Added", description: `${newTable.name} has been added to the floor plan.` });
    setIsCreateTableDialogOpen(false);
    if (newTable.status === 'vacant') {
      setSelectedTableId(newTable.id);
    } else {
        toast({ title: "Table is Occupied", description: "The new table was automatically occupied and assigned. View it in the Waiter View.", variant: "default" })
    }
  };


  const handlePlaceOrder = () => {
    if (currentOrder.length === 0 || !isOrderInfoComplete || settingsLoading) {
      toast({ title: "Cannot Place Order", description: "Check that order details are complete and items have been added.", variant: "destructive" });
      return;
    }
     if (!canEditOrder) {
      toast({ title: "Order Locked", description: "This order cannot be edited.", variant: "destructive" });
      return;
    }

    if (orderType === 'dine-in') {
        if (!selectedTableId || !currentUser || !selectedTable) {
            toast({ title: "Error", description: "No table selected or user not found.", variant: "destructive" });
            return;
        }
        
        const isNewOccupation = selectedTable.status === 'vacant';
        const isEdit = selectedTable.status === 'occupied';

        updateTable(selectedTableId, {
            status: 'occupied',
            waiterId: isNewOccupation ? currentUser.id : selectedTable.waiterId,
            currentOrderItems: currentOrder, // Replace with the current order state
            isModified: isEdit,
        });

        toast({ title: "Order Sent!", description: `Order for table ${selectedTable.name} sent to the kitchen.` });

    } else { // Takeout / Delivery
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
          orderStatus: 'confirmed', 
          paymentStatus: 'paid',
          createdAt: new Date().toISOString(),
          orderType: orderType as OrderType, 
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
        } catch (error) {
          console.error("Failed to save order to localStorage", error);
          toast({ title: "Error Placing Order", variant: "destructive", description: "Could not save your order." })
        }
    }
    handleClearOrder();
  }

  const handleClearOrder = () => {
    setCurrentOrder([]);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setDeliveryCharge('');
    setOrderType('');
    setSelectedTableId(null);
    toast({
      title: "Order Cleared",
      description: "All items and customer details removed from the current order.",
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
            <h1 className="text-2xl font-headline font-bold text-primary mb-1">Point of Sale</h1>
            <div className="space-y-3">
                <Label className="text-base font-medium mb-1.5 block">Select Order Type</Label>
                <RadioGroup value={orderType} onValueChange={(value) => { setOrderType(value as OrderType); setSelectedTableId(null); }} className="flex space-x-4">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="dine-in" id="dine-in" /><Label htmlFor="dine-in" className="flex items-center text-base"><ChefHat className="mr-1.5 h-5 w-5"/>Dine-In</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="takeout" id="takeout" /><Label htmlFor="takeout" className="flex items-center text-base"><ShoppingBag className="mr-1.5 h-5 w-5"/>Take-Out</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="delivery" id="delivery" /><Label htmlFor="delivery" className="flex items-center text-base"><Truck className="mr-1.5 h-5 w-5"/>Delivery</Label></div>
                </RadioGroup>
            </div>
        </div>

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
              {settings.categories.map((category: MenuCategory) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md" disabled={!isOrderInfoComplete}>
                  {category.iconName && <DynamicIcon name={category.iconName} className="mr-2 h-4 w-4" />}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            </ScrollArea>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-grow pr-2 -mr-2">
          {orderType === 'dine-in' && !selectedTableId && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-headline text-primary">Select a Table</h2>
                <Button onClick={() => setIsCreateTableDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Table
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {settings.tables.map(table => {
                  const canSelect = isUserAllowedToSelect(table);
                  return (
                    <Card
                      key={table.id}
                      className={cn(
                          "text-center cursor-pointer hover:shadow-lg transition-shadow",
                          !canSelect && "bg-muted/60 text-muted-foreground cursor-not-allowed",
                          canSelect && "hover:border-primary",
                          selectedTableId === table.id && "ring-2 ring-primary border-primary"
                      )}
                      onClick={() => handleSelectTable(table)}
                    >
                      <CardHeader className="p-3">
                          <CardTitle className="text-base">{table.name}</CardTitle>
                          <CardDescription className="text-xs capitalize">{table.status.replace("_", " ")}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
                {settings.tables.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-8">No tables found. Create one to get started.</p>
                )}
              </div>
            </div>
          )}
          
          {!isOrderInfoComplete && orderType !== '' && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
              <Info className="h-16 w-16 mb-4 text-primary" />
              <p className="text-xl font-semibold">Details Required</p>
              <p>Please complete the required information in the right panel to proceed.</p>
            </div>
          )}
          
          {isOrderInfoComplete && filteredMenuItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onAddItem={handleAddItem} />
              ))}
            </div>
          )}

          {isOrderInfoComplete && filteredMenuItems.length === 0 && (
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
          tables={settings.tables}
          selectedTableId={selectedTableId}
          isEditable={canEditOrder}
        />
      </div>

      <Dialog open={isCreateTableDialogOpen} onOpenChange={setIsCreateTableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">Create New Table</DialogTitle>
          </DialogHeader>
          <TableForm
            onCancel={() => setIsCreateTableDialogOpen(false)}
            onSubmit={handleTableCreate}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
