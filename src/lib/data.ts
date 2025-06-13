import type { MenuCategory, MenuItem, Order, DailySales } from './types';
import { Coffee, Sandwich, Pizza, IceCream, Utensils, Zap } from 'lucide-react';

export const categories: MenuCategory[] = [
  { id: 'cat1', name: 'Beverages', icon: Coffee },
  { id: 'cat2', name: 'Snacks', icon: Sandwich },
  { id: 'cat3', name: 'Main Course', icon: Pizza },
  { id: 'cat4', name: 'Desserts', icon: IceCream },
  { id: 'cat5', name: 'Nepali Specials', icon: Utensils },
  { id: 'cat6', name: 'Quick Bites', icon: Zap },
];

export const menuItems: MenuItem[] = [
  // Beverages
  { id: 'item1', name: 'Espresso', price: 150, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'coffee cup', description: 'Strong black coffee.' },
  { id: 'item2', name: 'Latte', price: 200, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'latte art', description: 'Espresso with steamed milk.' },
  { id: 'item3', name: 'Nepali Tea (Chiya)', price: 80, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'tea cup', description: 'Traditional Nepali milk tea.' },
  { id: 'item14', name: 'Americano', price: 170, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'black coffee', description: 'Espresso with hot water.' },
  { id: 'item15', name: 'Cappuccino', price: 220, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'frothy coffee', description: 'Espresso, steamed milk, and foam.' },

  // Snacks
  { id: 'item4', name: 'Samosa (2 pcs)', price: 100, category: 'cat2', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'samosa snack', description: 'Crispy pastry with spiced potato filling.' },
  { id: 'item5', name: 'Chicken Mo:Mo (Steamed)', price: 250, category: 'cat2', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'momo dumplings', description: 'Nepali steamed chicken dumplings.' },
  { id: 'item6', name: 'Veg Pakora', price: 180, category: 'cat2', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'pakora fritters', description: 'Mixed vegetable fritters.' },
  { id: 'item16', name: 'Paneer Tikka', price: 300, category: 'cat2', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'paneer tikka', description: 'Grilled cottage cheese cubes.' },

  // Main Course
  { id: 'item7', name: 'Chicken Thukpa', price: 350, category: 'cat3', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'noodle soup', description: 'Hearty Tibetan noodle soup with chicken.' },
  { id: 'item8', name: 'Dal Bhat Tarkari (Veg)', price: 400, category: 'cat3', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'nepali thali', description: 'Traditional Nepali meal set.' },
  { id: 'item9', name: 'Mutton Curry with Rice', price: 550, category: 'cat3', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'curry rice', description: 'Spicy mutton curry served with rice.' },
  { id: 'item17', name: 'Fish Curry', price: 480, category: 'cat3', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'fish meal', description: 'Tangy fish curry with local spices.' },

  // Desserts
  { id: 'item10', name: 'Gulab Jamun (2 pcs)', price: 120, category: 'cat4', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'sweet dessert', description: 'Sweet milk-solid balls in syrup.' },
  { id: 'item11', name: 'Juju Dhau (King Curd)', price: 150, category: 'cat4', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'yogurt dessert', description: 'Rich and creamy Bhaktapur yogurt.' },
  { id: 'item18', name: 'Lal Mohan (2 pcs)', price: 100, category: 'cat4', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'indian sweets', description: 'Another popular milk-based sweet.' },

  // Nepali Specials
  { id: 'item12', name: 'Sel Roti (2 pcs) with Aloo Achar', price: 200, category: 'cat5', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'nepali bread', description: 'Sweet rice bread with potato pickle.' },
  { id: 'item13', name: 'Newari Khaja Set', price: 600, category: 'cat5', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'nepali platter', description: 'Authentic Newari appetizer platter.' },
  { id: 'item19', name: 'Chatamari (Nepali Pizza)', price: 280, category: 'cat5', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'nepali pizza', description: 'Rice flour crepe with toppings.' },

  // Quick Bites
  { id: 'item20', name: 'French Fries', price: 150, category: 'cat6', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'french fries', description: 'Classic crispy french fries.'},
  { id: 'item21', name: 'Veg Sandwich', price: 220, category: 'cat6', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'veg sandwich', description: 'Healthy vegetable sandwich.'},
  { id: 'item22', name: 'Chicken Burger', price: 350, category: 'cat6', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'chicken burger', description: 'Juicy chicken patty in a bun.'},

];

export const initialOrders: Order[] = [
  { 
    id: 'order1', 
    orderNumber: 'ORD001',
    items: [
      { ...menuItems.find(mi => mi.id === 'item2')!, quantity: 1 }, // Latte
      { ...menuItems.find(mi => mi.id === 'item4')!, quantity: 2 }, // Samosa
    ], 
    subtotal: (200 * 1) + (100 * 2),
    vat: ((200 * 1) + (100 * 2)) * 0.13,
    serviceCharge: ((200 * 1) + (100 * 2)) * 0.10,
    total: ((200 * 1) + (100 * 2)) * 1.23, // subtotal + 13% VAT + 10% Service Charge (example)
    status: 'paid', 
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    customerName: 'Hari Sharma',
    paymentMethod: 'cash',
  },
  { 
    id: 'order2', 
    orderNumber: 'ORD002',
    items: [
      { ...menuItems.find(mi => mi.id === 'item5')!, quantity: 1 }, // Chicken Mo:Mo
      { ...menuItems.find(mi => mi.id === 'item8')!, quantity: 1 }, // Dal Bhat
      { ...menuItems.find(mi => mi.id === 'item3')!, quantity: 2 }, // Nepali Tea
    ], 
    subtotal: (250 * 1) + (400 * 1) + (80 * 2),
    vat: ((250 * 1) + (400 * 1) + (80 * 2)) * 0.13,
    serviceCharge: ((250 * 1) + (400 * 1) + (80 * 2)) * 0.10,
    total: ((250 * 1) + (400 * 1) + (80 * 2)) * 1.23,
    status: 'completed', 
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    customerName: 'Sita Rai',
  }
];

export const mockDailySales: DailySales = {
  date: new Date().toISOString().split('T')[0],
  totalRevenue: initialOrders.reduce((sum, order) => sum + (order.status === 'paid' ? order.total : 0), 0),
  totalOrders: initialOrders.length,
  popularItems: [
    { itemId: 'item2', name: 'Latte', quantitySold: 10 },
    { itemId: 'item5', name: 'Chicken Mo:Mo (Steamed)', quantitySold: 8 },
    { itemId: 'item8', name: 'Dal Bhat Tarkari (Veg)', quantitySold: 7 },
    { itemId: 'item4', name: 'Samosa (2 pcs)', quantitySold: 12 },
    { itemId: 'item3', name: 'Nepali Tea (Chiya)', quantitySold: 15 },
  ].sort((a,b) => b.quantitySold - a.quantitySold),
};
