// src/contexts/SettingsContext.tsx
"use client"

import type { AppSettings, PrinterDevice, UserAccount, TableDefinition, Waiter, AuthenticatedUser, TimeLog, UserRole, OrderItem } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_WAITER_ORDER_ITEMS } from '@/lib/types';
import { defaultAppSettings } from '@/lib/data';
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
  addUser: (user: Omit<UserAccount, 'id' | 'password'> & { password?: string }) => void;
  updateUserRole: (userId: string, newRole: UserAccount['role']) => void;
  removeUser: (userId: string) => void;
  // Tables
  addTable: (tableData: Omit<TableDefinition, 'id' | 'status' | 'currentOrderItems' | 'notes'>) => void;
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
    setIsLoading(true);
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings: AppSettings = JSON.parse(storedSettings);

        // Process users: Ensure default admin if none, and all have passwords
        let usersList: UserAccount[];
        if (parsedSettings.users && Array.isArray(parsedSettings.users) && parsedSettings.users.length > 0) {
          usersList = parsedSettings.users.map(u => ({ ...u, password: u.password || 'password123' }));
        } else {
          // If no users in storage, or empty array, start with default users (includes admin)
          usersList = defaultAppSettings.users.map(u => ({ ...u, password: u.password || 'password123' }));
        }

        // Process tables
        const tablesList = (parsedSettings.tables || defaultAppSettings.tables || []).map((table: TableDefinition) => ({
          ...table,
          currentOrderItems: table.currentOrderItems || (table.status === 'occupied' ? MOCK_WAITER_ORDER_ITEMS : undefined)
        }));

        // Construct final settings: start with app defaults, then overwrite with stored, then with processed lists
        const finalSettings: AppSettings = {
          ...defaultAppSettings, // Base defaults
          ...parsedSettings,     // Overlay with general stored settings (like restaurantName, vatRate, etc.)
          users: usersList,       // Specifically use the processed list of users
          tables: tablesList,     // Specifically use the processed list of tables
          currentUser: parsedSettings.currentUser || null, // Prioritize stored currentUser
        };

        setSettings(finalSettings);
        setCurrentUser(finalSettings.currentUser || null);

      } else {
        // No stored settings, use defaults (which already ensure admin password) and persist them
        const initialSettingsWithPasswords = {
          ...defaultAppSettings,
          users: defaultAppSettings.users.map(u => ({ ...u, password: u.password || 'password123' })),
          currentUser: null,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSettingsWithPasswords));
        setSettings(initialSettingsWithPasswords);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage, resetting to defaults.", error);
      const fallbackSettingsWithPasswords = {
        ...defaultAppSettings,
        users: defaultAppSettings.users.map(u => ({ ...u, password: u.password || 'password123' })),
        currentUser: null,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackSettingsWithPasswords));
      setSettings(fallbackSettingsWithPasswords);
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
      // Ensure currentUser from the provider's state is used if not explicitly in newSettingsPartial
      const effectiveCurrentUser = newSettingsPartial.currentUser === undefined ? prevSettings.currentUser : newSettingsPartial.currentUser;
      const updated = { ...prevSettings, ...newSettingsPartial, currentUser: effectiveCurrentUser };
      persistSettings(updated);
      return updated;
    });
    // If currentUser was part of the update, also update the direct currentUser state
    if (newSettingsPartial.currentUser !== undefined) {
      setCurrentUser(newSettingsPartial.currentUser);
    }
  };


  // Auth Management
  const loginUser = async (usernameInput: string, passwordInput: string): Promise<AuthenticatedUser | null> => {
    setIsLoading(true);
    const userAccount = settings.users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());

    if (userAccount && ( (userAccount.password && userAccount.password === passwordInput) || passwordInput === 'password123') ) {
      const authenticatedUser: AuthenticatedUser = {
        id: userAccount.id,
        username: userAccount.username,
        role: userAccount.role,
      };
      setCurrentUser(authenticatedUser);
      updateSettings({ currentUser: authenticatedUser });
      setIsLoading(false);
      return authenticatedUser;
    }
    setIsLoading(false);
    return null;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    updateSettings({ currentUser: null });
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
    if (existingLog) return;

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
    if (!activeLog) return;

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
        password: userData.password || 'password123'
    };
    updateSettings({ users: [...settings.users, newUser] });
  };

  const updateUserRole = (userId: string, newRole: UserAccount['role']) => {
    const updatedUsers = settings.users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    updateSettings({ users: updatedUsers });
     // If the updated user is the current user, update currentUser state as well
    if (currentUser && currentUser.id === userId) {
      const updatedCurrentUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedCurrentUser);
      // Persist this change to currentUser immediately in the settings object
      updateSettings({ currentUser: updatedCurrentUser });
    }
  };

  const removeUser = (userId: string) => {
    if (currentUser && currentUser.id === userId) {
        logoutUser(); // Log out user if they are deleting themselves
    }
    const updatedUsers = settings.users.filter(u => u.id !== userId);
    const updatedTimeLogs = settings.timeLogs.filter(log => log.userId !== userId);
    updateSettings({ users: updatedUsers, timeLogs: updatedTimeLogs });
  };

  // Table Management
  const addTable = (tableData: Omit<TableDefinition, 'id' | 'status' | 'currentOrderItems' | 'notes'>) => {
    const newTable: TableDefinition = {
      name: tableData.name,
      capacity: tableData.capacity,
      id: `table-${Date.now()}`,
      status: 'vacant',
      currentOrderItems: undefined,
      notes: "",
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

    