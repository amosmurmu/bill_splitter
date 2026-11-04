import { api } from '@/lib/api'
import type { Balance } from './types'

export async function getBalances(homeId: string) {
  const { data } = await api.get<{ balances: Balance[] }>(`/homes/${homeId}/balances`)
  return data.balances
}
