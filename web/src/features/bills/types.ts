export type BillShare = {
  id: string
  memberId: string
  memberName?: string
  amountCents: number
  paidAt: string | null
}

export type Bill = {
  id: string
  homeId: string
  title: string
  totalCents: number
  shares: BillShare[]
}
