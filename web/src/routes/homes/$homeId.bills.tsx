import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { MoveLeft } from 'lucide-react'
import { useState } from 'react'
import { useBills, useCreateBill } from '@/src/features/bills/queries'
import { formatMoney } from '@/src/utils/fmtMoney'

export const Route = createFileRoute('/homes/$homeId/bills')({
  component: BillsPage,
})

function BillsPage() {
  const { homeId } = Route.useParams()
  console.log('Bills page rendered:', homeId)
  const { data: bills, isLoading, isError } = useBills(homeId)
  const createBill = useCreateBill(homeId)

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const totalCents = Math.round(Number(amount) * 100)

    if (!title.trim() || !Number.isFinite(totalCents) || totalCents <= 0) {
      return
    }

    createBill.mutate(
      { title: title.trim(), totalCents },
      {
        onSuccess: () => {
          setTitle('')
          setAmount('')
        },
      },
    )
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6">
      <div>
        <Link
          to="/homes/$homeId"
          params={{ homeId }}
          className="text-sm text-gray-500 hover:underline"
        >
          <MoveLeft /> Members
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Bills</h1>
        <p className="mt-1 text-gray-500">Manage shared bills for this home.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Create a bill</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Electricity bill"
          required
          className="w-full rounded-lg border px-3 py-2"
        />

        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Total amount (₹)"
          required
          className="w-full rounded-lg border px-3 py-2"
        />

        <button
          type="submit"
          disabled={createBill.isPending}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {createBill.isPending ? 'Creating...' : 'Create bill'}
        </button>

        {createBill.isError && (
          <p className="text-sm text-red-600">Could not create bill. Please try again.</p>
        )}
      </form>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">All bills</h2>

        {isLoading && <p className="text-gray-500">Loading bills...</p>}
        {isError && <p className="text-red-600">Could not load bills.</p>}

        {bills?.length === 0 && (
          <p className="rounded-xl border p-5 text-gray-500">
            No bills yet. Create your first bill above.
          </p>
        )}

        {bills?.map((bill) => (
          <Link
            key={bill.id}
            to="/homes/$homeId/bills/$billId"
            params={{ homeId, billId: bill.id }}
            className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-gray-50"
          >
            <div>
              <h3 className="font-semibold">{bill.title}</h3>
              <p className="text-sm text-gray-500">{bill.shares.length} shares</p>
            </div>
            <span className="font-semibold">{formatMoney(bill.totalCents)}</span>
          </Link>
        ))}
      </section>

      <Outlet />
    </main>
  )
}
