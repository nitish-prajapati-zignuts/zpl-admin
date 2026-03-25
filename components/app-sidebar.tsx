"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChartBar,
  Gear,
  House,
  Package,
  ShoppingCart,
  Users,
} from "@phosphor-icons/react"

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
  SidebarRail,
} from "@/components/ui/sidebar"

const navMain = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/admin", icon: House },
      { title: "Analytics", url: "/admin/analytics", icon: ChartBar },
      { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Users", url: "/admin/users", icon: Users },
      { title: "Products", url: "/admin/products", icon: Package },
      { title: "Settings", url: "/admin/settings", icon: Gear },
    ],
  },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-none bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
                  Z
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-xs">ZPL Admin</span>
                  <span className="text-xs text-sidebar-foreground/60">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navMain.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.url)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/settings">
                <div className="flex aspect-square size-8 items-center justify-center rounded-none bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
                  AD
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-xs font-medium">Admin User</span>
                  <span className="text-xs text-sidebar-foreground/60">admin@zpl.com</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
