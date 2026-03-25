"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChartBar,
  Gear,
  House,
  Package,
  ShoppingCart,
  Users,
  SignOut,
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
import Image from "next/image"

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
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.replace("/")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <Image
                  src="/assets/logo.png"
                  alt="ZPL Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
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
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton 
              size="lg" 
              onClick={handleLogout}
              className="hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            >
              <SignOut className="size-5 shrink-0" />
              <div className="flex flex-col gap-0.5 leading-none pl-2">
                <span className="text-sm font-medium">Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
