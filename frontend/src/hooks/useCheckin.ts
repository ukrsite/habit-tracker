import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { Checkin } from '../types';
import { get, post, del } from '../lib/api';
import { queryClient } from '../lib/queryClient';

export function useCheckins(
  habitId: string | undefined,
  month?: string
): UseQueryResult<Checkin[], Error> {
  return useQuery({
    queryKey: ['checkins', habitId, month],
    queryFn: async () => {
      if (!habitId) throw new Error('Habit ID is required');
      const endpoint = month
        ? `/habits/${habitId}/checkins?month=${month}`
        : `/habits/${habitId}/checkins`;
      return get<Checkin[]>(endpoint);
    },
    enabled: !!habitId,
  });
}

export function useCreateCheckin() {
  return useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
      return post<Checkin>(`/habits/${habitId}/checkins`, { date });
    },
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({ queryKey: ['checkins', habitId] });
      queryClient.invalidateQueries({ queryKey: ['habits', habitId] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

export function useDeleteCheckin() {
  return useMutation({
    mutationFn: async ({
      habitId,
      date,
    }: {
      habitId: string;
      date: string;
    }) => {
      return del(`/habits/${habitId}/checkins/${date}`);
    },
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({ queryKey: ['checkins', habitId] });
      queryClient.invalidateQueries({ queryKey: ['habits', habitId] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}
