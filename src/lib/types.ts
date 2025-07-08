
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  description?: string;
  recipe?: string; 
  dataAiHint?: string; 
}

export interface MenuCategory {
  id: string;
  name: string;
  iconName?: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export type OrderType = 'dine-in' | 'takeout' | 'delivery';
export type OrderStatus = 'pending' | 'confirmed' | 'in_kitchen' | 'ready' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';


export interface Order {
  id: string;
  tableId?: string; // Link back to the table
  items: OrderItem[];
  total: number;
  subtotal: number;
  vat: number; // VAT amount
  vatRate: number; // VAT rate at time of order
  serviceCharge: number; // Service charge amount
  serviceChargeRate: number; // Service charge rate at time of order
  deliveryCharge?: number; // Optional delivery charge
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO string for date
  orderNumber: string;
  customerName?: string;
  paymentMethod?: 'cash' | 'card' | 'online';
  orderType: OrderType;
  customerPhone?: string;
  deliveryAddress?: string;
}

export interface Bill extends Omit<Order, 'orderStatus'> {
  billNumber: string;
  printedAt: string; // ISO string for date
  isModified?: boolean; // For KOT to show if order was updated
}


export interface DailySales {
  date: string; // ISO string for date
  totalRevenue: number;
  totalOrders: number;
  popularItems: { itemId: string, name: string, quantitySold: number, revenue: number }[];
}

export type PrinterType = "Receipt" | "Kitchen" | "Label";
export interface PrinterDevice {
  id: string;
  name: string;
  type: PrinterType;
}

export type UserRole = "Admin" | "Manager" | "Waiter";
export interface UserAccount {
  id:string;
  username: string; 
  password?: string; 
  role: UserRole;
  hourlyRate?: number; 
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: UserRole;
  hourlyRate?: number; 
}

export interface TimeLog {
  id: string;
  userId: string;
  username: string;
  role: UserRole;
  checkInTime: string; // ISO string
  checkOutTime?: string; // ISO string
  date: string; // YYYY-MM-DD
  breakStartTime?: string; // ISO string
  breakEndTime?: string; // ISO string
  totalBreakDurationMinutes?: number; 
  hourlyRate?: number; 
}

export type TableStatus = 'vacant' | 'occupied' | 'needs_bill' | 'needs_cleaning';
export type TableShape = 'rectangle' | 'square' | 'circle';

export interface TableDefinition {
  id: string;
  name: string; 
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  waiterId?: string | null; 
  orderId?: string | null; // Link to the created order
  notes?: string;
  currentOrderItems?: OrderItem[]; 
  isModified?: boolean;
}

// This is now deprecated and will be removed in future steps.
// For now, it's removed from the AppSettings type.
export interface Waiter {
  id: string;
  name: string;
}

export interface AppSettings {
  restaurantName: string;
  restaurantAddress: string;
  restaurantContact: string;
  logoUrl?: string; 
  vatRate: number; 
  serviceChargeRate: number; 
  printers: PrinterDevice[];
  defaultPrinterId: string | null;
  users: UserAccount[];
  tables: TableDefinition[];
  categories: MenuCategory[];
  currentUser: AuthenticatedUser | null; 
  timeLogs: TimeLog[]; 
  waiters: Waiter[]; // Kept for now to avoid breaking other parts, but logically deprecated
}

export const MOCK_WAITER_ORDER_ITEMS: OrderItem[] = [
  { id: 'item1', name: 'Espresso', price: 150, category: 'cat1', quantity: 1, description: 'Strong black coffee.', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'coffee cup' },
  { id: 'item5', name: 'Chicken Mo:Mo (Steamed)', price: 250, category: 'cat2', quantity: 2, description: 'Nepali steamed chicken dumplings.', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'momo dumplings' },
  { id: 'item3', name: 'Nepali Tea (Chiya)', price: 80, category: 'cat1', quantity: 1, description: 'Traditional Nepali milk tea.', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'tea cup' },
];
