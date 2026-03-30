import { Plus, Minus } from "@phosphor-icons/react"

interface BidStepButtonsProps {
    steps: number[]
    onIncrement: (step: number) => void
    onDecrement: (step: number) => void
    minBid: number
    currentBid: number
}

export function BidStepButtons({ steps, onIncrement, onDecrement, minBid, currentBid }: BidStepButtonsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                    <Plus size={10} weight="bold" /> Raise Bid
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {steps.map((step) => (
                        <button
                            key={`+${step}`}
                            onClick={() => onIncrement(step)}
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
                    {steps.map((step) => (
                        <button
                            key={`-${step}`}
                            onClick={() => onDecrement(step)}
                            disabled={currentBid - step < minBid}
                            className="rounded-xl border-2 border-rose-100 bg-rose-50/50 hover:bg-rose-500 hover:border-rose-500 hover:text-white text-rose-600 font-black text-xs py-3 transition-all active:scale-95 disabled:opacity-20 shadow-sm"
                        >
                            -{step}L
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}