"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { SignOut, MagnifyingGlass, CaretDown, CaretRight } from "@phosphor-icons/react"

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

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { useGetPlayers } from "@/app/services/query"
import { Player } from "@/app/types/types"

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_ORDER = ["on_block", "pending", "sold", "unsold"] as const
type Status = (typeof STATUS_ORDER)[number]

const GRADE_ORDER = ["A", "B", "C", "D"] as const
type Grade = (typeof GRADE_ORDER)[number]

const STATUS_CONFIG: Record<Status, { label: string; dot: string }> = {
  on_block: { label: "On Block", dot: "bg-amber-400" },
  pending: { label: "Pending", dot: "bg-sky-400" },
  sold: { label: "Sold", dot: "bg-emerald-500" },
  unsold: { label: "Unsold", dot: "bg-rose-500" },
}

const GRADE_CONFIG: Record<Grade, { active: string; inactive: string }> = {
  A: {
    active: "bg-violet-500 text-white border-violet-500",
    inactive: "bg-transparent text-violet-600 border-violet-300 hover:bg-violet-50",
  },
  B: {
    active: "bg-blue-500 text-white border-blue-500",
    inactive: "bg-transparent text-blue-600 border-blue-300 hover:bg-blue-50",
  },
  C: {
    active: "bg-slate-500 text-white border-slate-500",
    inactive: "bg-transparent text-slate-500 border-slate-300 hover:bg-slate-50",
  },
  D: {
    active: "bg-orange-500 text-white border-orange-500",
    inactive: "bg-transparent text-orange-600 border-orange-300 hover:bg-orange-50",
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { data, isLoading, error } = useGetPlayers()
  const [search, setSearch] = React.useState("")



  // Which status sections are expanded
  const [openStatus, setOpenStatus] = React.useState<Record<string, boolean>>({
    on_block: true,
  })

  // Per-status active grade filter; null = show all
  const [gradeFilter, setGradeFilter] = React.useState<Record<string, Grade | null>>({})

  const toggleStatus = (status: string) =>
    setOpenStatus((prev) => ({ ...prev, [status]: !prev[status] }))

  const toggleGradeFilter = (status: string, grade: Grade) =>
    setGradeFilter((prev) => ({
      ...prev,
      [status]: prev[status] === grade ? null : grade,
    }))

  // ── Build grouped data: status → grade → players ─────────────────────────
  const groupedPlayers = React.useMemo(() => {

    if (!data?.data) return {} as Record<Status, Record<Grade, Player[]>>

    const list = data.data.filter((p) => p.isAuctionable === true)
    const q = search.trim().toLowerCase()
    const filtered = q ? list.filter((p) => p.name.toLowerCase().includes(q)) : list

    const result = {} as Record<Status, Record<Grade, typeof filtered>>

    STATUS_ORDER.forEach((status) => {
      const byStatus = filtered.filter((p) => p.status === status)
      if (byStatus.length === 0) return

      const gradeMap = {} as Record<Grade, typeof filtered>
      GRADE_ORDER.forEach((grade) => {
        const byGrade = byStatus
          .filter((p) => p.grade === grade)
          .sort((a, b) => a.name.localeCompare(b.name))
        if (byGrade.length > 0) gradeMap[grade] = byGrade
      })

      if (Object.keys(gradeMap).length > 0) result[status] = gradeMap
    })

    return result
  }, [data, search])

  const hasResults = Object.keys(groupedPlayers).length > 0

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.replace("/")
  }

  return (
    <Sidebar collapsible="icon" {...props}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
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

      {/* ── CONTENT ─────────────────────────────────────────────────────────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2">Players</SidebarGroupLabel>

          {/* Search */}
          <div className="px-2 pb-2 group-data-[collapsible=icon]:hidden relative">
            <SidebarInput
              placeholder="Quick search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9 bg-sidebar-accent/30 border-none shadow-none"
            />
            <MagnifyingGlass className="absolute left-4 top-2.5 size-4 text-muted-foreground" />
          </div>

          <SidebarGroupContent>

            {/* Loading skeletons */}
            {isLoading && (
              <div className="px-2 py-2 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-5 w-full animate-pulse rounded-md bg-sidebar-accent/50" />
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="px-4 py-2 text-[10px] text-destructive italic font-medium">
                Failed to load rosters.
              </p>
            )}

            {/* Empty search */}
            {!isLoading && !hasResults && search && (
              <p className="px-4 py-2 text-[10px] text-muted-foreground italic group-data-[collapsible=icon]:hidden">
                No players match your search.
              </p>
            )}

            {/* ── Status Collapsible Groups ──────────────────────────────── */}
            {!isLoading && hasResults && (
              <div className="space-y-0.5">
                {(Object.entries(groupedPlayers) as [Status, Record<Grade, any[]>][]).map(
                  ([status, gradeMap]) => {
                    const config = STATUS_CONFIG[status]
                    const isOpen = !!openStatus[status]
                    const activeGrade = gradeFilter[status] ?? null
                    const availGrades = Object.keys(gradeMap) as Grade[]
                    const totalCount = Object.values(gradeMap).flat().length

                    // Players to show: filtered by active grade pill or all
                    const visiblePlayers = activeGrade
                      ? (gradeMap[activeGrade] ?? [])
                      : Object.values(gradeMap).flat()

                    return (
                      <Collapsible
                        key={status}
                        open={isOpen}
                        onOpenChange={() => toggleStatus(status)}
                      >
                        {/* ── Section Header ── */}
                        <CollapsibleTrigger asChild>
                          <button className="group-data-[collapsible=icon]:hidden flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:bg-sidebar-accent/40 transition-colors">
                            <span className={`size-2 rounded-full shrink-0 ${config.dot}`} />
                            <span className="flex-1 text-left">{config.label}</span>
                            <span className="rounded-full bg-sidebar-accent/60 px-1.5 py-0.5 text-[9px] font-bold tabular-nums">
                              {totalCount}
                            </span>
                            {isOpen
                              ? <CaretDown size={12} className="shrink-0 opacity-50" />
                              : <CaretRight size={12} className="shrink-0 opacity-50" />
                            }
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          {/* ── Grade Filter Pills ── */}
                          {availGrades.length > 1 && (
                            <div className="group-data-[collapsible=icon]:hidden flex flex-wrap gap-1 px-3 pt-1.5 pb-1">
                              {/* "All" pill */}
                              <button
                                onClick={() =>
                                  setGradeFilter((prev) => ({ ...prev, [status]: null }))
                                }
                                className={[
                                  "rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide transition-colors",
                                  activeGrade === null
                                    ? "bg-sidebar-foreground text-sidebar border-sidebar-foreground"
                                    : "bg-transparent text-muted-foreground border-sidebar-border hover:bg-sidebar-accent/40",
                                ].join(" ")}
                              >
                                All
                              </button>

                              {/* Grade pills — only show grades that exist in this status */}
                              {availGrades.map((grade) => {
                                const gc = GRADE_CONFIG[grade]
                                const isActive = activeGrade === grade
                                const count = gradeMap[grade]?.length ?? 0
                                return (
                                  <button
                                    key={grade}
                                    onClick={() => toggleGradeFilter(status, grade)}
                                    className={[
                                      "rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide transition-colors",
                                      isActive ? gc.active : gc.inactive,
                                    ].join(" ")}
                                  >
                                    {grade}
                                    <span className="ml-1 opacity-70">{count}</span>
                                  </button>
                                )
                              })}
                            </div>
                          )}

                          {/* ── Player List ── */}
                          <SidebarMenu className="pl-3 border-l border-sidebar-border ml-3 mt-0.5 mb-1">
                            {visiblePlayers.map((player) => (
                              <SidebarMenuItem key={player._id}>
                                <SidebarMenuButton
                                  asChild
                                  isActive={pathname === `/admin/players/${player._id}`}
                                  tooltip={player.name}
                                  className="h-10 transition-all"
                                >
                                  <Link href={`/admin/players/${player._id}`}>
                                    {/* Avatar */}
                                    <div className="flex aspect-square size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sidebar-accent to-sidebar-border text-sidebar-accent-foreground text-[10px] font-bold shadow-sm">
                                      {player.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name + meta */}
                                    <div className="flex flex-1 flex-col gap-0.5 overflow-hidden group-data-[collapsible=icon]:hidden">
                                      <span className="truncate text-xs font-semibold">
                                        {player.name}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-wide">
                                          {player.role}
                                        </span>
                                        <span className="text-[8px] text-muted-foreground/40">·</span>
                                        <span
                                          className={[
                                            "text-[8px] font-bold px-1 rounded",
                                            GRADE_CONFIG[player.grade as Grade]?.active ?? "bg-slate-200 text-slate-700",
                                          ].join(" ")}
                                        >
                                          {player.grade}
                                        </span>
                                      </div>
                                    </div>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  }
                )}
              </div>
            )}

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <SidebarFooter>
        <SidebarMenu className="gap-1">
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