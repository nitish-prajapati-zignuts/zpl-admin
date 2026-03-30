"use client"

import { User, Camera, TrendUp, Gavel, CheckCircle } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PlayerHeaderProps {
    player: any
    id: string
    isUpdatingStatus: boolean
    getButtonLabel: () => string
    openBidPanel: () => void
}

export function PlayerHeader({ player, id, isUpdatingStatus, getButtonLabel, openBidPanel }: PlayerHeaderProps) {
    const router = useRouter()

    return (
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

                        <div className="flex justify-center md:justify-start gap-2">
                            {player.status === "sold" && (
                                <p className="text-slate-400 bg-emerald-500 font-bold text-[10px] uppercase tracking-widest bg-slate-50 inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-100">
                                    <CheckCircle size={14} className="mr-1.5 text-emerald-500" />
                                    Auction Concluded
                                </p>
                            )}
                            {(player.status === "pending" || player.status === "on_block") && (
                                <Button
                                    size="sm"
                                    disabled={isUpdatingStatus || player.isAuctionable === false}
                                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-none shadow-md shadow-indigo-200 rounded-full px-6 font-bold text-xs h-9 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                                    onClick={openBidPanel}
                                >
                                    <Gavel size={16} weight="fill" className="mr-2" />
                                    {getButtonLabel()}
                                </Button>
                            )}
                            {player.status !== "pending" && player.status !== "on_block" && player.status !== "sold" && (
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-100">
                                    {player.status}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {(player.status === "sold" || player.status === "unsold") && (
                                <Button
                                    onClick={() => router.push(`/admin/players/${id}/edit`)}
                                    variant="default"
                                    className="flex items-center gap-2 rounded-full px-5 py-2 font-medium tracking-wide shadow-indigo-500/20 shadow-lg hover:shadow-indigo-500/40 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                    </svg>
                                    Edit
                                </Button>
                            )}
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
    )
}