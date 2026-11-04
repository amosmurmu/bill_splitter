import { api } from '@/lib/api'

export async function payShare(
  billId: string,
  shareId: string,
  idempotencyKey: string
) {
  const { data } = await api.post(
    `/bills/${billId}/shares/${shareId}/pay`,
    {},
    {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    }
  )
  return data
}
