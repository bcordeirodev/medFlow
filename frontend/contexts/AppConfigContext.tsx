'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

export interface AppConfig {
  theme: 'light' | 'dark';
  language: 'pt-BR' | 'en-US';
  itemsPerPage: number;
  autoSave: boolean;
  notifications: {
    desktop: boolean;
    email: boolean;
    sound: boolean;
  };
  accessibility: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
  };
}

interface AppConfigContextType {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  resetConfig: () => void;
  toggleTheme: () => void;
  updateItemsPerPage: (itemsPerPage: number) => void;
  updateNotificationSettings: (
    notifications: Partial<AppConfig['notifications']>
  ) => void;
  updateAccessibilitySettings: (
    accessibility: Partial<AppConfig['accessibility']>
  ) => void;
}

const defaultConfig: AppConfig = {
  theme: 'dark',
  language: 'pt-BR',
  itemsPerPage: 10,
  autoSave: true,
  notifications: {
    desktop: true,
    email: false,
    sound: true,
  },
  accessibility: {
    highContrast: false,
    fontSize: 'medium',
    reducedMotion: false,
  },
};

const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined
);

interface AppConfigProviderProps {
  children: ReactNode;
}

export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
  const [config, setConfig] = useState<AppConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medflow-config');
      if (saved) {
        try {
          return { ...defaultConfig, ...JSON.parse(saved) };
        } catch (error) {
          console.warn('Error parsing saved config:', error);
        }
      }
    }
    return defaultConfig;
  });

  const saveConfig = useCallback((newConfig: AppConfig) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medflow-config', JSON.stringify(newConfig));
    }
  }, []);

  const updateConfig = useCallback(
    (updates: Partial<AppConfig>) => {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      saveConfig(newConfig);
    },
    [config, saveConfig]
  );

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    saveConfig(defaultConfig);
  }, [saveConfig]);

  const toggleTheme = useCallback(() => {
    const newTheme = config.theme === 'dark' ? 'light' : 'dark';
    updateConfig({ theme: newTheme });
  }, [config.theme, updateConfig]);

  const updateItemsPerPage = useCallback(
    (itemsPerPage: number) => {
      updateConfig({ itemsPerPage });
    },
    [updateConfig]
  );

  const updateNotificationSettings = useCallback(
    (notifications: Partial<AppConfig['notifications']>) => {
      updateConfig({
        notifications: { ...config.notifications, ...notifications },
      });
    },
    [config.notifications, updateConfig]
  );

  const updateAccessibilitySettings = useCallback(
    (accessibility: Partial<AppConfig['accessibility']>) => {
      updateConfig({
        accessibility: { ...config.accessibility, ...accessibility },
      });
    },
    [config.accessibility, updateConfig]
  );

  const value: AppConfigContextType = {
    config,
    updateConfig,
    resetConfig,
    toggleTheme,
    updateItemsPerPage,
    updateNotificationSettings,
    updateAccessibilitySettings,
  };

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
};
