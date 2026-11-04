import { api } from '@/lib/api'
import type { Bill } from './types'

export async function getBills(homeId: string) {
  const { data } = await api.get<Bill[]>(`/homes/${homeId}/bills`)
  return data
}

export async function getBill(homeId: string, billId: string) {
  const { data } = await api.get<Bill>(`/homes/${homeId}/bills/${billId}`)
  return data
}

export async function createBill(homeId: string, input: { title: string; totalCents: number }) {
  const { data } = await api.post<Bill>(`/homes/${homeId}/bills`, input)
  return data
}
