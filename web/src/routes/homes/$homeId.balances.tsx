import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/homes/$homeId/balances')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/homes/$homeId/balances"!</div>
}
