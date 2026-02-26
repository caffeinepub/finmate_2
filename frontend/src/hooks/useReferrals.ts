import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Principal } from '@dfinity/principal';

export function useReferrals() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['referrals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReferrals();
    },
    enabled: !!actor && !isFetching,
  });
}
