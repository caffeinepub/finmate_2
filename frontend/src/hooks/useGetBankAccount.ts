import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetBankAccount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['bankAccount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBankAccount();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
