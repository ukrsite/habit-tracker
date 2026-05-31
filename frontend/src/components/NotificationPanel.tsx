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
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg shadow-xl p-4 pointer-events-auto animate-slide-in"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎉</span>
                <p className="font-bold text-gray-900">Milestone reached!</p>
              </div>
              <p className="text-sm text-gray-700">
                Your habit <span className="font-semibold">'{notification.habitName}'</span> hit a{' '}
                <span className="inline-block bg-green-200 text-green-900 font-bold px-2 py-0.5 rounded ml-1">
                  {notification.milestoneDays}-day streak!
                </span>
              </p>
              <p className="text-xs text-gray-600 mt-2">
                🔥 {notification.currentStreak} days and counting
              </p>
            </div>
            <button
              onClick={() => {
                onDismiss(notification.habitId, notification.milestoneDays);
              }}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-1"
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
