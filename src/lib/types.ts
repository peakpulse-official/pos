import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  description?: string;
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
  username: string;
  role: UserRole;
}

export type TableStatus = 'vacant' | 'occupied' | 'needs_bill' | 'needs_cleaning';

export interface TableDefinition {
  id: string;
  name: string; // e.g., "T1", "Window Table 5"
  capacity: number;
  status: TableStatus;
  waiterId?: string | null; // ID of the assigned waiter
  notes?: string;
  // position?: { x: number, y: number }; // For future floor plan drawing
}

export interface Waiter {
  id: string;
  name: string;
}

export interface AppSettings {
  restaurantName: string;
  restaurantAddress: string;
  restaurantContact: string;
  vatRate: number; // e.g., 0.13 for 13%
  serviceChargeRate: number; // e.g., 0.10 for 10%
  printers: PrinterDevice[];
  defaultPrinterId: string | null;
  users: UserAccount[];
  tables: TableDefinition[];
  waiters: Waiter[];
}
