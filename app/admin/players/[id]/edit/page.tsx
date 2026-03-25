"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Check,
    User,
    Users,
    CurrencyCircleDollar,
} from "@phosphor-icons/react"
import { useGetPlayerById, useUpdatePlayer, useGetTeams } from "@/app/services/query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface PageProps {
    params: Promise<{ id: string }>
}

export default function EditPlayerPage({ params }: PageProps) {
    const resolvedParams = React.use(params)
    const id = resolvedParams.id
    const router = useRouter()

    // 1. Data Fetching
    const { data: playerData, isLoading: isFetching } = useGetPlayerById(id)
    const { data: teamsData, isLoading: isFetchingTeams } = useGetTeams()
    const player = playerData?.data
    const teams = teamsData?.data || []

    // 2. Mutation
    const { mutate: updatePlayer, isPending: isUpdating } = useUpdatePlayer(id, () => {
        router.push(`/admin/players/${id}`)
    })

    // 3. Form State
    const [formData, setFormData] = React.useState({
        name: "",
        soldTo: "",
        finalAmount: 0,
    })

    // 4. Seed Form Data
    React.useEffect(() => {
        if (player) {
            setFormData({
                name: player.name || "",
                soldTo: player.soldTo || "none",
                finalAmount: (player.finalAmount || 0) / 100000,
            })
        }
    }, [player])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const submissionData: any = {
            name: formData.name,
            finalAmount: formData.finalAmount * 100000,
        }

        if (formData.soldTo && formData.soldTo !== "none") {
            submissionData.soldTo = formData.soldTo
            submissionData.status = "sold"
        } else {
            submissionData.soldTo = null
            submissionData.status = player?.status || "pending"
        }

        console.log(submissionData)

        updatePlayer(submissionData)
    }

    if (isFetching || isFetchingTeams) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                    <p className="text-sm font-medium text-slate-500 animate-pulse">Loading data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12 text-slate-900">
            <div className="max-w-2xl mx-auto">
                {/* Simple Back Navigation */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-8 hover:bg-white/50 text-slate-500 rounded-lg group transition-all"
                    onClick={() => router.push(`/admin/players/${id}`)}
                >
                    <ArrowLeft size={16} weight="bold" className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Player
                </Button>

                <Card className="border-none shadow-2xl shadow-indigo-100/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md">
                    <CardHeader className="bg-indigo-600 text-white p-8">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
                                {formData.name?.charAt(0) || "?"}
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black tracking-tight leading-none mb-1">
                                    Edit Settings
                                </CardTitle>
                                <CardDescription className="text-indigo-100/80 font-medium">
                                    Update player status and assignment
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        disabled
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-600 transition-all font-bold text-lg"
                                        placeholder="Player Name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Team Selection */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Assigned Team</label>
                                <Select
                                    value={formData.soldTo}
                                    onValueChange={(val: string) => setFormData({ ...formData, soldTo: val })}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 font-bold text-slate-700">
                                        <div className="flex items-center gap-3">
                                            <Users size={18} className="text-indigo-600" />
                                            <SelectValue placeholder="Select Team" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                                        <SelectItem value="none" className="font-bold text-slate-400 italic">No Team (Pending)</SelectItem>
                                        {teams.map((team) => (
                                            <SelectItem key={team._id} value={team.name} className="font-bold">
                                                {team.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Final Amount (in Lakhs)</label>
                                <div className="relative group bg-amber-50 rounded-2xl overflow-hidden border-2 border-amber-100 focus-within:border-amber-400 transition-all">
                                    <div className="absolute left-0 top-0 h-full w-14 bg-amber-100 flex items-center justify-center font-black text-amber-600 text-xl">
                                        ₹
                                    </div>
                                    <Input
                                        type="number"
                                        value={formData.finalAmount}
                                        onChange={(e) => setFormData({ ...formData, finalAmount: parseFloat(e.target.value) || 0 })}
                                        className="pl-16 h-16 bg-transparent border-none focus-visible:ring-0 text-amber-900 font-black text-2xl"
                                        placeholder="0.00"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-amber-600/50 uppercase text-xs tracking-widest">
                                        LAKHS
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50"
                                    onClick={() => router.push(`/admin/players/${id}`)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-2 px-10 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-white shadow-lg shadow-indigo-200 transition-all"
                                >
                                    {isUpdating ? (
                                        <div className="flex items-center gap-2">
                                            <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-lg">
                                            <Check size={20} weight="bold" />
                                            <span>Update Player</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}