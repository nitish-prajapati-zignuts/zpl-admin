"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Gear, ArrowRight } from "@phosphor-icons/react"
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
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"

import {useGetPlayers} from "@/app/services/query"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data, isLoading, error } = useGetPlayers()
  const [search, setSearch] = React.useState("")

  const filteredPlayers = React.useMemo(() => {
    if (!data?.data) return []
    const q = search.trim().toLowerCase()
    if (!q) return data.data
    return data.data.filter((p) => p.name.toLowerCase().includes(q))
  }, [data, search])
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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-bold">
                  Z
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ZPL Admin</span>
                  <span className="truncate text-xs text-muted-foreground">Dashboard</span>
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

      {/* --- CONTENT: Navigation --- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Players</SidebarGroupLabel>
          <SidebarGroupAction asChild title="View all players">

          </SidebarGroupAction>
          <div className="px-2 pb-1 group-data-[collapsible=icon]:hidden">
            <SidebarInput
              placeholder="Search players…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 🔄 Loading State */}
              {isLoading && (
                <div className="px-2 py-2 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 w-full animate-pulse rounded bg-sidebar-accent/50" />
                  ))}
                </div>
              )}

              {/* ❌ Error State */}
              {error && (
                <p className="px-4 py-2 text-[10px] text-destructive italic">
                  Failed to load roster.
                </p>
              )}

              {/* ✅ Player List */}
              {!isLoading && filteredPlayers.map((player) => (
                <SidebarMenuItem key={player._id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/admin/players/${player._id}`}
                    tooltip={player.name}
                    size="lg"
                    className="h-auto py-1.5"
                  >
                    <Link href={`/admin/players/${player._id}`}>
                      {/* Avatar */}
                      <div className="flex aspect-square size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-[11px] font-semibold uppercase">
                        {player.name.charAt(0)}
                      </div>
                      {/* Name + status */}
                      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-xs font-medium leading-none">{player.name}</span>
                        <span className={[
                          "inline-flex w-fit items-center rounded-sm px-1 py-px text-[9px] font-medium leading-none",
                          player.status === "sold"
                            ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : player.status === "unsold"
                              ? "bg-red-500/15 text-red-600 dark:text-red-400"
                              : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
                        ].join(" ")}>
                          {player.status}
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* 🔍 No results */}
              {!isLoading && !error && filteredPlayers.length === 0 && search && (
                <p className="px-4 py-2 text-[10px] text-muted-foreground italic group-data-[collapsible=icon]:hidden">
                  No players found.
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* --- FOOTER: User Profile --- */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild isActive={pathname === "/admin/settings"}>
              <Link href="/admin/settings">
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-accent border border-sidebar-border text-xs font-medium">
                  AD
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Admin User</span>
                  <span className="truncate text-xs text-muted-foreground">admin@zpl.com</span>
                </div>
                <Gear size={16} className="ml-auto opacity-50" />
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