
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useBill, billKeys } from '@/src/features/bills/queries'
import { payShare } from '@/src/features/payments/api'
import { formatMoney } from '@/src/utils/fmtMoney'
import { MoveLeft } from 'lucide-react'

export const Route = createFileRoute('/homes/$homeId/bills/$billId')({
  component: BillDetailsPage,
})

function BillDetailsPage() {
  const { homeId, billId } = Route.useParams()
  console.log("Debug and bill detail page render", homeId)
  const queryClient = useQueryClient()
  const { data: bill, isLoading, isError } = useBill(homeId, billId)

  const payment = useMutation({
    mutationFn: ({
      shareId,
      idempotencyKey,
    }: {
      shareId: string
      idempotencyKey: string
    }) => payShare(billId, shareId, idempotencyKey),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billKeys.detail(homeId, billId) })
      queryClient.invalidateQueries({ queryKey: billKeys.all(homeId) })
      queryClient.invalidateQueries({ queryKey: ['balances', homeId] })
    },
  })

  if (isLoading) return <main className="p-6">Loading bill...</main>
  if (isError || !bill) return <main className="p-6 text-red-600">Could not load this bill.</main>

  const paidCents = bill.shares
    .filter((share) => share.paidAt !== null)
    .reduce((sum, share) => sum + share.amountCents, 0)

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link to="/homes/$homeId/bills" params={{ homeId }} className="text-sm text-gray-500 hover:underline">
          <MoveLeft /> All bills
        </Link>
        <h1 className="mt-3 text-3xl font-bold">{bill.title}</h1>
        <p className="mt-1 text-gray-500">Total: {formatMoney(bill.totalCents)}</p>
      </div>

      <div className="rounded-xl border p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-500">Payment progress</span>
          <span>{formatMoney(paidCents)} / {formatMoney(bill.totalCents)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-green-600"
            style={{ width: `${bill.totalCents > 0 ? (paidCents / bill.totalCents) * 100 : 0}%` }}
          />
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Member shares</h2>

        {bill.shares.map((share) => (
          <div key={share.id} className="flex items-center justify-between gap-4 rounded-xl border p-4">
            <div>
              <p className="font-medium">{share.memberName ?? share.memberId}</p>
              <p className="text-sm text-gray-500">{formatMoney(share.amountCents)}</p>
            </div>

            {share.paidAt ? (
              <span className="text-sm font-medium text-green-700">Paid</span>
            ) : (
              <button
                disabled={payment.isPending}
                onClick={() =>
                  payment.mutate({
                    shareId: share.id,
                    idempotencyKey: crypto.randomUUID(),
                  })
                }
                className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                Mark as paid
              </button>
            )}
          </div>
        ))}

        {payment.isError && (
          <p className="text-sm text-red-600">Payment update failed. Refresh and try again.</p>
        )}
      </section>
    </main>
  )
}
