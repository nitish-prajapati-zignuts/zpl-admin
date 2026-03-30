"use client"

import { Gavel, X, CheckCircle } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BID_STEPS } from "@/app/constants"
import { BidStepButtons } from "./BidStepButtons"

interface BidPanelProps {
    player: any
    bidAmount: number
    isSellMutatePending: boolean
    isSetPlayerToUnsoldPending: boolean
    isSetCancelClearToPendingPending: boolean
    onClose: () => void
    onIncrement: (step: number) => void
    onDecrement: (step: number) => void
    onConfirmSale: () => void
    onSetUnsold: () => void
    onCancelClear: () => void
}

export function BidPanel({
    player,
    bidAmount,
    isSellMutatePending,
    isSetPlayerToUnsoldPending,
    isSetCancelClearToPendingPending,
    onClose,
    onIncrement,
    onDecrement,
    onConfirmSale,
    onSetUnsold,
    onCancelClear,
}: BidPanelProps) {
    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="rounded-2xl border border-indigo-200 bg-white shadow-xl shadow-indigo-100/50 overflow-hidden">
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4">
                    <div className="flex items-center gap-2 text-white">
                        <Gavel size={18} weight="fill" className="animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest italic">Live Auction Sequence</span>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={20} weight="bold" />
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    <div className="text-center space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Valuation</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl md:text-6xl font-black text-slate-900 tabular-nums">
                                ₹{bidAmount.toLocaleString("en-IN")}
                            </span>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold border-indigo-100 text-indigo-400">
                            Base Price: ₹{player.basePrice}L
                        </Badge>
                    </div>

                    <BidStepButtons
                        steps={BID_STEPS}
                        onIncrement={onIncrement}
                        onDecrement={onDecrement}
                        minBid={player.basePrice ?? 0}
                        currentBid={bidAmount}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-xl text-slate-400 font-bold text-xs h-12 hover:bg-slate-50"
                            onClick={onCancelClear}
                        >
                            {isSetCancelClearToPendingPending ? "Cancelling..." : "Cancel & Clear"}
                        </Button>
                        <Button
                            className="flex-1 rounded-xl bg-red-500 text-white font-bold text-xs h-12"
                            onClick={onSetUnsold}
                        >
                            {isSetPlayerToUnsoldPending ? "Setting Player to Unsold..." : "Set Player to Unsold"}
                        </Button>
                        <Button
                            className="flex-[2] rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs h-12 shadow-xl transition-all hover:scale-[1.01] active:scale-95"
                            onClick={onConfirmSale}
                        >
                            <CheckCircle size={18} weight="fill" className="mr-2 text-emerald-400" />
                            {isSellMutatePending ? "Confirming Sale..." : `CONFIRM SALE @ ₹${bidAmount}L`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}