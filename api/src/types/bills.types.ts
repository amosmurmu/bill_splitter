type BillRow = {
  id: string
  home_id: string
  title: string
  total_cents: number
  share_id: string | null
  member_id: string | null
  member_name: string | null
  amount_cents: number | null
  paid_at: string | null
}

type BillResponse = {
  id: string
  homeId: string
  title: string
  totalCents: number
  shares: {
    id: string
    memberId: string
    memberName: string
    amountCents: number
    paidAt: string | null
  }[]
}

export type { BillResponse, BillRow }
