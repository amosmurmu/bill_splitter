import { useQuery } from '@tanstack/react-query'
import { getBalances } from './api'

export const balanceKeys = {
  all: (homeId: string) => ['balances', homeId] as const,
}

export function useBalances(homeId: string) {
  return useQuery({
    queryKey: balanceKeys.all(homeId),
    queryFn: () => getBalances(homeId),
  })
}
