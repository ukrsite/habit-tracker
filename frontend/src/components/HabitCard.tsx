import { Link } from 'react-router-dom';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onCheckinToggle: (habitId: string) => void;
  isCheckinPending?: boolean;
}

export const HabitCard = ({ habit, onEdit, onCheckinToggle, isCheckinPending = false }: HabitCardProps) => {
  const isActive = habit.status === 'active';

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <Link to={`/habits/${habit.id}`} className="block mb-2">
        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">{habit.name}</h3>
        {habit.description && (
          <p className="text-sm text-gray-600">{habit.description}</p>
        )}
      </Link>

      <div className="flex items-start justify-between mb-2">
        <div />
        <button
          onClick={() => onEdit(habit)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Edit
        </button>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            habit.status === 'active'
              ? 'bg-green-100 text-green-800'
              : habit.status === 'paused'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {habit.status.charAt(0).toUpperCase() + habit.status.slice(1)}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div>
          <div className="text-2xl font-bold">🔥</div>
          <p className="text-xs text-gray-600">{habit.currentStreak || 0} day</p>
        </div>
        <div>
          <div className="text-2xl font-bold">⭐</div>
          <p className="text-xs text-gray-600">{habit.bestStreak || 0} day</p>
        </div>
        <div>
          <div className="text-2xl font-bold">{habit.totalCheckins || 0}</div>
          <p className="text-xs text-gray-600">checkins</p>
        </div>
      </div>

      {/* Check-in Button */}
      <button
        onClick={() => onCheckinToggle(habit.id)}
        disabled={!isActive || isCheckinPending}
        className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
          habit.completedToday
            ? 'bg-green-500 text-white hover:bg-green-600 disabled:opacity-50'
            : isActive
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isCheckinPending && <span className="animate-spin">⏳</span>}
        {habit.completedToday ? '✓ Done Today' : 'Check in Today'}
      </button>
    </div>
  );
};
