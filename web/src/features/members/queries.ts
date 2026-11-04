import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMember, getMembers } from './api'

export const memberKeys = {
  all: (homeId: string) => ['members', homeId] as const,
}

export function useMembers(homeId: string) {
  return useQuery({
    queryKey: memberKeys.all(homeId),
    queryFn: () => getMembers(homeId),
    enabled: !!homeId,
  })
}

export function useCreateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ homeId, name }: { homeId: string; name: string }) => createMember(homeId, name),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: memberKeys.all(variables.homeId),
      })
    },
  })
}
