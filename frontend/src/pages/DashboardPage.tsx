import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';
import { queryClient } from '../lib/queryClient';
import { useAuth } from '../hooks/useAuth';
import { Habit } from '../types';
import { HabitModal } from '../components/HabitModal';
import { HabitCard } from '../components/HabitCard';
import { useCreateCheckin, useDeleteCheckin } from '../hooks/useCheckin';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [completedTodayFilter, setCompletedTodayFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [togglePendingId, setTogglePendingId] = useState<string | null>(null);

  const createCheckinMutation = useCreateCheckin();
  const deleteCheckinMutation = useDeleteCheckin();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      queryClient.clear();
      navigate('/login');
    } catch (error) {
      alert('Logout failed');
    }
  };

  // Fetch habits
  const { data: habits = [], isLoading, error } = useQuery({
    queryKey: ['habits', { searchText, statusFilter, completedTodayFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchText) params.append('q', searchText);
      if (completedTodayFilter) params.append('completedToday', 'true');

      const query = params.toString();
      const url = query ? `/habits?${query}` : '/habits';
      return get<Habit[]>(url);
    },
  });

  const handleToggleCheckin = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find((h) => h.id === habitId);

    if (!habit) return;

    setTogglePendingId(habitId);
    try {
      if (habit.completedToday) {
        await deleteCheckinMutation.mutateAsync({ habitId, date: today });
      } else {
        await createCheckinMutation.mutateAsync({ habitId, date: today });
      }
    } finally {
      setTogglePendingId(null);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const handleModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['habits'] });
  };

  if (isLoading) {
    return <div className="p-8">Loading habits...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error loading habits</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
            {user && (
              <p className="text-sm text-gray-600 mt-1">
                👤 {user.displayName} ({user.provider === 'demo' ? 'Demo' : user.provider})
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              + New Habit
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search habits..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={completedTodayFilter}
              onChange={(e) => setCompletedTodayFilter(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Completed Today</span>
          </label>
        </div>

        {/* Habits List */}
        {habits && habits.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No habits yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits?.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={handleOpenEditModal}
                onCheckinToggle={handleToggleCheckin}
                isCheckinPending={togglePendingId === habit.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <HabitModal
          habit={editingHabit}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};
