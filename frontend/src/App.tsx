import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { HabitDetailPage } from './pages/HabitDetailPage';
import { NotificationPanel } from './components/NotificationPanel';
import { useWebSocketContext } from './context/WebSocketContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, error } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { data: user } = useAuth();
  const { notifications, dismissNotification } = useWebSocketContext();

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits/:id"
          element={
            <ProtectedRoute>
              <HabitDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {user && (
        <NotificationPanel
          notifications={notifications}
          onDismiss={dismissNotification}
        />
      )}
    </>
  );
}

export function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <AppContent />
    </Suspense>
  );
}
