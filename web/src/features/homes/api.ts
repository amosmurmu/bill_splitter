import { api } from '@/lib/api'

export interface Home {
  id: string
  name: string
}

export async function getHomes(): Promise<Home[]> {
  const { data } = await api.get('/homes')
  return data
}

export async function createHome(name: string): Promise<Home> {
  const { data } = await api.post('/homes', { name })
  return data
}
