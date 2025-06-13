// src/contexts/SettingsContext.tsx
"use client"

import type { AppSettings, PrinterDevice, UserAccount, TableDefinition, Waiter, TableStatus, OrderItem } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_WAITER_ORDER_ITEMS } from '@/lib/types'; // Import mock items

const LOCAL_STORAGE_KEY = 'annapurnaAppSettings';

const defaultSettings: AppSettings = {
  restaurantName: 'Annapurna POS',
  restaurantAddress: 'Kathmandu, Nepal',
  restaurantContact: '+977-1-4XXXXXX',
  vatRate: 0.13, // 13%
  serviceChargeRate: 0.10, // 10%
  printers: [],
  defaultPrinterId: null,
  users: [],
  tables: [],
  waiters: [],
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  // Printers
  addPrinter: (printer: Omit<PrinterDevice, 'id'>) => void;
  removePrinter: (printerId: string) => void;
  setDefaultPrinter: (printerId: string | null) => void;
  // Users
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  updateUserRole: (userId: string, newRole: UserAccount['role']) => void;
  removeUser: (userId: string) => void;
  // Tables
  addTable: (tableData: Omit<TableDefinition, 'id' | 'status' | 'currentOrderItems'>) => void;
  updateTable: (tableId: string, updates: Partial<Omit<TableDefinition, 'id'>>) => void;
  removeTable: (tableId: string) => void;
  assignMockOrderToTable: (tableId: string) => void; // For waiter prototype
  clearMockOrderFromTable: (tableId: string) => void; // For waiter prototype
  // Waiters
  addWaiter: (waiterData: Omit<Waiter, 'id'>) => void;
  updateWaiter: (waiterId: string, updates: Partial<Omit<Waiter, 'id'>>) => void;
  removeWaiter: (waiterId: string) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Ensure tables have currentOrderItems, even if loading from older storage
        const validatedTables = (parsedSettings.tables || []).map((table: TableDefinition) => ({
          ...table,
          currentOrderItems: table.currentOrderItems || (table.status === 'occupied' ? MOCK_WAITER_ORDER_ITEMS : undefined)
        }));
        setSettings({ ...defaultSettings, ...parsedSettings, tables: validatedTables });
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultSettings));
         setSettings(defaultSettings);
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultSettings));
      setSettings(defaultSettings);
    }
    setIsLoading(false);
  }, []);

  const persistSettings = (updatedSettings: AppSettings) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prevSettings => {
      const updated = { ...prevSettings, ...newSettings };
      persistSettings(updated);
      return updated;
    });
  };

  // Printer Management
  const addPrinter = (printerData: Omit<PrinterDevice, 'id'>) => {
    setSettings(prevSettings => {
      const newPrinter: PrinterDevice = { ...printerData, id: `printer-${Date.now()}` };
      const updatedPrinters = [...prevSettings.printers, newPrinter];
      const updated = { ...prevSettings, printers: updatedPrinters };
      persistSettings(updated);
      return updated;
    });
  };

  const removePrinter = (printerId: string) => {
    setSettings(prevSettings => {
      const updatedPrinters = prevSettings.printers.filter(p => p.id !== printerId);
      const newDefaultPrinterId = prevSettings.defaultPrinterId === printerId ? null : prevSettings.defaultPrinterId;
      const updated = { ...prevSettings, printers: updatedPrinters, defaultPrinterId: newDefaultPrinterId };
      persistSettings(updated);
      return updated;
    });
  };

  const setDefaultPrinter = (printerId: string | null) => {
    setSettings(prevSettings => {
      const updated = { ...prevSettings, defaultPrinterId: printerId };
      persistSettings(updated);
      return updated;
    });
  };

  // User Management
  const addUser = (userData: Omit<UserAccount, 'id'>) => {
    setSettings(prevSettings => {
      const newUser: UserAccount = { ...userData, id: `user-${Date.now()}` };
      const updatedUsers = [...prevSettings.users, newUser];
      const updated = { ...prevSettings, users: updatedUsers };
      persistSettings(updated);
      return updated;
    });
  };

  const updateUserRole = (userId: string, newRole: UserAccount['role']) => {
    setSettings(prevSettings => {
      const updatedUsers = prevSettings.users.map(u => u.id === userId ? { ...u, role: newRole } : u);
      const updated = { ...prevSettings, users: updatedUsers };
      persistSettings(updated);
      return updated;
    });
  };

  const removeUser = (userId: string) => {
    setSettings(prevSettings => {
      const updatedUsers = prevSettings.users.filter(u => u.id !== userId);
      const updated = { ...prevSettings, users: updatedUsers };
      persistSettings(updated);
      return updated;
    });
  };

  // Table Management
  const addTable = (tableData: Omit<TableDefinition, 'id' | 'status' | 'currentOrderItems'>) => {
    setSettings(prevSettings => {
      const newTable: TableDefinition = { 
        ...tableData, 
        id: `table-${Date.now()}`, 
        status: 'vacant',
        currentOrderItems: undefined, // Initially no items
      };
      const updatedTables = [...prevSettings.tables, newTable];
      const updated = { ...prevSettings, tables: updatedTables };
      persistSettings(updated);
      return updated;
    });
  };

  const updateTable = (tableId: string, updates: Partial<Omit<TableDefinition, 'id'>>) => {
    setSettings(prevSettings => {
      const updatedTables = prevSettings.tables.map(t => 
        t.id === tableId ? { ...t, ...updates } : t
      );
      const updated = { ...prevSettings, tables: updatedTables };
      persistSettings(updated);
      return updated;
    });
  };

  const removeTable = (tableId: string) => {
    setSettings(prevSettings => {
      const updatedTables = prevSettings.tables.filter(t => t.id !== tableId);
      const updated = { ...prevSettings, tables: updatedTables };
      persistSettings(updated);
      return updated;
    });
  };

  const assignMockOrderToTable = (tableId: string) => {
    setSettings(prevSettings => {
      const updatedTables = prevSettings.tables.map(t => 
        t.id === tableId ? { ...t, currentOrderItems: MOCK_WAITER_ORDER_ITEMS } : t
      );
      const updated = { ...prevSettings, tables: updatedTables };
      persistSettings(updated);
      return updated;
    });
  };

  const clearMockOrderFromTable = (tableId: string) => {
     setSettings(prevSettings => {
      const updatedTables = prevSettings.tables.map(t => 
        t.id === tableId ? { ...t, currentOrderItems: undefined } : t
      );
      const updated = { ...prevSettings, tables: updatedTables };
      persistSettings(updated);
      return updated;
    });
  };

  // Waiter Management
  const addWaiter = (waiterData: Omit<Waiter, 'id'>) => {
    setSettings(prevSettings => {
      const newWaiter: Waiter = { ...waiterData, id: `waiter-${Date.now()}` };
      const updatedWaiters = [...prevSettings.waiters, newWaiter];
      const updated = { ...prevSettings, waiters: updatedWaiters };
      persistSettings(updated);
      return updated;
    });
  };

  const updateWaiter = (waiterId: string, updates: Partial<Omit<Waiter, 'id'>>) => {
    setSettings(prevSettings => {
      const updatedWaiters = prevSettings.waiters.map(w =>
        w.id === waiterId ? { ...w, ...updates } : w
      );
      const updated = { ...prevSettings, waiters: updatedWaiters };
      persistSettings(updated);
      return updated;
    });
  };
  
  const removeWaiter = (waiterId: string) => {
    setSettings(prevSettings => {
      // Also unassign this waiter from any tables
      const unassignedTables = prevSettings.tables.map(t => 
        t.waiterId === waiterId ? { ...t, waiterId: null } : t
      );
      const updatedWaiters = prevSettings.waiters.filter(w => w.id !== waiterId);
      const updated = { ...prevSettings, waiters: updatedWaiters, tables: unassignedTables };
      persistSettings(updated);
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ 
        settings, 
        updateSettings, 
        addPrinter, 
        removePrinter, 
        setDefaultPrinter,
        addUser,
        updateUserRole,
        removeUser,
        addTable,
        updateTable,
        removeTable,
        assignMockOrderToTable,
        clearMockOrderFromTable,
        addWaiter,
        updateWaiter,
        removeWaiter,
        isLoading 
      }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
