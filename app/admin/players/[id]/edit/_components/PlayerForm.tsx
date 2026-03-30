"use client"

import { User, Users, Check } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { PlayerAmountInput } from "./PlayerAmountInput"

export const PlayerForm = ({
    form,
    updateField,
    handleSubmit,
    teams,
    player,
    isPending,
    onCancel
}: any) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
                <label className="text-xs text-slate-400">Name</label>
                <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input disabled value={form.name} className="pl-10" />
                </div>
            </div>

            {/* Team */}
            {/* <div>
                <label className="text-xs text-slate-400">Team</label>
                <Select
                    disabled={player?.isCaptain}
                    value={player.soldTo || form.soldTo}
                    onValueChange={(val) => updateField("soldTo", val)}
                >
                    <SelectTrigger>
                        <Users size={16} className="mr-2" />
                        <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No Team</SelectItem>
                        {teams.map((team: any) => (
                            <SelectItem key={team._id} value={team.name}>
                                {team.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div> */}

            <div>
                <label className="text-xs text-slate-400">Team</label>
                <Select
                    disabled={player?.isCaptain}
                    // Use form.soldTo as the source of truth for the UI
                    value={form.soldTo}
                    onValueChange={(val) => updateField("soldTo", val)}
                >
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-slate-400" />
                            <SelectValue placeholder="Select team" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No Team</SelectItem>
                        {teams.map((team: any) => (
                            <SelectItem key={team._id} value={team.name}>
                                {team.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Amount */}
            <PlayerAmountInput
                value={form.finalAmount}
                onChange={(val) => updateField("finalAmount", val)}
            />

            {/* Actions */}
            <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                    Cancel
                </Button>

                <Button type="submit" disabled={isPending} className="flex-1 bg-indigo-600 text-white">
                    {isPending ? "Saving..." : (
                        <div className="flex items-center gap-2">
                            <Check size={18} />
                            Update
                        </div>
                    )}
                </Button>
            </div>

        </form>
    )
}