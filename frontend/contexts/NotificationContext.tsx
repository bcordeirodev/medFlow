'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Alert, Snackbar, AlertColor } from '@mui/material';

export interface Notification {
  id: string;
  message: string;
  type: AlertColor;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (
    message: string,
    type?: AlertColor,
    duration?: number
  ) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (message: string, type: AlertColor = 'info', duration: number = 6000) => {
      const id = Math.random().toString(36).substring(7);
      const notification: Notification = {
        id,
        message,
        type,
        duration,
      };

      setNotifications(prev => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          hideNotification(id);
        }, duration);
      }
    },
    []
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showNotification(message, 'success');
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string) => {
      showNotification(message, 'error', 8000);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string) => {
      showNotification(message, 'warning');
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string) => {
      showNotification(message, 'info');
    },
    [showNotification]
  );

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map(notification => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration}
          onClose={() => hideNotification(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <Alert
            severity={notification.type}
            onClose={() => hideNotification(notification.id)}
            variant="filled"
            sx={{ minWidth: 300 }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
