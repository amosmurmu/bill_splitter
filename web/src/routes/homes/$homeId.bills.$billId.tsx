import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/homes/$homeId/bills/$billId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/homes/$homeId/bills/$billId"!</div>
}
