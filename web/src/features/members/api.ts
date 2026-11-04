import { api } from '@/lib/api'

export interface Member {
  id: string
  homeId: string
  name: string
  position: number
}

export async function getMembers(homeId: string): Promise<Member[]> {
  const { data } = await api.get(`/homes/${homeId}/members`)
  return data
}

export async function createMember(homeId: string, name: string) {
  const { data } = await api.post(`/home/${homeId}/members`, { name })
  return data
}
