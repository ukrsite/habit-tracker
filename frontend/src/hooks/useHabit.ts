import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export const useDeleteHabit = () => {
  return useMutation({
    mutationFn: async (habitId: string) => {
      const response = await apiClient.delete(`/habits/${habitId}`);
      return response;
    },
  });
};
