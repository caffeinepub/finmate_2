import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSetSpendingLimit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, limit }: { category: string; limit: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setSpendingLimit(category, limit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spendingLimits'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
