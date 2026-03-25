"use client"

import * as React from "react"
import {
    User,
    Tag,
    GenderIntersex,
    Wallet,
    ShieldCheck,
    ClockCounterClockwise,
    Camera,
    TrendUp,
    Target,
    Gavel // Added for the bidding action
} from "@phosphor-icons/react"
import { useGetPlayerById } from "@/app/services/query"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button" // Assuming shadcn/ui button
import { Separator } from "@/components/ui/separator"

interface PageProps {
    params: Promise<{ id: string }>
}



export default function PlayerDetailPage({ params }: PageProps) {
    const resolvedParams = React.use(params)
    const id = resolvedParams.id

    const { data, isLoading, error } = useGetPlayerById(id)
    const player = data?.data

    if (isLoading) return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50/50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
    )

    if (error || !player) return (
        <div className="p-8 text-center mt-20">
            <h2 className="text-2xl font-bold text-slate-900">Player Not Found</h2>
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
                                <Badge className="bg-emerald-500 text-white border-none px-3 py-0.5 rounded-full uppercase text-[9px] font-bold tracking-widest">
                                    {player.status}
                                </Badge>
                            </div>

                            {/* 🔨 Dynamic Start Bid Button (Replaced Ref ID) */}
                            {player.status === "pending" ? (
                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-none shadow-md shadow-indigo-200 rounded-full px-6 font-bold text-xs h-9 transition-all hover:scale-105 active:scale-95"
                                    onClick={() => console.log("Starting bid for:", player._id)}
                                >
                                    <Gavel size={16} weight="fill" className="mr-2" />
                                    START BID
                                </Button>
                            ) : (
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded border border-slate-100">
                                    Auction Concluded
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                            {player.isRetained && (
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                                    <TrendUp size={12} weight="bold" />
                                    RETAINED
                                </div>
                            )}
                            <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                                {player.gender}
                            </div>
                        </div>
                    </div>

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
                    value={player.gender.toLocaleUpperCase()}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    icon={<Wallet size={18} weight="duotone" />}
                    label="Base Price"
                    value={player.basePrice === 0 ? "Free Agent" : `₹${player.basePrice.toLocaleString()}`}
                    color="bg-amber-50 text-amber-600"
                />
                <StatCard
                    icon={<Tag size={18} weight="duotone" />}
                    label="Sold Price"
                    value={player.finalAmount ? `₹${player.finalAmount.toLocaleString()}` : "Active"}
                    color="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    icon={<ShieldCheck size={18} weight="duotone" />}
                    label="Franchise"
                    value={player.soldTo || "Unassigned"}
                    color="bg-indigo-50 text-indigo-600"
                />
            </div>

            {/* --- LOGS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl bg-white">
                    <CardHeader className="px-6 py-4 border-b border-slate-50">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scout Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 text-sm text-slate-600 font-medium leading-relaxed italic">
                        Onboarded {new Date(player.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}.
                        Verified and ready for the ZPL draft cycle.
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl bg-white">
                    <CardHeader className="px-6 py-4 border-b border-slate-50">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit History</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-400 uppercase">Registered</span>
                            <span className="font-mono font-bold">{new Date(player.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-400 uppercase">Modified</span>
                            <span className="font-mono font-bold">{new Date(player.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl bg-white overflow-hidden group">
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