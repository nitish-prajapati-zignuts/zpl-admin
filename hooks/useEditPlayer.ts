// "use client"


import * as React from "react"
import { useRouter } from "next/navigation"
import {
    useGetPlayerById,
    useUpdatePlayer,
    useGetTeams
} from "@/app/services/query"

// export const useEditPlayer = (id: string) => {
//     const router = useRouter()

//     const { data: playerRes, isLoading: isPlayerLoading } = useGetPlayerById(id)
//     const { data: teamsRes, isLoading: isTeamsLoading } = useGetTeams()

//     const player = playerRes?.data
//     const teams = teamsRes?.data || []

//     const { mutate, isPending } = useUpdatePlayer(id, () => {
//         router.push(`/admin/players/${id}`)
//     })

//     const [form, setForm] = React.useState({
//         name: "",
//         soldTo: "none",
//         finalAmount: 0,
//     })

//     const resolveTeam = React.useCallback(() => {
//         if (!player?.soldTo) return "none"

//         const found = teams.find(
//             t => t._id === player.soldTo || t.name === player.soldTo
//         )

//         return found?.name || player.soldTo
//     }, [player, teams])

//     React.useEffect(() => {
//         if (!player) return

//         setForm({
//             name: player.name || "",
//             soldTo: resolveTeam(),
//             finalAmount: (player.finalAmount || 0) / 100000,
//         })
//     }, [player, resolveTeam])

//     const updateField = (key: string, value: any) => {
//         setForm(prev => ({ ...prev, [key]: value }))
//     }

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()

//         const isSold = form.soldTo !== "none"

//         mutate({
//             name: form.name,
//             finalAmount: form.finalAmount * 100000,
//             soldTo: isSold ? form.soldTo : player?.soldTo,
//             status: isSold ? "sold" : player?.status || "pending",
//         })
//     }

//     return {
//         form,
//         updateField,
//         handleSubmit,
//         teams,
//         player,
//         isLoading: isPlayerLoading || isTeamsLoading,
//         isPending,
//     }
// }

export const useEditPlayer = (id: string) => {
    const router = useRouter()
    const { data: playerRes, isLoading: isPlayerLoading } = useGetPlayerById(id)
    const { data: teamsRes, isLoading: isTeamsLoading } = useGetTeams()

    const player = playerRes?.data
    const teams = teamsRes?.data || []

    const [form, setForm] = React.useState({
        name: player?.name,
        soldTo: player?.soldTo,
        finalAmount: player?.finalAmount ?? 0,
    })

    // Helper to find the correct team name/ID
    const resolveTeam = React.useCallback((p: any) => {
        if (!p?.soldTo) return "none"
        const found = teams.find(t => t._id === p.soldTo || t.name === p.soldTo)
        return found?.name || p.soldTo
    }, [teams])

    // Only initialize form when player data arrives for the first time
    React.useEffect(() => {
        if (player && teams.length > 0) {
            setForm({
                name: player.name || "",
                soldTo: resolveTeam(player),
                finalAmount: (player.finalAmount || 0) / 100000,
            })
        }
    }, [player, teams.length]); // Remove resolveTeam from deps to avoid loops

    const updateField = (key: string, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const { mutate, isPending } = useUpdatePlayer(id, () => {
        router.push(`/admin/players/${id}`)
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate({
            ...form,
            finalAmount: form.finalAmount * 100000,
            status: form.soldTo !== "none" ? "sold" : "pending"
        })
    }

    return { form, updateField, handleSubmit, teams, player, isPending, isLoading: isPlayerLoading || isTeamsLoading }
}