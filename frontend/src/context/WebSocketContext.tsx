import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../hooks/useAuth';
import { MilestoneMessage } from '../types';

interface Notification {
  id: string;
  habitId: string;
  habitName: string;
  milestoneDays: 3 | 7 | 30;
  currentStreak: number;
  timestamp: number;
}

interface WebSocketContextType {
  notifications: Notification[];
  dismissNotification: (habitId: string, milestoneDays: 3 | 7 | 30) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { data: user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleMilestone = useCallback((payload: MilestoneMessage['payload']) => {
    const notification: Notification = {
      id: `${payload.habitId}-${payload.milestoneDays}-${Date.now()}`,
      habitId: payload.habitId,
      habitName: payload.habitName,
      milestoneDays: payload.milestoneDays,
      currentStreak: payload.currentStreak,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [...prev, notification]);
  }, []);

  const { ack, isConnected } = useWebSocket({
    enabled: !!user,
    onMilestone: handleMilestone,
  });

  const dismissNotification = useCallback(
    (habitId: string, milestoneDays: 3 | 7 | 30) => {
      ack(habitId, milestoneDays);
      setNotifications((prev) =>
        prev.filter((n) => !(n.habitId === habitId && n.milestoneDays === milestoneDays))
      );
    },
    [ack]
  );

  return (
    <WebSocketContext.Provider value={{ notifications, dismissNotification, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
};
