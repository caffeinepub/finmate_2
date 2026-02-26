import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Challenge } from '../backend';

export function useChallenges() {
  const { actor, isFetching } = useActor();

  return useQuery<Challenge[]>({
    queryKey: ['challenges'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChallenges();
    },
    enabled: !!actor && !isFetching,
  });
}
