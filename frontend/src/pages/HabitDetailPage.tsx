import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useHabit } from '../hooks/useHabits';
import { useCheckins } from '../hooks/useCheckin';
import { HabitModal } from '../components/HabitModal';
import { Calendar } from '../components/Calendar';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { queryClient } from '../lib/queryClient';

export const HabitDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));

  const { data: habit, isLoading: habitLoading, error: habitError } = useHabit(id);
  const { data: checkins = [], isLoading: checkinsLoading } = useCheckins(id, currentMonth);

  if (habitLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="mb-8 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (habitError || !habit) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="card-elevated p-8 text-center">
          <div className="text-red-600 text-lg font-semibold">Error loading habit</div>
          <p className="text-gray-600 mt-2">Please try going back to the dashboard</p>
        </div>
      </div>
    );
  }

  const checkinDates = new Set(checkins.map((c) => c.date));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{habit.name}</h1>
            {habit.description && (
              <p className="text-gray-600 mt-2">{habit.description}</p>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Edit
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8 bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">🔥</div>
            <p className="text-2xl font-bold text-gray-900">{habit.currentStreak || 0}</p>
            <p className="text-sm text-gray-600">Current Streak</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">⭐</div>
            <p className="text-2xl font-bold text-gray-900">{habit.bestStreak || 0}</p>
            <p className="text-sm text-gray-600">Best Streak</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">✓</div>
            <p className="text-2xl font-bold text-gray-900">{habit.totalCheckins || 0}</p>
            <p className="text-sm text-gray-600">Total Check-ins</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Check-in Calendar</h2>
          <Calendar
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            checkinDates={checkinDates}
            isLoading={checkinsLoading}
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <HabitModal
          habit={habit}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['habits', id] });
          }}
        />
      )}
    </div>
  );
};
