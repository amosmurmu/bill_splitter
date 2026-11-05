import { createFileRoute, Link } from '@tanstack/react-router'
import { useBalances } from '@/features/balances/queries'

export const Route = createFileRoute('/homes/$homeId/expenses')({
  component: ExpensesPage,
})

function formatMoney(cents: number) {
  return `₹${(cents / 100).toFixed(2)}`
}

function ExpensesPage() {
  const { homeId } = Route.useParams()
  const { data: balances, isLoading, isError } = useBalances(homeId)

  const totalOutstanding =
    balances?.reduce((sum, balance) => sum + balance.outstandingCents, 0) ?? 0

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-6 px-6 py-12">
      <div>
        <Link
          to="/homes/$homeId"
          params={{ homeId }}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Members
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Expenses</h1>
        <p className="mt-1 text-muted-foreground">Outstanding balances for this home.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 text-card-foreground">
        <p className="text-sm text-muted-foreground">Total outstanding</p>
        <p className="mt-1 text-3xl font-semibold">{formatMoney(totalOutstanding)}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Member balances</h2>

        {isLoading && <p className="text-sm text-muted-foreground">Loading expenses...</p>}
        {isError && <p className="text-sm text-destructive">Could not load expenses.</p>}

        {balances?.map((balance) => (
          <div
            key={balance.memberId}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-card-foreground"
          >
            <span className="font-medium">{balance.name}</span>
            <span
              className={
                balance.outstandingCents > 0
                  ? 'font-semibold text-chart-5'
                  : 'font-semibold text-primary'
              }
            >
              {formatMoney(balance.outstandingCents)}
            </span>
          </div>
        ))}

        {balances?.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-card/50 p-5 text-muted-foreground">
            No members found.
          </p>
        )}

        {balances?.length && totalOutstanding === 0 ? (
          <p className="text-sm text-primary">Everyone is settled up!</p>
        ) : null}
      </section>
    </main>
  )
}
