import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['balance'],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.getCallerBalance();
    },
    enabled: !!actor && !isFetching,
  });
}
