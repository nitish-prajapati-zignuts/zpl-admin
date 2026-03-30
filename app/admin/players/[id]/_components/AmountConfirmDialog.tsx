"use client"

import { Warning, CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { formatNumber, parseNumber } from "@/app/constants"


interface AmountConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    player: any
    bidAmount: number
    editableAmount: number | string
    setEditableAmount: (val: number | string) => void
    onConfirm: () => void
}

export function AmountConfirmDialog({
    open,
    onOpenChange,
    player,
    bidAmount,
    editableAmount,
    setEditableAmount,
    onConfirm,
}: AmountConfirmDialogProps) {
    const isDisabled =
        editableAmount === "" ||
        (typeof editableAmount === "number" && (editableAmount <= 0 || editableAmount < (player.basePrice ?? 0))) ||
        (typeof editableAmount === "string" && parseFloat(editableAmount) < (player.basePrice ?? 0))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = parseNumber(e.target.value)
        if (raw === "") {
            setEditableAmount("")
        } else {
            const num = parseFloat(raw)
            if (!isNaN(num) && num >= 0) setEditableAmount(num)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const val = typeof editableAmount === "string" ? parseFloat(editableAmount) : editableAmount
            if (!isNaN(val) && val >= (player.basePrice ?? 0)) onConfirm()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
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
                        Press{" "}
                        <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-600">
                            Enter ↵
                        </kbd>{" "}
                        or click confirm. This amount cannot be changed after proceeding.
                    </p>

                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-xl text-slate-400 font-bold text-xs h-12 hover:bg-slate-50"
                            onClick={() => onOpenChange(false)}
                        >
                            Go Back
                        </Button>
                        <Button
                            disabled={isDisabled}
                            className="flex-[2] rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs h-12 shadow-lg shadow-amber-100 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-40"
                            onClick={onConfirm}
                        >
                            <CheckCircle size={16} weight="fill" className="mr-2" />
                            YES, ₹{editableAmount}L IS CORRECT
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}