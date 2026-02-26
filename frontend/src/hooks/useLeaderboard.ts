import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { LeaderboardEntry } from '../backend';

export function useLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}
