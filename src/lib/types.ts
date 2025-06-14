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
  icon?: LucideIcon;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export type OrderType = 'dine-in' | 'takeout' | 'delivery';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  vat: number; // VAT amount
  vatRate: number; // VAT rate at time of order
  serviceCharge: number; // Service charge amount
  serviceChargeRate: number; // Service charge rate at time of order
  status: 'pending' | 'completed' | 'paid' | 'cancelled';
  createdAt: string; // ISO string for date
  orderNumber: string;
  customerName?: string;
  paymentMethod?: 'cash' | 'card' | 'online';
  orderType: OrderType;
  customerPhone?: string;
  deliveryAddress?: string;
}

export interface Bill extends Order {
  billNumber: string;
  printedAt: string; // ISO string for date
}

export interface DailySales {
  date: string; // ISO string for date
  totalRevenue: number;
  totalOrders: number;
  popularItems: { itemId: string, name: string, quantitySold: number }[];
}

export type PrinterType = "Receipt" | "Kitchen" | "Label";
export interface PrinterDevice {
  id: string;
  name: string;
  type: PrinterType;
}

export type UserRole = "Admin" | "Staff" | "Manager";
export interface UserAccount {
  id: string;
  username: string; // This will be used as the login identifier (e.g., email)
  password?: string; // For prototype: plain text. DO NOT USE IN PRODUCTION.
  role: UserRole;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: UserRole;
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
  totalBreakDurationMinutes?: number; // Calculated in minutes
}

export type TableStatus = 'vacant' | 'occupied' | 'needs_bill' | 'needs_cleaning';

export interface TableDefinition {
  id: string;
  name: string; // e.g., "T1", "Window Table 5"
  capacity: number;
  status: TableStatus;
  waiterId?: string | null; // ID of the assigned waiter
  notes?: string;
  currentOrderItems?: OrderItem[]; 
}

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
  waiters: Waiter[];
  currentUser: AuthenticatedUser | null; // Added for auth state
  timeLogs: TimeLog[]; // Added for check-in/out
}

// Mock order items for waiter view demonstration
export const MOCK_WAITER_ORDER_ITEMS: OrderItem[] = [
  { id: 'item1', name: 'Espresso', price: 150, category: 'cat1', quantity: 1, description: 'Strong black coffee.', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'coffee cup' },
  { id: 'item5', name: 'Chicken Mo:Mo (Steamed)', price: 250, category: 'cat2', quantity: 2, description: 'Nepali steamed chicken dumplings.', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'momo dumplings' },
  { id: 'item3', name: 'Nepali Tea (Chiya)', price: 80, category: 'cat1', quantity: 1, description: 'Traditional Nepali milk tea.', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'tea cup' },
];
