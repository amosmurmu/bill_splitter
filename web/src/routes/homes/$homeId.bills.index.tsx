import { createFileRoute, Link } from '@tanstack/react-router'
import { MoveLeft } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBills, useCreateBill } from '@/features/bills/queries'
import { formatMoney } from '@/utils/fmtMoney'

export const Route = createFileRoute('/homes/$homeId/bills/')({
  component: BillsPage,
})

function BillsPage() {
  const { homeId } = Route.useParams()
  // console.log('Bills page rendered:', homeId)
  const { data: bills, isLoading, isError } = useBills(homeId)
  const createBill = useCreateBill(homeId)

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const rupees = Number(amount)

    if (
      !title.trim() ||
      !Number.isSafeInteger(rupees) ||
      rupees <= 0 ||
      !Number.isSafeInteger(rupees * 100)
    ) {
      return
    }

    const totalCents = rupees * 100

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
    <main className="mx-auto min-h-screen max-w-4xl space-y-8 px-6 py-12">
      <div>
        <Link
          to="/homes/$homeId"
          params={{ homeId }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <MoveLeft className="size-4" /> Overview
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Bills</h1>
        <p className="mt-1 text-muted-foreground">Manage shared bills for this home.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-xl border border-border bg-card p-6 text-card-foreground"
      >
        <h2 className="text-lg font-medium">Create a bill</h2>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Electricity bill"
          required
        />

        <Input
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => {
            const value = e.target.value

            if (!/^\d*$/.test(value)) return

            setAmount(value)
          }}
          placeholder="Total amount (₹)"
          required
        />

        <Button type="submit" disabled={createBill.isPending} className="cursor-pointer">
          {createBill.isPending ? 'Creating...' : 'Create bill'}
        </Button>

        {createBill.isError && (
          <p className="text-sm text-destructive">Could not create bill. Please try again.</p>
        )}
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">All bills</h2>

        {isLoading && <p className="text-sm text-muted-foreground">Loading bills...</p>}
        {isError && <p className="text-sm text-destructive">Could not load bills.</p>}

        {bills?.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-card/50 p-5 text-muted-foreground">
            No bills yet. Create your first bill above.
          </p>
        )}

        {bills?.map((bill) => (
          <Link
            key={bill.id}
            to="/homes/$homeId/bills/$billId"
            params={{ homeId, billId: bill.id }}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <div>
              <h3 className="font-medium">{bill.title}</h3>
              <p className="text-sm text-muted-foreground">{bill.shares.length} shares</p>
            </div>
            <span className="font-medium">{formatMoney(bill.totalCents)}</span>
          </Link>
        ))}
      </section>
    </main>
  )
}
