import { createFileRoute, Link } from '@tanstack/react-router'
import { useBalances } from '@/src/features/balances/queries'

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
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link
          to="/homes/$homeId"
          params={{ homeId }}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Members
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Expenses</h1>
        <p className="mt-1 text-gray-500">Outstanding balances for this home.</p>
      </div>

      <div className="rounded-xl border p-5">
        <p className="text-sm text-gray-500">Total outstanding</p>
        <p className="mt-1 text-3xl font-bold">{formatMoney(totalOutstanding)}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Member balances</h2>

        {isLoading && <p className="text-gray-500">Loading expenses...</p>}
        {isError && <p className="text-red-600">Could not load expenses.</p>}

        {balances?.map((balance) => (
          <div
            key={balance.memberId}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <span className="font-medium">{balance.name}</span>
            <span
              className={
                balance.outstandingCents > 0
                  ? 'font-semibold text-orange-600'
                  : 'font-semibold text-green-700'
              }
            >
              {formatMoney(balance.outstandingCents)}
            </span>
          </div>
        ))}

        {balances?.length === 0 && (
          <p className="rounded-xl border p-5 text-gray-500">No members found.</p>
        )}

        {balances?.length && totalOutstanding === 0 ? (
          <p className="text-sm text-green-700">Everyone is settled up!</p>
        ) : null}
      </section>
    </main>
  )
}
