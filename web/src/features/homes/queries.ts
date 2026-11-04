import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createHome, getHomes } from './api'

export const homeKeys = {
  all: ['homes'] as const,
}

export function useHomes() {
  return useQuery({
    queryKey: homeKeys.all,
    queryFn: getHomes,
  })
}

export function useCreateHome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createHome,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: homeKeys.all,
      })
    },
  })
}
