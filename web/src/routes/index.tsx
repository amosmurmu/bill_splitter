import { createFileRoute, Link } from '@tanstack/react-router'
import { MoveRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCreateHome, useHomes } from '../features/homes/queries'

export const Route = createFileRoute('/')({
  component: HomesPage,
})

function HomesPage() {
  const [name, setName] = useState('')

  const { data: homes, isLoading, isError } = useHomes()
  const createHome = useCreateHome()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) return

    createHome.mutate(trimmedName, {
      onSuccess: () => setName(''),
    })
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <header className="mb-10">
        <p className="text-sm text-muted-foreground">BILL SPLITTER</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your homes</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your households and split shared expenses.
        </p>
      </header>

      <section className="mb-10 rounded-xl border p-6">
        <h2 className="text-lg font-medium">Create a home</h2>
        <p className="mt-1 text-sm text-muted-foreground">Start by creating a household.</p>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Flat 302"
            maxLength={100}
            className="h-10 min-w-0 flex-1 rounded-md border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          <Button
            type="submit"
            disabled={!name.trim() || createHome.isPending}
            className={`hover:cursor-pointer`}
          >
            {createHome.isPending ? 'Creating...' : 'Create home'}
          </Button>
        </form>

        {createHome.isError && (
          <p className="mt-3 text-sm text-destructive">Could not create home. Please try again.</p>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">All homes</h2>
          <span className="text-sm text-muted-foreground">{homes?.length ?? 0} homes</span>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading homes...</p>}

        {isError && (
          <p className="text-sm text-destructive">Could not load homes. Please refresh.</p>
        )}

        {homes?.length === 0 && (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <p className="font-medium">No homes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first home to get started.
            </p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {homes?.map((home) => (
            <Link
              key={home.id}
              to="/homes/$homeId"
              params={{ homeId: home.id }}
              className="group rounded-xl border p-5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{home.name}</h3>
                <span className="text-muted-foreground transition-transform group-hover:translate-x-1">
                  <MoveRight />
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">View members and expenses</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
