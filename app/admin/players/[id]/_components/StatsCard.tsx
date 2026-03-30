import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string
    color: string
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
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