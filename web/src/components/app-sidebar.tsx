
import {
  ArrowLeftRight,
  LayoutDashboard,
  Receipt,
  Users,
} from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type AppSidebarProps = {
  homeId: string
}

export function AppSidebar({ homeId }: AppSidebarProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const navigation = [
    {
      title: 'Overview',
      url: `/homes/${homeId}`,
      icon: LayoutDashboard,
    },
    {
      title: 'Bills',
      url: `/homes/${homeId}/bills`,
      icon: Receipt,
    },
    {
      title: 'Balances',
      url: `/homes/${homeId}/expenses`,
      icon: ArrowLeftRight,
    },
    {
      title: 'Members',
      url: `/homes/${homeId}/members`,
      icon: Users,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Receipt className="size-4" />
          </div>
          <span className="font-semibold tracking-tight">
            Bill Splitter
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Household</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive =
                  item.title === 'Overview'
                    ? pathname === item.url || pathname === `${item.url}/`
                    : pathname === item.url ||
                    pathname.startsWith(`${item.url}/`)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link to={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3 sm:p-4">
        <p className="text-xs text-muted-foreground">Household ID</p>
        <p className="truncate text-xs font-medium">{homeId}</p>
      </SidebarFooter>
    </Sidebar>
  )
}
