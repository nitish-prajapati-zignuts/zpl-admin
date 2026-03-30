import { CheckCircle } from "@phosphor-icons/react"
import { Team } from "@/app/types/types"

interface TeamCardProps {
    team: Team
    isSelected: boolean
    onSelect: () => void
}

export function TeamCard({ team, isSelected, onSelect }: TeamCardProps) {
    return (
        <button
            onClick={onSelect}
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
                    <p className={`text-xs font-bold truncate leading-none ${isSelected ? "text-indigo-700" : "text-slate-800"}`}>
                        {team.name}
                    </p>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate mb-1.5">
                    C: {team.captainName} · M: {team.managerName}
                </p>
            </div>
            <div className="shrink-0 text-center">
                <span className={`text-[9px] font-black px-2 py-1 rounded-full
                    ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"}`}
                >
                    {team.players.length}P
                </span>
            </div>
            {isSelected && (
                <CheckCircle size={16} weight="fill" className="absolute top-2.5 right-2.5 text-indigo-500" />
            )}
        </button>
    )
}