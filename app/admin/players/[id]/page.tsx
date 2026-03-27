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
    Warning,
    GradientIcon,
    ArrowElbowDownRightIcon,
} from "@phosphor-icons/react"
import { useCancelSetToPending, useGetPlayerById, useGetTeams, useOnBlockCall, useOnSellConfirmation, useSetOnUnsold } from "@/app/services/query"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

interface PageProps {
    params: Promise<{ id: string }>
}

interface Team {
    _id: string
    name: string
    captainName: string
    managerName: string
    totalBudget: number
    budgetRemaining: number
    players: any[]
}

const BID_STEPS = [50000, 100000, 200000]

const formatBudget = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    return `₹${amount.toLocaleString("en-IN")}`
}

const formatNumber = (value: number | string) => {
    if (value === "" || value === null) return "";
    return new Intl.NumberFormat("en-IN").format(Number(value));
};

const parseNumber = (value: string) => {
    return value.replace(/,/g, "");
};




export default function PlayerDetailPage({ params }: PageProps) {
    const queryClient = useQueryClient()

    const resolvedParams = React.use(params)
    const id = resolvedParams.id
    const router = useRouter()

    const { data, isLoading, error } = useGetPlayerById(id)
    const player = data?.data

    const [bidOpen, setBidOpen] = React.useState(false)
    const [bidAmount, setBidAmount] = React.useState(0)

    // Step 1: Amount confirmation dialog
    const [amountConfirmOpen, setAmountConfirmOpen] = React.useState(false)
    // Step 2: Team selection / final sale dialog
    const [saleDialogOpen, setSaleDialogOpen] = React.useState(false)
    const [selectedTeamName, setSelectedTeamName] = React.useState<string>("")


    // Add this state near the other states
    const [editableAmount, setEditableAmount] = React.useState<number | string>(0)

    // Update handleConfirmSaleClick to seed the editable value
    const handleConfirmSaleClick = () => {
        setEditableAmount(bidAmount) // seed with current bid
        setAmountConfirmOpen(true)
    }

    // Update handleAmountConfirmed to apply the edited value
    const handleAmountConfirmed = () => {
        const val = typeof editableAmount === "string" ? parseFloat(editableAmount) : editableAmount
        if (isNaN(val)) return

        setBidAmount(val) // push edited value back to bidAmount
        setAmountConfirmOpen(false)
        setSelectedTeamName("")
        setSaleDialogOpen(true)
    }

    const { mutate, isPending: isUpdatingStatus, isError, error: setErrorOnBlock } = useOnBlockCall(id, () => {
        setBidAmount(player?.basePrice ?? 0)
        setBidOpen(true)
    })

    console.log(setErrorOnBlock)



    const { mutate: sellMutate, isPending: isSellMutatePending } = useOnSellConfirmation({ id, teamName: selectedTeamName, soldAmount: bidAmount }, {
        onSuccess: () => {
            setBidOpen(false)
            setSaleDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["player", id] })
            queryClient.invalidateQueries({ queryKey: ["players"] })
        },
        onError: () => {
            alert("Failed to set player to unsold")
        }
    })
    const { mutate: setPlayerToUnsoldMutate, isPending: isSetPlayerToUnsoldPending } = useSetOnUnsold(id, {
        onSuccess: () => {
            setBidOpen(false)
            queryClient.invalidateQueries({ queryKey: ["player", id] })
            queryClient.invalidateQueries({ queryKey: ["players"] })
        },
        onError: () => {
            alert("Failed to set player to unsold")
        }
    })
    const { mutate: setCancelClearToPendingMutate, isPending: isSetCancelClearToPendingPending } = useCancelSetToPending(id, {
        onSuccess: () => {
            setBidOpen(false)
            queryClient.invalidateQueries({ queryKey: ["player", id] })
            queryClient.invalidateQueries({ queryKey: ["players"] })
        },
        onError: () => {
            alert("Failed to cancel player")
        }
    })

    const { data: teamsData } = useGetTeams()
    const teams = (teamsData?.data ?? []) as Team[]

    const openBidPanel = () => {
        if (player?.status === "on_block") {
            setBidAmount(player.basePrice ?? 0)
            setBidOpen(true)
        } else {
            mutate()
        }
    }

    const closeBidPanel = () => {
        setBidOpen(false)
    }
    const increment = (step: number) => setBidAmount((prev) => prev + step)
    const decrement = (step: number) =>
        setBidAmount((prev) => Math.max(player?.basePrice ?? 0, prev - step))

    // Step 1: "CONFIRM SALE @ ₹XL" clicked → open amount confirmation
    // const handleConfirmSaleClick = () => {
    //     setAmountConfirmOpen(true)
    // }

    // // Step 2: Amount confirmed → close step 1, open team selector
    // const handleAmountConfirmed = () => {
    //     setAmountConfirmOpen(false)
    //     setSelectedTeamName("")
    //     setSaleDialogOpen(true)
    // }

    // Step 3: Team selected + final "SOLD TO" clicked → fire mutation
    const handleFinalSale = () => {
        if (!selectedTeamName) return
        //setSaleDialogOpen(false)
        //closeBidPanel()
        sellMutate()
    }

    const bidAmountRaw = bidAmount
    const selectedTeam = teams.find((t) => t.name === selectedTeamName) as Team | undefined
    const canAfford = selectedTeam ? selectedTeam.budgetRemaining >= bidAmountRaw : true

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

    const handleEditChanges = (id: string) => {
        router.push(`/admin/players/${id}/edit`)
    }

    const handleSetPlayerToUnsold = (id: string) => {
        if (isSetPlayerToUnsoldPending) return
        console.log(id)
        setPlayerToUnsoldMutate()
        setSaleDialogOpen(false)
    }

    const handleSetCancelClearToPending = (id: string) => {
        if (isSetCancelClearToPendingPending) return
        setCancelClearToPendingMutate()
        //setBidOpen(false)
    }

    const getButtonLabel = () => {
        if (isUpdatingStatus) return "Updating..."

        if (player.isAuctionable) {
            if (player.status === "pending") return "START BID"
            if (player.status === "on_block") return "VIEW BID"
        }

        return "Bid Completed"
    }

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
                            <div className="flex justify-center md:justify-start gap-2">
                                {player.status === "sold" && (
                                    <p className="text-slate-400 bg-emerald-500 font-bold text-[10px] uppercase tracking-widest bg-slate-50 inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-100">
                                        <CheckCircle size={14} className="mr-1.5 text-emerald-500" />
                                        Auction Concluded
                                    </p>
                                )}
                                {(player.status === "pending" || player.status === "on_block") ? (
                                    <Button
                                        size="sm"
                                        disabled={isUpdatingStatus || player.isAuctionable === false}
                                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-none shadow-md shadow-indigo-200 rounded-full px-6 font-bold text-xs h-9 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                                        onClick={openBidPanel}

                                    >
                                        {/* <Gavel size={16} weight="fill" className="mr-2" /> */}
                                        {/* {isUpdatingStatus ? "Updating..." : ""}
                                        {player.isAuctionable === true && player.status === "pending" && "START BID"}
                                        {player.isAuctionable === true && player.status === "on_block" && "VIEW BID"}
                                        {player.isAuctionable === false && player.status === "pending" && "Bid Completed"}
                                        {player.isAuctionable === false && player.status === "on_block" && "Bid Completed"} */}
                                        <Gavel size={16} weight="fill" className="mr-2" />
                                        {getButtonLabel()}

                                    </Button>


                                ) : (
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-100">
                                        {player.status}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2" >
                                {(player.status === "sold" || player.status === "unsold") && (<Button onClick={() => handleEditChanges(id)} variant="default" className="flex items-center gap-2 rounded-full px-5 py-2 font-medium tracking-wide shadow-indigo-500/20 shadow-lg hover:shadow-indigo-500/40 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    Edit
                                </Button>)}
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

            {/* ========================= BID PANEL ========================= */}
            {bidOpen && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="rounded-2xl border border-indigo-200 bg-white shadow-xl shadow-indigo-100/50 overflow-hidden">
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
                            <div className="text-center space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Valuation</p>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-5xl md:text-6xl font-black text-slate-900 tabular-nums">
                                        ₹{bidAmount.toLocaleString("en-IN")}
                                    </span>
                                    {/* <span className="text-xl font-bold text-indigo-500">L</span> */}
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold border-indigo-100 text-indigo-400">
                                    Base Price: ₹{player.basePrice}L
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50">
                                <Button
                                    variant="ghost"
                                    className="flex-1 rounded-xl text-slate-400 font-bold text-xs h-12 hover:bg-slate-50"
                                    //onClick={closeBidPanel}
                                    onClick={() => handleSetCancelClearToPending(player._id)}
                                >
                                    {isSetCancelClearToPendingPending ? "Cancelling..." : "Cancel & Clear"}
                                </Button>
                                <Button
                                    className="flex-1 rounded-xl bg-red-500 text-white font-bold text-xs h-12"
                                    onClick={() => handleSetPlayerToUnsold(player._id)}
                                >
                                    {isSetPlayerToUnsoldPending ? "Setting Player to Unsold..." : "Set Player to Unsold"}
                                </Button>
                                <Button
                                    className="flex-[2] rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs h-12 shadow-xl transition-all hover:scale-[1.01] active:scale-95"
                                    onClick={handleConfirmSaleClick}
                                >
                                    <CheckCircle size={18} weight="fill" className="mr-2 text-emerald-400" />
                                    {isSellMutatePending ? "Confirming Sale..." : "CONFIRM SALE @ ₹" + bidAmount + "L"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================= STEP 1: AMOUNT CONFIRMATION ========================= */}
            <Dialog open={amountConfirmOpen} onOpenChange={setAmountConfirmOpen}>
                <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
                        <DialogHeader>
                            <DialogTitle className="text-white font-black text-base uppercase tracking-widest flex items-center gap-2">
                                <Warning size={16} weight="fill" />
                                Confirm Amount
                            </DialogTitle>
                            <DialogDescription className="text-amber-100 text-[11px] font-medium mt-1">
                                Verify or edit the final bid amount before assigning a franchise.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-8 space-y-7">
                        {/* Editable Amount Input */}
                        <div className="rounded-2xl bg-slate-50 border-2 border-slate-100 p-6 space-y-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">
                                Final Bid Amount
                            </p>
                            <div className="flex w-full items-center justify-center gap-3">
                                <span className="text-2xl font-black text-slate-300">₹</span>
                                <input
                                    autoFocus
                                    type="text"
                                    value={formatNumber(editableAmount)}
                                    onChange={(e) => {
                                        const raw = parseNumber(e.target.value);

                                        if (raw === "") {
                                            setEditableAmount("");
                                        } else {
                                            const num = parseFloat(raw);
                                            if (!isNaN(num) && num >= 0) {
                                                setEditableAmount(num);
                                            }
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const val =
                                                typeof editableAmount === "string"
                                                    ? parseFloat(editableAmount)
                                                    : editableAmount;

                                            if (!isNaN(val) && val >= (player.basePrice ?? 0)) {
                                                handleAmountConfirmed();
                                            }
                                        }
                                    }}
                                    className="w-full text-5xl font-black text-slate-900 tabular-nums bg-transparent border-b-2 border-slate-200 focus:border-amber-400 outline-none text-center pb-2 transition-colors"
                                />
                                <span className="text-2xl font-black text-indigo-400">L</span>
                            </div>

                            {editableAmount !== bidAmount && (
                                <p className="text-[10px] text-amber-500 font-bold text-center animate-in fade-in duration-150">
                                    ⚠ Changed from ₹{bidAmount}L
                                </p>
                            )}

                            <p className="text-[11px] text-slate-400 font-medium text-center">
                                for <span className="font-bold text-slate-600">{player.name}</span>
                                {" · "}Base: ₹{player.basePrice}L
                            </p>
                        </div>

                        <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed">
                            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-600">Enter ↵</kbd> or click confirm. This amount cannot be changed after proceeding.
                        </p>

                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                className="flex-1 rounded-xl text-slate-400 font-bold text-xs h-12 hover:bg-slate-50"
                                onClick={() => setAmountConfirmOpen(false)}
                            >
                                Go Back
                            </Button>
                            <Button
                                disabled={
                                    editableAmount === "" ||
                                    (typeof editableAmount === "number" && (editableAmount <= 0 || editableAmount < (player.basePrice ?? 0))) ||
                                    (typeof editableAmount === "string" && parseFloat(editableAmount) < (player.basePrice ?? 0))
                                }
                                className="flex-[2] rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs h-12 shadow-lg shadow-amber-100 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-40"
                                onClick={handleAmountConfirmed}
                            >
                                <CheckCircle size={16} weight="fill" className="mr-2" />
                                YES, ₹{editableAmount}L IS CORRECT
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            {/* ========================= STEP 2: TEAM SELECTION / FINAL SALE ========================= */}
            <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
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
                                    {teams.map((team) => {
                                        const isSelected = selectedTeamName === team.name
                                        //const affordable = team.budgetRemaining >= bidAmountRaw
                                        //const budgetPct = Math.round((team.budgetRemaining / team.totalBudget) * 100)

                                        return (
                                            <button
                                                key={team._id}
                                                onClick={() => setSelectedTeamName(team.name)}
                                                //disabled={!affordable}
                                                className={`
                                                    relative flex items-center gap-4 p-3.5 rounded-xl border-2 text-left w-full
                                                    transition-all duration-150 active:scale-[0.98]
                                                    ${isSelected
                                                        ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                                                        : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                                                    }
                                                `}
                                            >
                                                <div className={`size-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0
                                                    ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}`}
                                                >
                                                    {team.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <p className={`text-xs font-bold truncate leading-none
                                                            ${isSelected ? "text-indigo-700" : "text-slate-800"}`}
                                                        >
                                                            {team.name}
                                                        </p>
                                                        {/* <span className={`text-[10px] font-black shrink-0
                                                            ${affordable ? "text-emerald-600" : "text-rose-400"}`}
                                                        >
                                                            {formatBudget(team.budgetRemaining)} left
                                                        </span> */}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate mb-1.5">
                                                        C: {team.captainName} · M: {team.managerName}
                                                    </p>
                                                    {/* <div className="h-1 w-full rounded-full bg-slate-200 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${budgetPct > 50 ? "bg-emerald-400" : budgetPct > 25 ? "bg-amber-400" : "bg-rose-400"}`}
                                                            style={{ width: `${budgetPct}%` }}
                                                        />
                                                    </div> */}
                                                </div>
                                                <div className="shrink-0 text-center">
                                                    <span className={`text-[9px] font-black px-2 py-1 rounded-full
                                                        ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"}`}
                                                    >
                                                        {team.players.length}P
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <CheckCircle
                                                        size={16}
                                                        weight="fill"
                                                        className="absolute top-2.5 right-2.5 text-indigo-500"
                                                    />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Summary strip */}
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
                                        {/* <p className="text-[9px] text-emerald-500 font-bold">
                                            {formatBudget(selectedTeam.budgetRemaining - bidAmountRaw)} remaining after
                                        </p> */}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-1">
                            <Button
                                variant="ghost"
                                className="flex-1 rounded-xl text-slate-400 font-bold text-xs h-11 hover:bg-slate-50"
                                onClick={() => {
                                    setSaleDialogOpen(false)
                                    setAmountConfirmOpen(true) // ← go back to step 1
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                disabled={!selectedTeamName}
                                className="flex-[2] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-11 shadow-lg shadow-emerald-100 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-40"
                                onClick={handleFinalSale}
                            >
                                <CheckCircle size={16} weight="fill" className="mr-2" />
                                {isSellMutatePending ? `Selling to ${selectedTeamName?.toUpperCase() || "FRANCHISE"}...` : `SOLD TO ${selectedTeamName?.toUpperCase() || "FRANCHISE"}`}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* --- COMPACT STATS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                <StatCard icon={<Target size={18} weight="duotone" />} label="Strategic Role" value={player.role || "All-Rounder"} color="bg-rose-50 text-rose-600" />
                <StatCard icon={<GenderIntersex size={18} weight="duotone" />} label="Gender" value={player.gender.toUpperCase()} color="bg-blue-50 text-blue-600" />
                <StatCard icon={<Wallet size={18} weight="duotone" />} label="Base Price" value={player.basePrice === 0 ? "Free Agent" : `₹${player.basePrice.toLocaleString()}L`} color="bg-amber-50 text-amber-600" />
                <StatCard icon={<Tag size={18} weight="duotone" />} label="Sold Price" value={player.finalAmount ? `₹${player.finalAmount.toLocaleString()}L` : "Active"} color="bg-emerald-50 text-emerald-600" />
                <StatCard icon={<ShieldCheck size={18} weight="duotone" />} label="Franchise" value={player.soldTo || "Unassigned"} color="bg-indigo-50 text-indigo-600" />
                <StatCard icon={<GradientIcon size={18} weight="duotone" />} label="Grade" value={player.grade || "Unassigned"} color="bg-indigo-50 text-indigo-600" />

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