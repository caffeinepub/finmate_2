import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useCompleteChallenge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeChallenge(challengeId);
    },
    onSuccess: () => {
      toast.success('Challenge completed! Points awarded.');
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
