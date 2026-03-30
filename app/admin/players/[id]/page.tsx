"use client"

import { usePlayerAuction } from "@/hooks/usePlayerAuction"
import * as React from "react"
import { PlayerHeader } from "./_components/PlayerHeader"
import { BidPanel } from "./_components/BidPanel"
import { AmountConfirmDialog } from "./_components/AmountConfirmDialog"
import { TeamSaleDialog } from "./_components/TeamSaleDialog"
import { PlayerAuditCards } from "./_components/PlayerAuditCards"
import { PlayerStatsGrid } from "./_components/PlayerStatsGrid"


export interface PageProps {
    params: Promise<{ id: string }>
}

export default function PlayerDetailPage({ params }: PageProps) {
    const resolvedParams = React.use(params)
    const id = resolvedParams.id

    const {
        player,
        teams,
        selectedTeam,
        isLoading,
        error,
        bidOpen,
        setBidOpen,
        bidAmount,
        amountConfirmOpen,
        setAmountConfirmOpen,
        editableAmount,
        setEditableAmount,
        saleDialogOpen,
        setSaleDialogOpen,
        selectedTeamName,
        setSelectedTeamName,
        isUpdatingStatus,
        isSellMutatePending,
        isSetPlayerToUnsoldPending,
        isSetCancelClearToPendingPending,
        openBidPanel,
        increment,
        decrement,
        handleConfirmSaleClick,
        handleAmountConfirmed,
        handleFinalSale,
        handleSetPlayerToUnsold,
        handleSetCancelClearToPending,
        getButtonLabel,
    } = usePlayerAuction(id)

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50/50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
        )
    }

    if (error || !player) {
        return (
            <div className="p-8 text-center mt-20">
                <h2 className="text-2xl font-bold text-slate-900">Player Not Found</h2>
                <p className="text-slate-500">The requested profile is unavailable.</p>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-[#f8fafc] p-6 lg:p-8 text-slate-900">
            <PlayerHeader
                player={player}
                id={id}
                isUpdatingStatus={isUpdatingStatus}
                getButtonLabel={getButtonLabel}
                openBidPanel={openBidPanel}
            />

            {bidOpen && (
                <BidPanel
                    player={player}
                    bidAmount={bidAmount}
                    isSellMutatePending={isSellMutatePending}
                    isSetPlayerToUnsoldPending={isSetPlayerToUnsoldPending}
                    isSetCancelClearToPendingPending={isSetCancelClearToPendingPending}
                    onClose={() => setBidOpen(false)}
                    onIncrement={increment}
                    onDecrement={decrement}
                    onConfirmSale={handleConfirmSaleClick}
                    onSetUnsold={handleSetPlayerToUnsold}
                    onCancelClear={handleSetCancelClearToPending}
                />
            )}

            <AmountConfirmDialog
                open={amountConfirmOpen}
                onOpenChange={setAmountConfirmOpen}
                player={player}
                bidAmount={bidAmount}
                editableAmount={editableAmount}
                setEditableAmount={setEditableAmount}
                onConfirm={handleAmountConfirmed}
            />

            <TeamSaleDialog
                open={saleDialogOpen}
                onOpenChange={setSaleDialogOpen}
                player={player}
                teams={teams}
                selectedTeam={selectedTeam}
                selectedTeamName={selectedTeamName}
                bidAmount={bidAmount}
                isSellMutatePending={isSellMutatePending}
                onSelectTeam={setSelectedTeamName}
                onBack={() => {
                    setSaleDialogOpen(false)
                    setAmountConfirmOpen(true)
                }}
                onFinalSale={handleFinalSale}
            />

            <PlayerStatsGrid player={player} />

            <PlayerAuditCards player={player} />
        </div>
    )
}