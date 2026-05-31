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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
    setErrors({});
    setTouched({});
  }, [habit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Habit name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Habit name must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
      setErrors({ submit: err instanceof Error ? err.message : 'Something went wrong' });
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      validateForm();
    }
  };

  const availableStatuses = STATUS_TRANSITIONS[formData.status] || ['active'];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="card-elevated w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {isCreate ? '✨ Create Habit' : '✏️ Edit Habit'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Habit Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g., Morning Run"
              className={`form-input w-full ${
                touched.name && errors.name ? 'form-input-error' : ''
              }`}
              disabled={isPending}
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="Optional description"
              rows={3}
              className={`form-input w-full resize-none ${
                touched.description && errors.description ? 'form-input-error' : ''
              }`}
              disabled={isPending}
            />
            {touched.description && errors.description && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Start Date Field */}
          {isCreate && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="form-input w-full"
                disabled={isPending}
              />
            </div>
          )}

          {/* Status Field */}
          {isCreate && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as 'active' | 'paused' | 'archived' })
                }
                className="form-input w-full"
                disabled={isPending}
              >
                {availableStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Edit: Status Field */}
          {!isCreate && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as 'active' | 'paused' | 'archived' })
                }
                className="form-input w-full"
                disabled={isPending}
              >
                {availableStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              {formData.status === 'archived' && (
                <p className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg font-medium">
                  ⚠️ Archived habits cannot receive new check-ins.
                </p>
              )}
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 font-semibold"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2 font-semibold"
              disabled={isPending}
            >
              {isPending && <span className="animate-spin">⏳</span>}
              {isCreate ? '✨ Create' : '💾 Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
