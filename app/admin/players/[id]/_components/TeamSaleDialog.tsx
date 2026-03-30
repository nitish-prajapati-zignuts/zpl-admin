"use client"

import { Gavel, CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { TeamCard } from "./TeamCard"
import { Team } from "@/app/types/types"

interface TeamSaleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    player: any
    teams: Team[]
    selectedTeam: Team | undefined
    selectedTeamName: string
    bidAmount: number
    isSellMutatePending: boolean
    onSelectTeam: (name: string) => void
    onBack: () => void
    onFinalSale: () => void
}

export function TeamSaleDialog({
    open,
    onOpenChange,
    player,
    teams,
    selectedTeam,
    selectedTeamName,
    bidAmount,
    isSellMutatePending,
    onSelectTeam,
    onBack,
    onFinalSale,
}: TeamSaleDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5">
                    <DialogHeader>
                        <DialogTitle className="text-white font-black text-base uppercase tracking-widest flex items-center gap-2">
                            <Gavel size={16} weight="fill" className="text-indigo-400" />
                            Select Franchise
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-[11px] font-medium mt-1">
                            Assign <span className="text-white font-bold">{player.name}</span> to a franchise at{" "}
                            <span className="text-emerald-400 font-bold">₹{bidAmount}L</span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">
                            Select Franchise — {teams.length} available
                        </p>
                        {teams.length === 0 ? (
                            <p className="text-center text-slate-400 text-xs py-6">No teams available</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                                {teams.map((team) => (
                                    <TeamCard
                                        key={team._id}
                                        team={team}
                                        isSelected={selectedTeamName === team.name}
                                        onSelect={() => onSelectTeam(team.name)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedTeam && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Sale Summary</p>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                                        {player.name} → {selectedTeam.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-emerald-600">₹{bidAmount}L</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-1">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-xl text-slate-400 font-bold text-xs h-11 hover:bg-slate-50"
                            onClick={onBack}
                        >
                            Back
                        </Button>
                        <Button
                            disabled={!selectedTeamName}
                            className="flex-[2] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-11 shadow-lg shadow-emerald-100 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-40"
                            onClick={onFinalSale}
                        >
                            <CheckCircle size={16} weight="fill" className="mr-2" />
                            {isSellMutatePending
                                ? `Selling to ${selectedTeamName?.toUpperCase() || "FRANCHISE"}...`
                                : `SOLD TO ${selectedTeamName?.toUpperCase() || "FRANCHISE"}`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}