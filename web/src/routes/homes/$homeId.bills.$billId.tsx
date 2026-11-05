import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { MoveLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { billKeys, useBill } from '@/features/bills/queries'
import { payShare } from '@/features/payments/api'
import { formatMoney } from '@/utils/fmtMoney'

export const Route = createFileRoute('/homes/$homeId/bills/$billId')({
  component: BillDetailsPage,
})

function BillDetailsPage() {
  const { homeId, billId } = Route.useParams()
  console.log('Debug and bill detail page render', homeId)
  const queryClient = useQueryClient()
  const { data: bill, isLoading, isError } = useBill(homeId, billId)

  const payment = useMutation({
    mutationFn: ({ shareId, idempotencyKey }: { shareId: string; idempotencyKey: string }) =>
      payShare(billId, shareId, idempotencyKey),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billKeys.detail(homeId, billId) })
      queryClient.invalidateQueries({ queryKey: billKeys.all(homeId) })
      queryClient.invalidateQueries({ queryKey: ['balances', homeId] })
    },
  })

  if (isLoading) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 text-muted-foreground">
        Loading bill...
      </main>
    )
  }
  if (isError || !bill) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 text-destructive">
        Could not load this bill.
      </main>
    )
  }

  const paidCents = bill.shares
    .filter((share) => share.paidAt !== null)
    .reduce((sum, share) => sum + share.amountCents, 0)

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-6 px-6 py-12">
      <div>
        <Link
          to="/homes/$homeId/bills"
          params={{ homeId }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <MoveLeft className="size-4" /> All bills
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{bill.title}</h1>
        <p className="mt-1 text-muted-foreground">Total: {formatMoney(bill.totalCents)}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 text-card-foreground">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Payment progress</span>
          <span>
            {formatMoney(paidCents)} / {formatMoney(bill.totalCents)}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${bill.totalCents > 0 ? (paidCents / bill.totalCents) * 100 : 0}%` }}
          />
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Member shares</h2>

        {bill.shares.map((share) => (
          <div
            key={share.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground"
          >
            <div>
              <p className="font-medium">{share.memberName ?? share.memberId}</p>
              <p className="text-sm text-muted-foreground">{formatMoney(share.amountCents)}</p>
            </div>

            {share.paidAt ? (
              <span className="text-sm font-medium text-primary">Paid</span>
            ) : (
              <Button
                type="button"
                disabled={payment.isPending}
                onClick={() =>
                  payment.mutate({
                    shareId: share.id,
                    idempotencyKey: crypto.randomUUID(),
                  })
                }
                className="cursor-pointer"
              >
                Mark as paid
              </Button>
            )}
          </div>
        ))}

        {payment.isError && (
          <p className="text-sm text-destructive">Payment update failed. Refresh and try again.</p>
        )}
      </section>
    </main>
  )
}
