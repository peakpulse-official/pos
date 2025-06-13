// src/contexts/SettingsContext.tsx
"use client"

import type { AppSettings } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const LOCAL_STORAGE_KEY = 'annapurnaAppSettings';

const defaultSettings: AppSettings = {
  restaurantName: 'Annapurna POS',
  restaurantAddress: 'Kathmandu, Nepal',
  restaurantContact: '+977-1-4XXXXXX',
  vatRate: 0.13, // 13%
  serviceChargeRate: 0.10, // 10%
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
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
        setSettings(JSON.parse(storedSettings));
      } else {
        // If no settings stored, save default settings
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
      // Fallback to default and try to save them
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultSettings));
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prevSettings => {
      const updated = { ...prevSettings, ...newSettings };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
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
