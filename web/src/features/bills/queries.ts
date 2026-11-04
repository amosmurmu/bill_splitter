import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBill, getBill, getBills } from './api'

export const billKeys = {
  all: (homeId: string) => ['bills', homeId] as const,
  detail: (homeId: string, billId: string) => ['bills', homeId, billId] as const,
}

export function useBills(homeId: string) {
  return useQuery({
    queryKey: billKeys.all(homeId),
    queryFn: () => getBills(homeId),
  })
}

export function useBill(homeId: string, billId: string) {
  return useQuery({
    queryKey: billKeys.detail(homeId, billId),
    queryFn: () => getBill(homeId, billId),
  })
}

export function useCreateBill(homeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { title: string; totalCents: number }) => createBill(homeId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billKeys.all(homeId),
      })
      queryClient.invalidateQueries({
        queryKey: ['balances', homeId],
      })
    },
  })
}
