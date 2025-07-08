
// src/contexts/SettingsContext.tsx
"use client"

import type { AppSettings, PrinterDevice, UserAccount, TableDefinition, Waiter, AuthenticatedUser, TimeLog, UserRole, OrderItem, OrderType, MenuCategory } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_WAITER_ORDER_ITEMS } from '@/lib/types';
import { defaultAppSettings } from '@/lib/data';
import { format, differenceInMinutes, parseISO } from 'date-fns';

const LOCAL_STORAGE_KEY = 'annapurnaAppSettings';
const MENU_ITEMS_STORAGE_KEY = "annapurnaMenuItems";


interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  // Auth
  loginUser: (usernameInput: string, passwordInput: string) => Promise<AuthenticatedUser | null>;
  logoutUser: () => void;
  currentUser: AuthenticatedUser | null;
  // Check-in/out & Breaks
  checkInUser: () => void;
  checkOutUser: () => void;
  startBreak: () => void;
  endBreak: () => void;
  getTodaysTimeLogForCurrentUser: () => TimeLog | undefined;
  // Printers
  addPrinter: (printer: Omit<PrinterDevice, 'id'>) => void;
  removePrinter: (printerId: string) => void;
  setDefaultPrinter: (printerId: string | null) => void;
  // Users
  addUser: (user: Omit<UserAccount, 'id' | 'password'> & { password?: string, hourlyRate?: number }) => void;
  updateUser: (userId: string, updates: Partial<Omit<UserAccount, 'id' | 'password'>> & { password?: string, hourlyRate?: number }) => void;
  removeUser: (userId: string) => void;
  // Tables
  addTable: (tableData: Omit<TableDefinition, 'id' | 'status' | 'currentOrderItems' | 'notes'>) => void;
  updateTable: (tableId: string, updates: Partial<Omit<TableDefinition, 'id'>>) => void;
  removeTable: (tableId: string) => void;
  assignMockOrderToTable: (tableId: string) => void;
  clearMockOrderFromTable: (tableId: string) => void;
  // Waiters (DEPRECATED - now handled via Users)
  // Categories
  addCategory: (categoryData: Omit<MenuCategory, 'id'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Omit<MenuCategory, 'id'>>) => void;
  removeCategory: (categoryId: string) => boolean;
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
      let parsedSettings: Partial<AppSettings> = {};

      if (storedSettings) {
        parsedSettings = JSON.parse(storedSettings);
      }
      
      let usersList: UserAccount[];
      if (parsedSettings.users && Array.isArray(parsedSettings.users) && parsedSettings.users.length > 0) {
        usersList = parsedSettings.users.map(u => ({ ...u, password: u.password || 'password123', hourlyRate: u.hourlyRate || 0 }));
      } else {
        usersList = defaultAppSettings.users.map(u => ({ ...u, password: u.password || 'password123', hourlyRate: u.hourlyRate || 0 }));
      }
      
      const tablesList = (parsedSettings.tables && Array.isArray(parsedSettings.tables) ? parsedSettings.tables : defaultAppSettings.tables || []).map((table: TableDefinition) => ({
        ...table,
        currentOrderItems: table.currentOrderItems || (table.status === 'occupied' ? MOCK_WAITER_ORDER_ITEMS : undefined)
      }));

      const timeLogsList = (parsedSettings.timeLogs && Array.isArray(parsedSettings.timeLogs) ? parsedSettings.timeLogs : defaultAppSettings.timeLogs || []).map((log: TimeLog) => ({
        ...log,
        totalBreakDurationMinutes: typeof log.totalBreakDurationMinutes === 'number' ? log.totalBreakDurationMinutes : 0,
        hourlyRate: typeof log.hourlyRate === 'number' ? log.hourlyRate : undefined,
      }));


      const finalSettings: AppSettings = {
        ...defaultAppSettings, 
        ...parsedSettings,    
        users: usersList,      
        tables: tablesList,     
        categories: (parsedSettings.categories && parsedSettings.categories.length > 0) ? parsedSettings.categories : defaultAppSettings.categories,
        currentUser: parsedSettings.currentUser || null, 
        timeLogs: timeLogsList,
        waiters: [], // Deprecate waiters
      };
      
      setSettings(finalSettings);
      setCurrentUser(finalSettings.currentUser || null);

    } catch (error) {
      console.error("Failed to load settings from localStorage, resetting to defaults.", error);
      const fallbackSettings = {
        ...defaultAppSettings,
        users: defaultAppSettings.users.map(u => ({ ...u, password: u.password || 'password123', hourlyRate: u.hourlyRate || 0 })),
        currentUser: null,
        timeLogs: (defaultAppSettings.timeLogs || []).map(log => ({...log, totalBreakDurationMinutes: 0, hourlyRate: log.hourlyRate || undefined})),
        waiters: [], // Deprecate waiters
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackSettings));
      setSettings(fallbackSettings);
      setCurrentUser(null);
    }
    setIsLoading(false);
  }, []);


  const persistSettings = (updatedSettings: AppSettings) => {
    try {
      const settingsToSave = { ...updatedSettings };
      delete (settingsToSave as any).waiters; // Don't persist deprecated waiters list
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  };

  const updateSettings = (newSettingsPartial: Partial<Omit<AppSettings, 'waiters'>>) => {
    setSettings(prevSettings => {
      const effectiveCurrentUser = newSettingsPartial.currentUser === undefined ? prevSettings.currentUser : newSettingsPartial.currentUser;
      const updated = { ...prevSettings, ...newSettingsPartial, currentUser: effectiveCurrentUser };
      persistSettings(updated);
      return updated;
    });
    if (newSettingsPartial.currentUser !== undefined) {
      setCurrentUser(newSettingsPartial.currentUser);
    }
  };


  // Auth Management
  const loginUser = async (usernameInput: string, passwordInput: string): Promise<AuthenticatedUser | null> => {
    setIsLoading(true);
    const userAccount = settings.users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());

    if (userAccount && userAccount.password === passwordInput) { 
      const authenticatedUser: AuthenticatedUser = {
        id: userAccount.id,
        username: userAccount.username,
        role: userAccount.role,
        hourlyRate: userAccount.hourlyRate, // Include hourlyRate
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

  // Check-in/Check-out & Break Management
  const getTodaysTimeLogForCurrentUser = (): TimeLog | undefined => {
    if (!currentUser) return undefined;
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return settings.timeLogs.find(
      log => log.userId === currentUser.id && log.date === todayStr && (!log.checkOutTime || (log.breakStartTime && !log.breakEndTime))
    );
  };

  const checkInUser = () => {
    if (!currentUser) return;
    const existingLog = getTodaysTimeLogForCurrentUser();
    if (existingLog && !existingLog.checkOutTime) return; 

    const newTimeLog: TimeLog = {
      id: `timelog-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      role: currentUser.role,
      checkInTime: new Date().toISOString(),
      date: format(new Date(), 'yyyy-MM-dd'),
      totalBreakDurationMinutes: 0,
      hourlyRate: currentUser.hourlyRate, // Snapshot current user's hourly rate
    };
    updateSettings({ timeLogs: [...settings.timeLogs, newTimeLog] });
  };

  const checkOutUser = () => {
    if (!currentUser) return;
    const activeLog = getTodaysTimeLogForCurrentUser();
    if (!activeLog || activeLog.checkOutTime) return; 

    let finalLog = activeLog;
    if (activeLog.breakStartTime && !activeLog.breakEndTime) {
       const breakEndTime = new Date().toISOString();
       const breakDuration = differenceInMinutes(parseISO(breakEndTime), parseISO(activeLog.breakStartTime));
       finalLog = {
           ...activeLog,
           breakEndTime,
           totalBreakDurationMinutes: (activeLog.totalBreakDurationMinutes || 0) + breakDuration
       };
    }
    
    const updatedTimeLogs = settings.timeLogs.map(log =>
      log.id === finalLog.id ? { ...finalLog, checkOutTime: new Date().toISOString() } : log
    );
    updateSettings({ timeLogs: updatedTimeLogs });
  };

  const startBreak = () => {
    if (!currentUser) return;
    const activeLog = getTodaysTimeLogForCurrentUser();
    if (!activeLog || activeLog.checkOutTime || (activeLog.breakStartTime && !activeLog.breakEndTime)) return;

    const updatedTimeLogs = settings.timeLogs.map(log =>
      log.id === activeLog.id ? { ...log, breakStartTime: new Date().toISOString(), breakEndTime: undefined } : log
    );
    updateSettings({ timeLogs: updatedTimeLogs });
  };

  const endBreak = () => {
    if (!currentUser) return;
    const activeLog = getTodaysTimeLogForCurrentUser();
    if (!activeLog || activeLog.checkOutTime || !activeLog.breakStartTime || activeLog.breakEndTime) return;

    const breakEndTime = new Date().toISOString();
    const breakDuration = differenceInMinutes(parseISO(breakEndTime), parseISO(activeLog.breakStartTime as string));
    
    const updatedTimeLogs = settings.timeLogs.map(log =>
      log.id === activeLog.id ? { 
        ...log, 
        breakEndTime: breakEndTime, 
        totalBreakDurationMinutes: (log.totalBreakDurationMinutes || 0) + breakDuration,
      } : log
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
  const addUser = (userData: Omit<UserAccount, 'id' | 'password'> & { password?: string, hourlyRate?: number }) => {
    const newUser: UserAccount = {
        username: userData.username,
        role: userData.role,
        hourlyRate: userData.hourlyRate || 0,
        id: `user-${Date.now()}`,
        password: userData.password && userData.password.length > 0 ? userData.password : 'password123' 
    };
    updateSettings({ users: [...settings.users, newUser] });
  };

  const updateUser = (userId: string, updates: Partial<Omit<UserAccount, 'id' | 'password'>> & { password?: string, hourlyRate?: number }) => {
    const updatedUsers = settings.users.map(u => {
      if (u.id === userId) {
        const { password, hourlyRate, ...otherUpdates } = updates;
        const updatedUser = { ...u, ...otherUpdates };
        if (password && password.length > 0) { 
          updatedUser.password = password;
        }
        if (hourlyRate !== undefined) {
            updatedUser.hourlyRate = hourlyRate;
        }
        return updatedUser;
      }
      return u;
    });
    updateSettings({ users: updatedUsers });

    if (currentUser && currentUser.id === userId) {
      const userAccount = updatedUsers.find(u => u.id === userId);
      if (userAccount) {
        const updatedCurrentUser: AuthenticatedUser = {
          id: userAccount.id,
          username: userAccount.username,
          role: userAccount.role,
          hourlyRate: userAccount.hourlyRate,
        };
        setCurrentUser(updatedCurrentUser);
        updateSettings({ currentUser: updatedCurrentUser }); 
      }
    }
  };

  const removeUser = (userId: string) => {
    if (currentUser && currentUser.id === userId) {
        logoutUser(); 
    }
    const updatedUsers = settings.users.filter(u => u.id !== userId);
    const updatedTimeLogs = settings.timeLogs.filter(log => log.userId !== userId); 
    // Unassign user from any tables
    const unassignedTables = settings.tables.map(t =>
      t.waiterId === userId ? { ...t, waiterId: null } : t
    );
    updateSettings({ users: updatedUsers, timeLogs: updatedTimeLogs, tables: unassignedTables });
  };

  // Table Management
  const addTable = (tableData: Omit<TableDefinition, 'id' | 'status' | 'currentOrderItems' | 'notes' | 'waiterId'>) => {
    const newTable: TableDefinition = {
      ...tableData,
      id: `table-${Date.now()}`,
      status: 'vacant',
      currentOrderItems: undefined,
      notes: "",
      waiterId: null,
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

  // Category Management
  const addCategory = (categoryData: Omit<MenuCategory, 'id'>) => {
    const newCategory: MenuCategory = { ...categoryData, id: `cat-${Date.now()}` };
    updateSettings({ categories: [...settings.categories, newCategory] });
  };

  const updateCategory = (categoryId: string, updates: Partial<Omit<MenuCategory, 'id'>>) => {
    const updatedCategories = settings.categories.map(c =>
      c.id === categoryId ? { ...c, ...updates } : c
    );
    updateSettings({ categories: updatedCategories });
  };

  const removeCategory = (categoryId: string): boolean => {
    const storedItemsRaw = localStorage.getItem(MENU_ITEMS_STORAGE_KEY);
    const menuItems: OrderItem[] = storedItemsRaw ? JSON.parse(storedItemsRaw) : [];
    const isCategoryInUse = menuItems.some(item => item.category === categoryId);

    if (isCategoryInUse) {
      return false; // Indicate failure
    }

    const updatedCategories = settings.categories.filter(c => c.id !== categoryId);
    updateSettings({ categories: updatedCategories });
    return true; // Indicate success
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
        startBreak,
        endBreak,
        getTodaysTimeLogForCurrentUser,
        addPrinter,
        removePrinter,
        setDefaultPrinter,
        addUser,
        updateUser,
        removeUser,
        addTable,
        updateTable,
        removeTable,
        assignMockOrderToTable,
        clearMockOrderFromTable,
        addCategory,
        updateCategory,
        removeCategory,
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
