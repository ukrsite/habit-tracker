import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  habitId: string;
  habitName: string;
  milestoneDays: 3 | 7 | 30;
  currentStreak: number;
  timestamp: number;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onDismiss: (habitId: string, milestoneDays: 3 | 7 | 30) => void;
}

export const NotificationPanel = ({ notifications, onDismiss }: NotificationPanelProps) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);

    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        const lastNotification = notifications[notifications.length - 1];
        onDismiss(lastNotification.habitId, lastNotification.milestoneDays);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, onDismiss]);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Your <span className="font-semibold">'{notification.habitName}'</span> habit reached a{' '}
                <span className="inline-flex items-center gap-1">
                  <span className="font-semibold text-amber-600">{notification.milestoneDays}-day</span>
                  <span>streak!</span>
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Current streak: {notification.currentStreak} days 🔥
              </p>
            </div>
            <button
              onClick={() => {
                onDismiss(notification.habitId, notification.milestoneDays);
                setVisibleNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id)
                );
              }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss notification"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
