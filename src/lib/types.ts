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

export interface AppSettings {
  restaurantName: string;
  restaurantAddress: string;
  restaurantContact: string;
  vatRate: number; // e.g., 0.13 for 13%
  serviceChargeRate: number; // e.g., 0.10 for 10%
}
