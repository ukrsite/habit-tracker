import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';
import { queryClient } from '../lib/queryClient';
import { useAuth } from '../hooks/useAuth';
import { Habit } from '../types';
import { HabitModal } from '../components/HabitModal';
import { HabitCard } from '../components/HabitCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useCreateCheckin, useDeleteCheckin } from '../hooks/useCheckin';
import { useDeleteHabit } from '../hooks/useHabit';

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
  const deleteHabitMutation = useDeleteHabit();

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

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteHabitMutation.mutateAsync(habitId);
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    } catch (error) {
      alert('Failed to delete habit');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="card-elevated p-8 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Error loading habits</div>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
              My Habits
            </h1>
            {user && (
              <p className="text-sm text-gray-600 font-medium">
                👤 {user.displayName} • {user.provider === 'demo' ? 'Demo' : user.provider}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleOpenCreateModal}
              className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 font-semibold"
            >
              <span>+</span>
              <span>New Habit</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn-ghost-red flex-1 md:flex-none font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 animate-slide-in-down">
          <div className="relative">
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search habits..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="form-input w-full pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>
          <label className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all duration-200">
            <input
              type="checkbox"
              checked={completedTodayFilter}
              onChange={(e) => setCompletedTodayFilter(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Completed Today</span>
          </label>
        </div>

        {/* Habits Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : habits && habits.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchText || statusFilter || completedTodayFilter
                ? 'No habits found'
                : 'No habits yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchText || statusFilter || completedTodayFilter
                ? 'Try adjusting your search or filters'
                : 'Create your first habit to get started'}
            </p>
            {!(searchText || statusFilter || completedTodayFilter) && (
              <button
                onClick={handleOpenCreateModal}
                className="btn-primary inline-flex items-center gap-2 font-semibold"
              >
                <span>+</span>
                <span>Create First Habit</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits?.map((habit, index) => (
              <div
                key={habit.id}
                className="list-item"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <HabitCard
                  habit={habit}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteHabit}
                  onCheckinToggle={handleToggleCheckin}
                  isCheckinPending={togglePendingId === habit.id}
                />
              </div>
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
