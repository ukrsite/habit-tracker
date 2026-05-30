import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { User } from '../types';
import { get } from '../lib/api';

export function useAuth(): UseQueryResult<User | null, Error> {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const user = await get<User>('/auth/me');
        return user;
      } catch (error: any) {
        if (error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}
