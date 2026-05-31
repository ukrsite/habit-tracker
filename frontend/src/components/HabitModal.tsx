import { useState, useEffect } from 'react';
import { Habit } from '../types';
import { useCreateHabit, useUpdateHabit } from '../hooks/useHabits';

interface HabitModalProps {
  habit?: Habit | null;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  active: ['active', 'paused', 'archived'],
  paused: ['active', 'paused', 'archived'],
  archived: ['archived'],
};

export const HabitModal = ({ habit, onClose, onSuccess }: HabitModalProps) => {
  const isCreate = !habit;
  const createMutation = useCreateHabit();
  const updateMutation = useUpdateHabit();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'paused' | 'archived',
  });

  const [error, setError] = useState<string>('');

  // Pre-fill form if editing
  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description || '',
        startDate: habit.startDate,
        status: habit.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
      });
    }
    setError('');
  }, [habit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!formData.name.trim()) {
      setError('Habit name is required');
      return;
    }

    try {
      if (isCreate) {
        await createMutation.mutateAsync({
          name: formData.name,
          description: formData.description || undefined,
          startDate: formData.startDate,
          status: formData.status,
        });
      } else {
        await updateMutation.mutateAsync({
          habitId: habit!.id,
          body: {
            name: formData.name,
            description: formData.description || undefined,
            status: formData.status,
          },
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const availableStatuses = STATUS_TRANSITIONS[formData.status] || ['active'];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isCreate ? 'Create Habit' : 'Edit Habit'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Morning Run"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>

          {/* Start Date */}
          {isCreate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isPending}
              />
            </div>
          )}

          {/* Status */}
          {!isCreate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              {formData.status === 'archived' ? (
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
                  Archived (cannot change)
                </div>
              ) : (
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'active' | 'paused' | 'archived',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isPending}
                >
                  {availableStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Error */}
          {error && <div className="text-red-600 text-sm">{error}</div>}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isPending}
            >
              {isPending && <span className="animate-spin">⏳</span>}
              {isCreate ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
