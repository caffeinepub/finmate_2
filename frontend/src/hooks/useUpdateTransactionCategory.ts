import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

interface UpdateCategoryParams {
  transactionIndex: number;
  newCategory: string;
}

export function useUpdateTransactionCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionIndex, newCategory }: UpdateCategoryParams) => {
      if (!actor) throw new Error('Actor not available');
      // Since the backend doesn't have a direct updateTransactionCategory method,
      // we fetch all transactions, update the one at the given index, and re-save
      // by adding a new transaction with updated category (workaround)
      // For now we store the override in localStorage
      const overrides = JSON.parse(localStorage.getItem('finmate-category-overrides') || '{}');
      overrides[transactionIndex] = newCategory;
      localStorage.setItem('finmate-category-overrides', JSON.stringify(overrides));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Category updated');
    },
    onError: () => {
      toast.error('Failed to update category');
    },
  });
}
