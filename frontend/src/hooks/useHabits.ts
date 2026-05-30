import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Habit } from '../types';
import { get } from '../lib/api';

interface UseHabitsOptions {
  status?: 'active' | 'paused' | 'archived';
  q?: string;
  completedToday?: boolean;
  enabled?: boolean;
}

export function useHabits(
  options: UseHabitsOptions = {}
): UseQueryResult<Habit[], Error> {
  const { status, q, completedToday, enabled = true } = options;

  return useQuery({
    queryKey: ['habits', { status, q, completedToday }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (q) params.append('q', q);
      if (completedToday !== undefined) params.append('completedToday', String(completedToday));

      const queryString = params.toString();
      const endpoint = queryString ? `/habits?${queryString}` : '/habits';

      return get<Habit[]>(endpoint);
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled,
  });
}

export function useHabit(habitId: string | undefined): UseQueryResult<Habit, Error> {
  return useQuery({
    queryKey: ['habits', habitId],
    queryFn: async () => {
      if (!habitId) throw new Error('Habit ID is required');
      return get<Habit>(`/habits/${habitId}`);
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!habitId,
  });
}
