"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Gear, SignOut, MagnifyingGlass } from "@phosphor-icons/react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useGetPlayers } from "@/app/services/query"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { data, isLoading, error } = useGetPlayers()
  const [search, setSearch] = React.useState("")

  // 🔍 Search Logic
  const filteredPlayers = React.useMemo(() => {
    if (!data?.data) return []
    const q = search.trim().toLowerCase()
    if (!q) return data.data
    return data.data.filter((p) => p.name.toLowerCase().includes(q))
  }, [data, search])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.replace("/")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* --- HEADER: Branding --- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin" className="flex items-center gap-3">
                  <Image
                    src="/assets/logo.png"
                    alt="ZPL Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-sm">ZPL Admin</span>
                  <span className="truncate text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    Control Center
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* --- CONTENT: Navigation --- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2">Players</SidebarGroupLabel>

          {/* Search Input */}
          <div className="px-2 pb-2 group-data-[collapsible=icon]:hidden relative">
            <SidebarInput
              placeholder="Quick search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9 bg-sidebar-accent/30 border-none shadow-none"
            />
            <MagnifyingGlass className="absolute left-4 top-2 size-4 text-muted-foreground" />
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* 🔄 Loading Skeletons */}
              {isLoading && (
                <div className="px-2 py-2 space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-5 w-full animate-pulse rounded-md bg-sidebar-accent/50" />
                  ))}
                </div>
              )}

              {/* ❌ Error State */}
              {error && (
                <p className="px-4 py-2 text-[10px] text-destructive italic font-medium">
                  Failed to load rosters.
                </p>
              )}

              {/* ✅ Player List */}
              {!isLoading && filteredPlayers.map((player) => (
                <SidebarMenuItem key={player._id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/admin/players/${player._id}`}
                    tooltip={player.name}
                    className="h-11 transition-all"
                  >
                    <Link href={`/admin/players/${player._id}`}>
                      {/* Avatar Bubble */}
                      <div className="flex aspect-square size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sidebar-accent to-sidebar-border text-sidebar-accent-foreground text-[10px] font-bold shadow-sm">
                        {player.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-xs font-semibold">{player.name}</span>
                        <span className={[
                          "inline-flex w-fit items-center rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter shadow-sm",
                          player.status === "sold" ? "bg-emerald-500 text-white" :
                            player.status === "unsold" ? "bg-rose-500 text-white" :
                              "bg-amber-500 text-white"
                        ].join(" ")}>
                          {player.status}
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* 🔍 Empty Result State */}
              {!isLoading && filteredPlayers.length === 0 && search && (
                <p className="px-4 py-2 text-[10px] text-muted-foreground italic group-data-[collapsible=icon]:hidden">
                  No players match your search.
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* --- FOOTER: User & Actions --- */}
      <SidebarFooter>
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/settings"}>
              <Link href="/admin/settings">
                <div className="flex aspect-square size-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold">
                  AD
                </div>
                <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden pl-2">
                  <span className="truncate font-bold">Administrator</span>
                  <span className="truncate text-[10px] text-muted-foreground italic">admin@zpl.com</span>
                </div>
                <Gear size={16} className="ml-auto opacity-40 group-data-[collapsible=icon]:hidden" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <SignOut className="size-5 shrink-0" weight="bold" />
              <span className="text-xs font-bold pl-2 group-data-[collapsible=icon]:hidden uppercase tracking-wider">
                Log Out
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}