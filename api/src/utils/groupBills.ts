import type { BillResponse, BillRow } from '../types/bills.types'

function groupBills(rows: BillRow[]): BillResponse[] {
  const grouped = new Map<string, BillResponse>()

  for (const row of rows) {
    if (!grouped.has(row.id)) {
      grouped.set(row.id, {
        id: row.id,
        homeId: row.home_id,
        title: row.title,
        totalCents: row.total_cents,
        shares: [],
      })
    }

    if (
      row.share_id !== null &&
      row.member_id !== null &&
      row.member_name !== null &&
      row.amount_cents !== null
    ) {
      const bill = grouped.get(row.id)
      if (bill) {
        bill.shares.push({
          id: row.share_id,
          memberId: row.member_id,
          memberName: row.member_name,
          amountCents: row.amount_cents,
          paidAt: row.paid_at,
        })
      }
    }
  }

  return Array.from(grouped.values())
}

export default groupBills
