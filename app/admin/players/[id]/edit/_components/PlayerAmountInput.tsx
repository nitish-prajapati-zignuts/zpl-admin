import { Input } from "@/components/ui/input"

interface Props {
    value: number
    onChange: (val: number) => void
}

export const PlayerAmountInput = ({ value, onChange }: Props) => {
    return (
        <div className="space-y-2">
            <label className="text-xs text-slate-400">Final Amount (Lakhs)</label>

            <div className="relative bg-amber-50 rounded-2xl border-2 border-amber-100">
                <div className="absolute left-0 top-0 h-full w-14 bg-amber-100 flex items-center justify-center font-bold text-amber-600">
                    ₹
                </div>

                <Input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    className="pl-16 h-14 bg-transparent border-none text-xl font-bold"
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-amber-600">
                    LAKHS
                </div>
            </div>
        </div>
    )
}