import { Link } from 'react-router-dom';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onCheckinToggle: (habitId: string) => void;
  isCheckinPending?: boolean;
}

export const HabitCard = ({ habit, onEdit, onDelete, onCheckinToggle, isCheckinPending = false }: HabitCardProps) => {
  const isActive = habit.status === 'active';

  const statusConfig = {
    active: { badge: 'badge-success', label: 'Active' },
    paused: { badge: 'badge-warning', label: 'Paused' },
    archived: { badge: 'badge-muted', label: 'Archived' },
  };

  const config = statusConfig[habit.status as keyof typeof statusConfig] || statusConfig.active;

  return (
    <Link to={`/habits/${habit.id}`}>
      <div className="card p-6 h-full hover:shadow-lg hover:border-blue-200 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {habit.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 min-h-[1.25rem] truncate">
              {habit.description || <span className="text-gray-400 italic">No description</span>}
            </p>
          </div>
          {/* Badge */}
          <div className={`badge ${config.badge} ml-2 flex-shrink-0`}>
            {config.label}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-2xl mb-1">🔥</div>
            <p className="text-xs font-bold text-gray-900">{habit.currentStreak || 0}</p>
            <p className="text-xs text-gray-600 font-medium">day</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⭐</div>
            <p className="text-xs font-bold text-gray-900">{habit.bestStreak || 0}</p>
            <p className="text-xs text-gray-600 font-medium">day</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">#</div>
            <p className="text-xs font-bold text-gray-900">{habit.totalCheckins || 0}</p>
            <p className="text-xs text-gray-600 font-medium">checkins</p>
          </div>
        </div>

        {/* Check-in Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCheckinToggle(habit.id);
          }}
          disabled={!isActive || isCheckinPending}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 mb-4 ${
            habit.completedToday
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
              : isActive
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isCheckinPending && <span className="animate-spin text-lg">⏳</span>}
          {habit.completedToday ? (
            <>
              <span>✓</span>
              <span>Done Today</span>
            </>
          ) : (
            <>
              <span>📍</span>
              <span>Check in Today</span>
            </>
          )}
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(habit);
            }}
            className="btn-ghost flex-1 text-center font-medium text-sm"
          >
            ✏️ Edit
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm(`Delete habit "${habit.name}"?\n\nThis will permanently remove all check-in history.`)) {
                onDelete(habit.id);
              }
            }}
            className="btn-ghost-red flex-1 text-center font-medium text-sm"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </Link>
  );
};
