'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ComposedImageSettings } from './types';

interface ComposeSettingsContextValue {
  settings: ComposedImageSettings;
  updateSettings: (settings: Partial<ComposedImageSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: ComposedImageSettings = {
  layout: 'horizontal',
  gap: 10,
  backgroundColor: '#ffffff',
  columns: 2,
  sizeMode: 'default',
};

const ComposeSettingsContext = createContext<ComposeSettingsContextValue | undefined>(undefined);

export const useComposeSettingsContext = () => {
  const context = useContext(ComposeSettingsContext);
  if (!context) {
    throw new Error('useComposeSettingsContext must be used within ComposeSettingsProvider');
  }
  return context;
};

interface ComposeSettingsProviderProps {
  children: ReactNode;
}

export const ComposeSettingsProvider: React.FC<ComposeSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<ComposedImageSettings>(defaultSettings);

  const updateSettings = useCallback((newSettings: Partial<ComposedImageSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const value: ComposeSettingsContextValue = {
    settings,
    updateSettings,
    resetSettings,
  };

  return (
    <ComposeSettingsContext.Provider value={value}>{children}</ComposeSettingsContext.Provider>
  );
};