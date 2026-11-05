import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export const Route = createFileRoute('/homes/$homeId')({
  component: HomeLayout,
})

function HomeLayout() {
  const { homeId } = Route.useParams()

  return (
    <SidebarProvider>
      <AppSidebar homeId={homeId} />

      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4 md:hidden">
          <SidebarTrigger />
          <span className="font-semibold">Bill Splitter</span>
        </header>

        <main className="min-h-screen min-w-0 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
