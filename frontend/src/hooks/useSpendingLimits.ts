import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SpendingLimit } from '../backend';

export function useSpendingLimits() {
  const { actor, isFetching } = useActor();

  return useQuery<SpendingLimit[]>({
    queryKey: ['spendingLimits'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSpendingLimits();
    },
    enabled: !!actor && !isFetching,
  });
}
