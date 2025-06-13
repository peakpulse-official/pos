// src/contexts/SettingsContext.tsx
"use client"

import type { AppSettings, PrinterDevice, UserAccount } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addPrinter: (printer: Omit<PrinterDevice, 'id'>) => void;
  removePrinter: (printerId: string) => void;
  setDefaultPrinter: (printerId: string | null) => void;
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  updateUserRole: (userId: string, newRole: UserAccount['role']) => void;
  removeUser: (userId: string) => void;
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
        // Merge stored settings with defaults to ensure all keys are present
        const parsedSettings = JSON.parse(storedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
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
