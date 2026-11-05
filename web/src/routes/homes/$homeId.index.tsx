import { createFileRoute, Link } from '@tanstack/react-router'
import { MoveLeft } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateMember, useMembers } from '@/features/members/queries'

export const Route = createFileRoute('/homes/$homeId/')({
  component: MembersPage,
})

function MembersPage() {
  const { homeId } = Route.useParams()
  const [name, setName] = useState('')

  const { data: members, isLoading, isError } = useMembers(homeId)
  const createMember = useCreateMember()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) return

    createMember.mutate(
      { homeId, name: trimmedName },
      {
        onSuccess: () => setName(''),
      },
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <MoveLeft className="size-4" /> Back to homes
      </Link>
      <header className="mb-10 mt-6">
        <p className="text-sm text-muted-foreground">HOUSEHOLD</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Members</h1>
        <p className="mt-2 text-muted-foreground">
          Manage the people sharing expenses in this home.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/homes/$homeId/bills"
          params={{ homeId }}
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Bills
        </Link>
        <Link
          to="/homes/$homeId/expenses"
          params={{ homeId }}
          className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
        >
          Expenses
        </Link>
      </div>

      <section className="mb-10 rounded-xl border border-border bg-card p-6 text-card-foreground">
        <h2 className="text-lg font-medium">Add a member</h2>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Member name"
            maxLength={100}
            className="h-10 flex-1"
          />

          <Button type="submit" disabled={!name.trim() || createMember.isPending}>
            {createMember.isPending ? 'Adding...' : 'Add member'}
          </Button>
        </form>

        {createMember.isError && (
          <p className="mt-3 text-sm text-destructive">Could not add member. Please try again.</p>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">All members</h2>
          <span className="text-sm text-muted-foreground">{members?.length ?? 0} members</span>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading members...</p>}

        {isError && (
          <p className="text-sm text-destructive">Could not load members. Please refresh.</p>
        )}

        {members?.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="font-medium">No members yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add the people who share expenses in this home.
            </p>
          </div>
        )}

        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {members?.map((member) => (
            <div key={member.id} className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-accent font-medium text-accent-foreground">
                {member.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">Member {member.position + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
