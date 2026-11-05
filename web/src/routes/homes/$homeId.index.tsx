import { createFileRoute } from '@tanstack/react-router'
import { ArrowDownLeft, ArrowUpRight, Receipt, Users } from 'lucide-react'

export const Route = createFileRoute('/homes/$homeId/')({
  component: OverviewPage,
})

function OverviewPage() {
  const { homeId } = Route.useParams()

  const stats = [
    {
      label: 'Total bills',
      value: '₹12,450',
      icon: Receipt,
      description: 'Across all household bills',
    },
    {
      label: 'Members',
      value: '4',
      icon: Users,
      description: 'People in this household',
    },
    {
      label: 'You owe',
      value: '₹1,250',
      icon: ArrowUpRight,
      description: 'Your pending payments',
    },
    {
      label: 'You are owed',
      value: '₹3,400',
      icon: ArrowDownLeft,
      description: 'Pending from other members',
    },
  ]

  const recentBills = [
    {
      title: 'Monthly groceries',
      date: 'Nov 04, 2026',
      amount: '₹3,200',
      status: 'Partially paid',
    },
    { title: 'Electricity bill', date: 'Nov 02, 2026', amount: '₹1,850', status: 'Paid' },
    { title: 'Internet bill', date: 'Oct 29, 2026', amount: '₹999', status: 'Paid' },
  ]

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-muted-foreground">HOUSEHOLD OVERVIEW</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Here's what's happening with your household.
        </p>
      </header>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div key={stat.label} className="rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Icon className="size-4 text-muted-foreground" />
              </div>

              <p className="mt-4 text-2xl font-semibold tracking-tight">{stat.value}</p>

              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </div>
          )
        })}
      </section>

      {/* Recent bills */}
      <section className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-semibold">Recent bills</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest bills added to this household.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">3 recent</span>
        </div>

        <div className="divide-y">
          {recentBills.map((bill) => (
            <div
              key={bill.title}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium">{bill.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{bill.date}</p>
              </div>

              <div className="flex items-center gap-5">
                <span className="text-sm font-medium">{bill.amount}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    bill.status === 'Paid'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}
                >
                  {bill.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Temporary route info */}
      <p className="text-xs text-muted-foreground">Household ID: {homeId}</p>
    </div>
  )
}
