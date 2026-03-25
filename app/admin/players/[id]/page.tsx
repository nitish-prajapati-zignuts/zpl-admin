"use client"

import * as React from "react"
import {
    User,
    Tag,
    GenderIntersex,
    Wallet,
    ShieldCheck,
    Camera,
    TrendUp,
    Target,
    Gavel,
    Plus,
    Minus,
    X,
    CheckCircle,
} from "@phosphor-icons/react"
import { useGetPlayerById, useOnBlockCall } from "@/app/services/query"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PageProps {
    params: Promise<{ id: string }>
}

const BID_STEPS = [0.5, 1, 5]

export default function PlayerDetailPage({ params }: PageProps) {
    // 1. Resolve Params
    const resolvedParams = React.use(params)
    const id = resolvedParams.id

    // 2. Data Fetching
    const { data, isLoading, error } = useGetPlayerById(id)
    const player = data?.data

    // 3. Local State for Auction UI
    const [bidOpen, setBidOpen] = React.useState(false)
    const [bidAmount, setBidAmount] = React.useState(0)

    // 4. Mutation Hook — panel opens only after server confirms on_block
    const { mutate, isPending: isUpdatingStatus } = useOnBlockCall(id, () => {
        setBidAmount(player?.basePrice ?? 0)
        setBidOpen(true)
    })

    // --- Logic Handlers ---
    const openBidPanel = () => {
        if (player?.status === "on_block") {
            // Already on block (e.g. page refresh) — open immediately
            setBidAmount(player.basePrice ?? 0)
            setBidOpen(true)
        } else {
            // Fire PATCH → on success: invalidate query + open panel
            mutate()
        }
    }

    const closeBidPanel = () => setBidOpen(false)

    const increment = (step: number) => setBidAmount((prev) => prev + step)
    const decrement = (step: number) =>
        setBidAmount((prev) => Math.max(player?.basePrice ?? 0, prev - step))

    // --- Guard Clauses ---
    if (isLoading) return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50/50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
    )

    if (error || !player) return (
        <div className="p-8 text-center mt-20">
            <h2 className="text-2xl font-bold text-slate-900">Player Not Found</h2>
            <p className="text-slate-500">The requested profile is unavailable.</p>
        </div>
    )

    return (
        <div className="w-full min-h-screen bg-[#f8fafc] p-6 lg:p-8 text-slate-900">

            {/* --- HEADER SECTION --- */}
            <div className="relative overflow-hidden rounded-[1.5rem] bg-white border border-slate-200 shadow-sm p-6 mb-8">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-48 rounded-full bg-indigo-50/40 blur-3xl" />

                <div className="relative flex flex-col md:flex-row justify-between gap-6 items-center md:items-start">
                    <div className="flex-1 space-y-5 text-center md:text-left">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
                                    {player.name}
                                </h1>
                                <Badge className="bg-emerald-500 text-white border-none px-3 py-0.5 rounded-full uppercase text-[9px] font-bold tracking-widest shadow-sm">
                                    {player.status}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                                {player.isRetained && (
                                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                                        <TrendUp size={12} weight="bold" />
                                        RETAINED
                                    </div>
                                )}
                                <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase border border-slate-200">
                                    {player.gender}
                                </div>
                            </div>

                            {/* --- AUCTION ACTIONS --- */}
                            <div className="flex justify-center md:justify-start">
                                {player.status === "sold" && (
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-100">
                                        <CheckCircle size={14} className="mr-1.5 text-emerald-500" />
                                        Auction Concluded
                                    </p>
                                )}
                                {(player.status === "pending" || player.status === "on_block") ? (
                                    <Button
                                        size="sm"
                                        disabled={isUpdatingStatus}
                                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-none shadow-md shadow-indigo-200 rounded-full px-6 font-bold text-xs h-9 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                                        onClick={openBidPanel}
                                    >
                                        <Gavel size={16} weight="fill" className="mr-2" />
                                        {isUpdatingStatus ? "SYNCING..." : player.status === "on_block" ? "VIEW BID" : "START BID"}
                                    </Button>
                                ) : (
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-100">
                                        {player.status}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- AVATAR --- */}
                    <div className="relative group shrink-0">
                        <div className="size-28 lg:size-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center transition-all group-hover:scale-105">
                            {player.photoUrl ? (
                                <img src={player.photoUrl} alt={player.name} className="size-full object-cover" />
                            ) : (
                                <User size={40} weight="duotone" className="text-slate-300" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera size={24} className="text-white" weight="fill" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================= BID PANEL ========================= */}
            {bidOpen && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="rounded-2xl border border-indigo-200 bg-white shadow-xl shadow-indigo-100/50 overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4">
                            <div className="flex items-center gap-2 text-white">
                                <Gavel size={18} weight="fill" className="animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-widest italic">Live Auction Sequence</span>
                            </div>
                            <button onClick={closeBidPanel} className="text-white/70 hover:text-white transition-colors">
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 space-y-8">
                            {/* Visual Bid Indicator */}
                            <div className="text-center space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Valuation</p>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-5xl md:text-6xl font-black text-slate-900 tabular-nums">
                                        ₹{bidAmount.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-xl font-bold text-indigo-500">L</span>
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold border-indigo-100 text-indigo-400">
                                    Base Price: ₹{player.basePrice}L
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Increment Section */}
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                        <Plus size={10} weight="bold" /> Raise Bid
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {BID_STEPS.map((step) => (
                                            <button
                                                key={`+${step}`}
                                                onClick={() => increment(step)}
                                                className="rounded-xl border-2 border-emerald-100 bg-emerald-50/50 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white text-emerald-700 font-black text-xs py-3 transition-all active:scale-95 shadow-sm"
                                            >
                                                +{step}L
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Decrement Section */}
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                                        <Minus size={10} weight="bold" /> Correction
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {BID_STEPS.map((step) => (
                                            <button
                                                key={`-${step}`}
                                                onClick={() => decrement(step)}
                                                disabled={bidAmount - step < (player.basePrice ?? 0)}
                                                className="rounded-xl border-2 border-rose-100 bg-rose-50/50 hover:bg-rose-500 hover:border-rose-500 hover:text-white text-rose-600 font-black text-xs py-3 transition-all active:scale-95 disabled:opacity-20 shadow-sm"
                                            >
                                                -{step}L
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50">
                                <Button
                                    variant="ghost"
                                    className="flex-1 rounded-xl text-slate-400 font-bold text-xs h-12 hover:bg-slate-50"
                                    onClick={closeBidPanel}
                                >
                                    Cancel & Clear
                                </Button>
                                <Button
                                    className="flex-[2] rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs h-12 shadow-xl transition-all hover:scale-[1.01] active:scale-95"
                                    onClick={() => {
                                        console.log("Confirm Final Bid:", bidAmount)
                                        closeBidPanel()
                                    }}
                                >
                                    <CheckCircle size={18} weight="fill" className="mr-2 text-emerald-400" />
                                    CONFIRM SALE @ ₹{bidAmount}L
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- COMPACT STATS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard
                    icon={<Target size={18} weight="duotone" />}
                    label="Strategic Role"
                    value={player.role || "All-Rounder"}
                    color="bg-rose-50 text-rose-600"
                />
                <StatCard
                    icon={<GenderIntersex size={18} weight="duotone" />}
                    label="Gender"
                    value={player.gender.toUpperCase()}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    icon={<Wallet size={18} weight="duotone" />}
                    label="Base Price"
                    value={player.basePrice === 0 ? "Free Agent" : `₹${player.basePrice.toLocaleString()}L`}
                    color="bg-amber-50 text-amber-600"
                />
                <StatCard
                    icon={<Tag size={18} weight="duotone" />}
                    label="Sold Price"
                    value={player.finalAmount ? `₹${player.finalAmount.toLocaleString()}L` : "Active"}
                    color="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    icon={<ShieldCheck size={18} weight="duotone" />}
                    label="Franchise"
                    value={player.soldTo || "Unassigned"}
                    color="bg-indigo-50 text-indigo-600"
                />
            </div>

            {/* --- LOGS & NOTES --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl bg-white">
                    <CardHeader className="px-6 py-4 border-b border-slate-50">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scout Report</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 text-sm text-slate-600 font-medium leading-relaxed italic">
                        Onboarded into ZPL on {new Date(player.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}.
                        The player is currently categorized as <span className="text-indigo-600 font-bold uppercase">{player.status}</span>.
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl bg-white">
                    <CardHeader className="px-6 py-4 border-b border-slate-50">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Trail</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-400 uppercase">Registered</span>
                            <span className="font-mono font-bold text-slate-700">{new Date(player.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-400 uppercase">Last Sync</span>
                            <span className="font-mono font-bold text-slate-700">{new Date(player.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl bg-white overflow-hidden group border border-transparent hover:border-slate-100">
            <CardContent className="p-4 flex flex-col gap-3">
                <div className={`size-9 flex items-center justify-center rounded-lg ${color} transition-transform group-hover:scale-110 shadow-sm`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-slate-800 truncate leading-none">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}