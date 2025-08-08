import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { SmartReminder } from './types';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
        console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

interface ReminderContextType {
    reminders: SmartReminder[];
    addReminders: (remindersToAdd: Omit<SmartReminder, 'id'>[]) => void;
    deleteReminder: (id: string) => void;
    notificationPermission: NotificationPermission;
    requestNotificationPermission: () => void;
}

export const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const useReminders = () => {
    const context = useContext(ReminderContext);
    if (!context) {
        throw new Error('useReminders must be used within a ReminderProvider');
    }
    return context;
};

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reminders, setReminders] = useLocalStorage<SmartReminder[]>('smartReminders', []);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const requestNotificationPermission = () => {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                setNotificationPermission(permission);
            });
        }
    };
    
    const addReminders = (remindersToAdd: Omit<SmartReminder, 'id'>[]) => {
        const newReminders = remindersToAdd.map(r => ({ ...r, id: Date.now().toString() + Math.random().toString() }));
        setReminders(prev => [...prev, ...newReminders].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    };

    const deleteReminder = useCallback((id: string) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    }, [setReminders]);

    useEffect(() => {
        const checkReminders = () => {
            if (notificationPermission !== 'granted') return;

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize to start of day

            const dueReminders = reminders.filter(r => {
                const dueDate = new Date(r.dueDate + 'T00:00:00'); // Ensure date is parsed correctly
                dueDate.setHours(0, 0, 0, 0);
                return dueDate.getTime() <= today.getTime();
            });

            dueReminders.forEach(reminder => {
                new Notification('Recordatorio de Estudio - Lumen AI', {
                    body: `${reminder.topic}: ${reminder.note}`,
                    icon: '/favicon.svg'
                });
                // Remove notified reminder
                deleteReminder(reminder.id);
            });
        };

        const intervalId = setInterval(checkReminders, 60000); // Check every minute
        
        // Initial check on load
        checkReminders();

        return () => clearInterval(intervalId);
    }, [reminders, notificationPermission, deleteReminder]);

    const value = { reminders, addReminders, deleteReminder, notificationPermission, requestNotificationPermission };

    return (
        <ReminderContext.Provider value={value}>
            {children}
        </ReminderContext.Provider>
    );
};