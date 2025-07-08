
import type { MenuItem, Order, DailySales, AppSettings, MenuCategory } from './types';

const defaultCategories: MenuCategory[] = [
  { id: 'cat1', name: 'Beverages', iconName: 'Coffee' },
  { id: 'cat2', name: 'Snacks', iconName: 'Sandwich' },
  { id: 'cat3', name: 'Main Course', iconName: 'Pizza' },
  { id: 'cat4', name: 'Desserts', iconName: 'IceCream' },
  { id: 'cat5', name: 'Nepali Specials', iconName: 'Utensils' },
  { id: 'cat6', name: 'Quick Bites', iconName: 'Zap' },
];

export const menuItems: MenuItem[] = [
  { id: 'item1', name: 'Espresso', price: 150, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'coffee cup', description: 'Strong black coffee.', recipe: '1. Grind coffee beans. 2. Tamp grounds. 3. Brew with espresso machine for 25-30 seconds. 4. Serve immediately.' },
  { id: 'item2', name: 'Latte', price: 200, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'latte art', description: 'Espresso with steamed milk.', recipe: '1. Brew a shot of espresso. 2. Steam milk to create microfoam. 3. Pour steamed milk over espresso. 4. Top with a layer of foam. Create latte art if desired.' },
  { id: 'item3', name: 'Nepali Tea (Chiya)', price: 80, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'tea cup', description: 'Traditional Nepali milk tea.', recipe: '1. Boil water with tea leaves, ginger, cardamom, and cloves. 2. Add milk and sugar. 3. Simmer for 5-7 minutes. 4. Strain and serve hot.' },
  { id: 'item14', name: 'Americano', price: 170, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'black coffee', description: 'Espresso with hot water.', recipe: '1. Brew a shot of espresso. 2. Top with hot water to desired strength. Serve immediately.' },
  { id: 'item15', name: 'Cappuccino', price: 220, category: 'cat1', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'frothy coffee', description: 'Espresso, steamed milk, and foam.', recipe: '1. Brew a shot of espresso. 2. Steam milk, creating more foam than a latte. 3. Pour equal parts espresso, steamed milk, and foam into a cup.' },
  { id: 'item4', name: 'Samosa (2 pcs)', price: 100, category: 'cat2', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'samosa snack', description: 'Crispy pastry with spiced potato filling.', recipe: '1. Prepare spiced potato filling. 2. Create cone from dough wrapper and fill with potato mix. 3. Seal and deep fry until golden brown. Serve with chutney.' },
  { id: 'item5', name: 'Chicken Mo:Mo (Steamed)', price: 250, category: 'cat2', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'momo dumplings', description: 'Nepali steamed chicken dumplings.', recipe: '1. Prepare chicken filling with minced chicken, onions, ginger, garlic, and spices. 2. Make dough and roll into small circles. 3. Fill and pleat dumplings. 4. Steam for 10-12 minutes. 5. Serve with achar (dipping sauce).' },
  { id: 'item6', name: 'Veg Pakora', price: 180, category: 'cat2', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'pakora fritters', description: 'Mixed vegetable fritters.', recipe: '1. Chop mixed vegetables (onion, potato, spinach). 2. Mix with gram flour (besan) and spices to form a thick batter. 3. Drop spoonfuls into hot oil and deep fry until crispy and golden.' },
  { id: 'item16', name: 'Paneer Tikka', price: 300, category: 'cat2', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'paneer tikka', description: 'Grilled cottage cheese cubes.', recipe: '1. Cube paneer and marinate in yogurt and tandoori spices. 2. Skewer paneer with bell peppers and onions. 3. Grill or bake in a tandoor until charred and cooked through.' },
  { id: 'item7', name: 'Chicken Thukpa', price: 350, category: 'cat3', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'noodle soup', description: 'Hearty Tibetan noodle soup with chicken.', recipe: '1. Boil noodles and set aside. 2. Create a broth with chicken stock, vegetables, and spices. 3. Add shredded cooked chicken. 4. Combine noodles and broth in a bowl and serve hot.' },
  { id: 'item8', name: 'Dal Bhat Tarkari (Veg)', price: 400, category: 'cat3', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'nepali thali', description: 'Traditional Nepali meal set.', recipe: 'A platter typically includes: 1. Lentil soup (Dal). 2. Steamed rice (Bhat). 3. Vegetable curry (Tarkari). 4. A side of pickle (Achar) and greens (Saag).' },
  { id: 'item9', name: 'Mutton Curry with Rice', price: 550, category: 'cat3', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'curry rice', description: 'Spicy mutton curry served with rice.', recipe: '1. Sauté onions, ginger, garlic, and spices. 2. Add mutton pieces and brown them. 3. Add tomatoes and water, then slow-cook until mutton is tender. 4. Serve hot with steamed rice.' },
  { id: 'item17', name: 'Fish Curry', price: 480, category: 'cat3', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'fish meal', description: 'Tangy fish curry with local spices.', recipe: '1. Marinate fish pieces in turmeric and salt. 2. Create a curry base with mustard oil, spices, and tomato puree. 3. Gently simmer fish in the curry until cooked through. 4. Garnish with cilantro and serve.' },
  { id: 'item10', name: 'Gulab Jamun (2 pcs)', price: 120, category: 'cat4', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'sweet dessert', description: 'Sweet milk-solid balls in syrup.', recipe: '1. Mix milk powder (khoya), flour, and milk to form a dough. 2. Roll into small balls and deep fry until golden brown. 3. Soak fried balls in a warm sugar syrup flavored with cardamom and rose water.' },
  { id: 'item11', name: 'Juju Dhau (King Curd)', price: 150, category: 'cat4', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'yogurt dessert', description: 'Rich and creamy Bhaktapur yogurt.', recipe: '1. Boil milk and reduce it slightly. 2. Cool milk to a lukewarm temperature. 3. Add a starter culture and sugar. 4. Pour into clay pots and let it set in a warm place until firm.' },
  { id: 'item18', name: 'Lal Mohan (2 pcs)', price: 100, category: 'cat4', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'indian sweets', description: 'Another popular milk-based sweet.', recipe: 'Similar to Gulab Jamun, but often slightly firmer. Dough balls are deep-fried and soaked in sugar syrup.' },
  { id: 'item12', name: 'Sel Roti (2 pcs) with Aloo Achar', price: 200, category: 'cat5', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'nepali bread', description: 'Sweet rice bread with potato pickle.', recipe: '1. Create a batter from rice flour, sugar, and ghee. 2. Pour batter in a ring shape into hot oil and fry until golden. 3. Serve with a spicy potato pickle (Aloo Achar).' },
  { id: 'item13', name: 'Newari Khaja Set', price: 600, category: 'cat5', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'nepali platter', description: 'Authentic Newari appetizer platter.', recipe: 'A platter of various Newari items. Typically includes: beaten rice (chiura), smoked meat (choila), lentil pancake (bara), spiced potatoes (aloo wala), and pickles.' },
  { id: 'item19', name: 'Chatamari (Nepali Pizza)', price: 280, category: 'cat5', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'nepali pizza', description: 'Rice flour crepe with toppings.', recipe: '1. Create a thin batter from rice flour. 2. Spread the batter like a crepe on a hot pan. 3. Top with minced meat, eggs, or vegetables. 4. Cook until the base is crispy and toppings are cooked.' },
  { id: 'item20', name: 'French Fries', price: 150, category: 'cat6', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'french fries', description: 'Classic crispy french fries.', recipe: '1. Cut potatoes into strips. 2. Fry in hot oil until lightly cooked. 3. Remove and cool. 4. Fry again at a higher temperature until golden brown and crispy. 5. Season with salt.' },
  { id: 'item21', name: 'Veg Sandwich', price: 220, category: 'cat6', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'veg sandwich', description: 'Healthy vegetable sandwich.', recipe: '1. Layer slices of cucumber, tomato, onion, and lettuce between two slices of bread. 2. Add cheese and chutney or mayonnaise. 3. Grill or serve fresh.' },
  { id: 'item22', name: 'Chicken Burger', price: 350, category: 'cat6', imageUrl: 'https://placehold.co/150x100.png', dataAiHint: 'chicken burger', description: 'Juicy chicken patty in a bun.', recipe: '1. Grill a seasoned chicken patty. 2. Toast a burger bun. 3. Assemble with lettuce, tomato, onion, and sauces. 4. Serve immediately.' },
];

export const initialOrders: Order[] = [
  { 
    id: 'order1', 
    orderNumber: 'ORD001',
    items: [
      { ...menuItems.find(mi => mi.id === 'item2')!, quantity: 1 }, 
      { ...menuItems.find(mi => mi.id === 'item4')!, quantity: 2 }, 
    ], 
    subtotal: (200 * 1) + (100 * 2),
    vatRate: 0.13,
    vat: ((200 * 1) + (100 * 2)) * 0.13,
    serviceChargeRate: 0.10,
    serviceCharge: ((200 * 1) + (100 * 2)) * 0.10,
    total: ((200 * 1) + (100 * 2)) * (1 + 0.13 + 0.10), 
    orderStatus: 'completed',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
    customerName: 'Hari Sharma',
    paymentMethod: 'cash',
    orderType: 'dine-in',
  },
  { 
    id: 'order2', 
    orderNumber: 'ORD002',
    items: [
      { ...menuItems.find(mi => mi.id === 'item5')!, quantity: 1 }, 
      { ...menuItems.find(mi => mi.id === 'item8')!, quantity: 1 }, 
      { ...menuItems.find(mi => mi.id === 'item3')!, quantity: 2 }, 
    ], 
    subtotal: (250 * 1) + (400 * 1) + (80 * 2),
    vatRate: 0.13,
    vat: ((250 * 1) + (400 * 1) + (80 * 2)) * 0.13,
    serviceChargeRate: 0.10,
    serviceCharge: ((250 * 1) + (400 * 1) + (80 * 2)) * 0.10,
    total: ((250 * 1) + (400 * 1) + (80 * 2)) * (1 + 0.13 + 0.10),
    orderStatus: 'in_kitchen',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), 
    customerName: 'Sita Rai',
    orderType: 'takeout',
  }
];

export const mockDailySales: DailySales = {
  date: new Date().toISOString().split('T')[0],
  totalRevenue: initialOrders.reduce((sum, order) => sum + (order.paymentStatus === 'paid' ? order.total : 0), 0),
  totalOrders: initialOrders.filter(order => order.paymentStatus === 'paid').length,
  popularItems: [
    { itemId: 'item2', name: 'Latte', quantitySold: 10, revenue: 2000 },
    { itemId: 'item5', name: 'Chicken Mo:Mo (Steamed)', quantitySold: 8, revenue: 2000 },
    { itemId: 'item8', name: 'Dal Bhat Tarkari (Veg)', quantitySold: 7, revenue: 2800 },
    { itemId: 'item4', name: 'Samosa (2 pcs)', quantitySold: 12, revenue: 1200 },
    { itemId: 'item3', name: 'Nepali Tea (Chiya)', quantitySold: 15, revenue: 1200 },
  ].sort((a,b) => b.quantitySold - a.quantitySold),
};

export const defaultAppSettings: AppSettings = {
  restaurantName: 'Annapurna POS',
  restaurantAddress: 'Kathmandu, Nepal',
  restaurantContact: '+977-1-4XXXXXX',
  logoUrl: '',
  vatRate: 0.13,
  serviceChargeRate: 0.10,
  printers: [],
  defaultPrinterId: null,
  users: [ 
    { id: 'admin-default', username: 'admin@example.com', password: 'password123', role: 'Admin', hourlyRate: 0 },
    { id: 'waiter-default', username: 'waiter@example.com', password: 'password123', role: 'Waiter', hourlyRate: 200 },
    { id: 'manager-default', username: 'manager@example.com', password: 'password123', role: 'Manager', hourlyRate: 350 },
  ],
  tables: [],
  waiters: [], // This is now deprecated and will be removed.
  categories: defaultCategories,
  currentUser: null,
  timeLogs: [],
};
