"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
    useCancelSetToPending,
    useGetPlayerById,
    useGetTeams,
    useOnBlockCall,
    useOnSellConfirmation,
    useSetOnUnsold,
} from "@/app/services/query"
import { Team } from "@/app/types/types"

export function usePlayerAuction(id: string) {
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useGetPlayerById(id)
    const player = data?.data

    // Bid panel state
    const [bidOpen, setBidOpen] = React.useState(false)
    const [bidAmount, setBidAmount] = React.useState(0)

    // Step 1 – amount confirmation dialog state
    const [amountConfirmOpen, setAmountConfirmOpen] = React.useState(false)
    const [editableAmount, setEditableAmount] = React.useState<number | string>(0)

    // Step 2 – team selection / final sale dialog state
    const [saleDialogOpen, setSaleDialogOpen] = React.useState(false)
    const [selectedTeamName, setSelectedTeamName] = React.useState<string>("")

    // -------------------------------------------------------------------------
    // Mutations
    // -------------------------------------------------------------------------

    const { mutate: startBlock, isPending: isUpdatingStatus } = useOnBlockCall(id, () => {
        setBidAmount(player?.basePrice ?? 0)
        setBidOpen(true)
    })

    const { mutate: sellMutate, isPending: isSellMutatePending } = useOnSellConfirmation(
        { id, teamName: selectedTeamName, soldAmount: bidAmount },
        {
            onSuccess: () => {
                setBidOpen(false)
                setSaleDialogOpen(false)
                queryClient.invalidateQueries({ queryKey: ["player", id] })
                queryClient.invalidateQueries({ queryKey: ["players"] })
            },
            onError: () => alert("Failed to set player to unsold"),
        }
    )

    const { mutate: setPlayerToUnsoldMutate, isPending: isSetPlayerToUnsoldPending } = useSetOnUnsold(id, {
        onSuccess: () => {
            setBidOpen(false)
            queryClient.invalidateQueries({ queryKey: ["player", id] })
            queryClient.invalidateQueries({ queryKey: ["players"] })
        },
        onError: () => alert("Failed to set player to unsold"),
    })

    const { mutate: setCancelClearToPendingMutate, isPending: isSetCancelClearToPendingPending } = useCancelSetToPending(id, {
        onSuccess: () => {
            setBidOpen(false)
            queryClient.invalidateQueries({ queryKey: ["player", id] })
            queryClient.invalidateQueries({ queryKey: ["players"] })
        },
        onError: () => alert("Failed to cancel player"),
    })

    const { data: teamsData } = useGetTeams()
    const teams = (teamsData?.data ?? []) as Team[]

    // -------------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------------

    const openBidPanel = () => {
        if (player?.status === "on_block") {
            setBidAmount(player.basePrice ?? 0)
            setBidOpen(true)
        } else {
            startBlock()
        }
    }

    const increment = (step: number) => setBidAmount((prev) => prev + step)
    const decrement = (step: number) =>
        setBidAmount((prev) => Math.max(player?.basePrice ?? 0, prev - step))

    const handleConfirmSaleClick = () => {
        setEditableAmount(bidAmount)
        setAmountConfirmOpen(true)
    }

    const handleAmountConfirmed = () => {
        const val = typeof editableAmount === "string" ? parseFloat(editableAmount) : editableAmount
        if (isNaN(val)) return
        setBidAmount(val)
        setAmountConfirmOpen(false)
        setSelectedTeamName("")
        setSaleDialogOpen(true)
    }

    const handleFinalSale = () => {
        if (!selectedTeamName) return
        sellMutate()
    }

    const handleSetPlayerToUnsold = () => {
        if (isSetPlayerToUnsoldPending) return
        setPlayerToUnsoldMutate()
        setSaleDialogOpen(false)
    }

    const handleSetCancelClearToPending = () => {
        if (isSetCancelClearToPendingPending) return
        setCancelClearToPendingMutate()
    }

    const getButtonLabel = () => {
        if (isUpdatingStatus) return "Updating..."
        if (player?.isAuctionable) {
            if (player.status === "pending") return "START BID"
            if (player.status === "on_block") return "VIEW BID"
        }
        return "Bid Completed"
    }

    const selectedTeam = teams.find((t) => t.name === selectedTeamName) as Team | undefined

    return {
        // Data
        player,
        teams,
        selectedTeam,
        isLoading,
        error,
        // Bid panel
        bidOpen,
        setBidOpen,
        bidAmount,
        // Amount confirm dialog
        amountConfirmOpen,
        setAmountConfirmOpen,
        editableAmount,
        setEditableAmount,
        // Sale dialog
        saleDialogOpen,
        setSaleDialogOpen,
        selectedTeamName,
        setSelectedTeamName,
        // Pending states
        isUpdatingStatus,
        isSellMutatePending,
        isSetPlayerToUnsoldPending,
        isSetCancelClearToPendingPending,
        // Handlers
        openBidPanel,
        increment,
        decrement,
        handleConfirmSaleClick,
        handleAmountConfirmed,
        handleFinalSale,
        handleSetPlayerToUnsold,
        handleSetCancelClearToPending,
        getButtonLabel,
    }
}