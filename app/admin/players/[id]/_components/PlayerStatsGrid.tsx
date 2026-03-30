import { Tag, GenderIntersex, Wallet, ShieldCheck, Target, GradientIcon } from "@phosphor-icons/react"
import { StatCard } from "./StatsCard"

interface PlayerStatsGridProps {
    player: any
}

export function PlayerStatsGrid({ player }: PlayerStatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <StatCard
                icon={<Target size={18} weight="duotone" />}
                label="Strategic Role"
                value={player.role || "All-Rounder"}
                color="bg-rose-50 text-rose-600"
            />
            <StatCard
                icon={<GenderIntersex size={18} weight="duotone" />}
                label="Gender"
                value={player.gender.toUpperCase()}
                color="bg-blue-50 text-blue-600"
            />
            <StatCard
                icon={<Wallet size={18} weight="duotone" />}
                label="Base Price"
                value={player.basePrice === 0 ? "Free Agent" : `₹${player.basePrice.toLocaleString()}L`}
                color="bg-amber-50 text-amber-600"
            />
            <StatCard
                icon={<Tag size={18} weight="duotone" />}
                label="Sold Price"
                value={player.finalAmount ? `₹${player.finalAmount.toLocaleString()}L` : "Active"}
                color="bg-emerald-50 text-emerald-600"
            />
            <StatCard
                icon={<ShieldCheck size={18} weight="duotone" />}
                label="Franchise"
                value={player.soldTo || "Unassigned"}
                color="bg-indigo-50 text-indigo-600"
            />
            <StatCard
                icon={<GradientIcon size={18} weight="duotone" />}
                label="Grade"
                value={player.grade || "Unassigned"}
                color="bg-indigo-50 text-indigo-600"
            />
        </div>
    )
}