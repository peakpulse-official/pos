// src/contexts/SettingsContext.tsx
"use client"

import type { AppSettings, PrinterDevice, UserAccount, TableDefinition, Waiter, AuthenticatedUser, TimeLog, UserRole } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_WAITER_ORDER_ITEMS } from '@/lib/types'; 
import { defaultAppSettings } from '@/lib/data'; // Import defaultAppSettings
import { format } from 'date-fns';

const LOCAL_STORAGE_KEY = 'annapurnaAppSettings';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  // Auth
  loginUser: (usernameInput: string, passwordInput: string) => Promise<AuthenticatedUser | null>;
  logoutUser: () => void;
  currentUser: AuthenticatedUser | null;
  // Check-in/out
  checkInUser: () => void;
  checkOutUser: () => void;
  getTodaysTimeLogForCurrentUser: () => TimeLog | undefined;
  // Printers
  addPrinter: (printer: Omit<PrinterDevice, 'id'>) => void;
  removePrinter: (printerId: string) => void;
  setDefaultPrinter: (printerId: string | null) => void;
  // Users
  addUser: (user: Omit<UserAccount, 'id' | 'password'> & { password?: string }) => void; // Allow optional password on add
  updateUserRole: (userId: string, newRole: UserAccount['role']) => void;
  removeUser: (userId: string) => void;
  // Tables
  addTable: (tableData: Omit<TableDefinition, 'id' | 'status' | 'currentOrderItems'>) => void;
  updateTable: (tableId: string, updates: Partial<Omit<TableDefinition, 'id'>>) => void;
  removeTable: (tableId: string) => void;
  assignMockOrderToTable: (tableId: string) => void; 
  clearMockOrderFromTable: (tableId: string) => void; 
  // Waiters
  addWaiter: (waiterData: Omit<Waiter, 'id'>) => void;
  updateWaiter: (waiterId: string, updates: Partial<Omit<Waiter, 'id'>>) => void;
  removeWaiter: (waiterId: string) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(defaultAppSettings.currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings: AppSettings = JSON.parse(storedSettings);
        const validatedTables = (parsedSettings.tables || []).map((table: TableDefinition) => ({
          ...table,
          currentOrderItems: table.currentOrderItems || (table.status === 'occupied' ? MOCK_WAITER_ORDER_ITEMS : undefined)
        }));
        const validatedUsers = (parsedSettings.users || defaultAppSettings.users).map(u => ({...u, password: u.password || 'password123' }));

        setSettings({ ...defaultAppSettings, ...parsedSettings, tables: validatedTables, users: validatedUsers });
        setCurrentUser(parsedSettings.currentUser || null);
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultAppSettings));
         setSettings(defaultAppSettings);
         setCurrentUser(null);
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultAppSettings));
      setSettings(defaultAppSettings);
      setCurrentUser(null);
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

  const updateSettings = (newSettingsPartial: Partial<AppSettings>) => {
    setSettings(prevSettings => {
      const updated = { ...prevSettings, ...newSettingsPartial, currentUser }; // Ensure currentUser from state is saved
      persistSettings(updated);
      return updated;
    });
  };

  // Auth Management
  const loginUser = async (usernameInput: string, passwordInput: string): Promise<AuthenticatedUser | null> => {
    setIsLoading(true);
    const userAccount = settings.users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());
    
    // MOCK LOGIN: In a real app, compare hashed passwords. Here, plain text for prototype.
    // Ensure all users created via settings also have this default password if not set there.
    if (userAccount && (userAccount.password === passwordInput || passwordInput === 'password123')) {
      const authenticatedUser: AuthenticatedUser = {
        id: userAccount.id,
        username: userAccount.username,
        role: userAccount.role,
      };
      setCurrentUser(authenticatedUser);
      updateSettings({ currentUser: authenticatedUser }); // Persist currentUser
      setIsLoading(false);
      return authenticatedUser;
    }
    setIsLoading(false);
    return null;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    updateSettings({ currentUser: null }); // Persist null currentUser
  };

  // Check-in/Check-out Management
  const getTodaysTimeLogForCurrentUser = (): TimeLog | undefined => {
    if (!currentUser) return undefined;
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return settings.timeLogs.find(
      log => log.userId === currentUser.id && log.date === todayStr && !log.checkOutTime
    );
  };

  const checkInUser = () => {
    if (!currentUser) return;
    const existingLog = getTodaysTimeLogForCurrentUser();
    if (existingLog) return; // Already checked in

    const newTimeLog: TimeLog = {
      id: `timelog-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      role: currentUser.role,
      checkInTime: new Date().toISOString(),
      date: format(new Date(), 'yyyy-MM-dd'),
    };
    updateSettings({ timeLogs: [...settings.timeLogs, newTimeLog] });
  };

  const checkOutUser = () => {
    if (!currentUser) return;
    const activeLog = getTodaysTimeLogForCurrentUser();
    if (!activeLog) return; // Not checked in or already checked out

    const updatedTimeLogs = settings.timeLogs.map(log =>
      log.id === activeLog.id ? { ...log, checkOutTime: new Date().toISOString() } : log
    );
    updateSettings({ timeLogs: updatedTimeLogs });
  };


  // Printer Management
  const addPrinter = (printerData: Omit<PrinterDevice, 'id'>) => {
    const newPrinter: PrinterDevice = { ...printerData, id: `printer-${Date.now()}` };
    updateSettings({ printers: [...settings.printers, newPrinter] });
  };

  const removePrinter = (printerId: string) => {
    const updatedPrinters = settings.printers.filter(p => p.id !== printerId);
    const newDefaultPrinterId = settings.defaultPrinterId === printerId ? null : settings.defaultPrinterId;
    updateSettings({ printers: updatedPrinters, defaultPrinterId: newDefaultPrinterId });
  };

  const setDefaultPrinter = (printerId: string | null) => {
    updateSettings({ defaultPrinterId: printerId });
  };

  // User Management
  const addUser = (userData: Omit<UserAccount, 'id' | 'password'> & { password?: string }) => {
    const newUser: UserAccount = { 
        ...userData, 
        id: `user-${Date.now()}`,
        password: userData.password || 'password123' // Default password for prototype
    };
    updateSettings({ users: [...settings.users, newUser] });
  };

  const updateUserRole = (userId: string, newRole: UserAccount['role']) => {
    const updatedUsers = settings.users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    updateSettings({ users: updatedUsers });
  };

  const removeUser = (userId: string) => {
    const updatedUsers = settings.users.filter(u => u.id !== userId);
    // Also remove their time logs if desired
    // const updatedTimeLogs = settings.timeLogs.filter(log => log.userId !== userId);
    updateSettings({ users: updatedUsers /*, timeLogs: updatedTimeLogs */ });
  };

  // Table Management
  const addTable = (tableData: Omit<TableDefinition, 'id' | 'status' | 'currentOrderItems'>) => {
    const newTable: TableDefinition = { 
      ...tableData, 
      id: `table-${Date.now()}`, 
      status: 'vacant',
      currentOrderItems: undefined, 
    };
    updateSettings({ tables: [...settings.tables, newTable] });
  };

  const updateTable = (tableId: string, updates: Partial<Omit<TableDefinition, 'id'>>) => {
    const updatedTables = settings.tables.map(t => 
      t.id === tableId ? { ...t, ...updates } : t
    );
    updateSettings({ tables: updatedTables });
  };

  const removeTable = (tableId: string) => {
    const updatedTables = settings.tables.filter(t => t.id !== tableId);
    updateSettings({ tables: updatedTables });
  };

  const assignMockOrderToTable = (tableId: string) => {
    const updatedTables = settings.tables.map(t => 
      t.id === tableId ? { ...t, currentOrderItems: MOCK_WAITER_ORDER_ITEMS } : t
    );
    updateSettings({ tables: updatedTables });
  };

  const clearMockOrderFromTable = (tableId: string) => {
     const updatedTables = settings.tables.map(t => 
      t.id === tableId ? { ...t, currentOrderItems: undefined } : t
    );
    updateSettings({ tables: updatedTables });
  };

  // Waiter Management
  const addWaiter = (waiterData: Omit<Waiter, 'id'>) => {
    const newWaiter: Waiter = { ...waiterData, id: `waiter-${Date.now()}` };
    updateSettings({ waiters: [...settings.waiters, newWaiter] });
  };

  const updateWaiter = (waiterId: string, updates: Partial<Omit<Waiter, 'id'>>) => {
    const updatedWaiters = settings.waiters.map(w =>
      w.id === waiterId ? { ...w, ...updates } : w
    );
    updateSettings({ waiters: updatedWaiters });
  };
  
  const removeWaiter = (waiterId: string) => {
    const unassignedTables = settings.tables.map(t => 
      t.waiterId === waiterId ? { ...t, waiterId: null } : t
    );
    const updatedWaiters = settings.waiters.filter(w => w.id !== waiterId);
    updateSettings({ waiters: updatedWaiters, tables: unassignedTables });
  };

  return (
    <SettingsContext.Provider value={{ 
        settings, 
        updateSettings,
        loginUser,
        logoutUser,
        currentUser,
        checkInUser,
        checkOutUser,
        getTodaysTimeLogForCurrentUser,
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
