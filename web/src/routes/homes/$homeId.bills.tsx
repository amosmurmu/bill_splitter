import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/homes/$homeId/bills')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/homes/$home/bills"!</div>
}
