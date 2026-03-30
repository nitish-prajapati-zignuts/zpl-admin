"use client"

import { ArrowLeft } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useEditPlayer } from "@/hooks/useEditPlayer"
import { PlayerForm } from "./_components/PlayerForm"
import { PlayerHeader } from "./_components/PlayerHeader"
import { use } from "react"


interface Props {
    params: Promise<{ id: string }>
}

export default function Page({ params }: Props) {
    const { id } = use(params)
    const router = useRouter()

    const {
        form,
        updateField,
        handleSubmit,
        teams,
        player,
        isLoading,
        isPending
    } = useEditPlayer(id)

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>

    console.log(form)

    return (
        <div className="min-h-screen p-6 bg-slate-50">
            <div className="max-w-2xl mx-auto">

                <Button variant="ghost" onClick={() => router.push(`/admin/players/${id}`)}>
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                </Button>

                <Card className="mt-6 rounded-2xl shadow-xl overflow-hidden">
                    <PlayerHeader name={form.name || ""} />

                    <CardContent className="p-6">
                        <PlayerForm
                            form={form}
                            updateField={updateField}
                            handleSubmit={handleSubmit}
                            teams={teams}
                            player={player}
                            isPending={isPending}
                            onCancel={() => router.push(`/admin/players/${id}`)}
                        />
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}