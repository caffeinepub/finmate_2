import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Transaction } from '../backend';

export function useGetTransactions(category?: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['transactions', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions(category || null);
    },
    enabled: !!actor && !isFetching,
  });
}
