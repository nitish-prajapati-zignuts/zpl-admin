import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PlayerAuditCardsProps {
    player: any
}

export function PlayerAuditCards({ player }: PlayerAuditCardsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl bg-white">
                <CardHeader className="px-6 py-4 border-b border-slate-50">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scout Report</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-sm text-slate-600 font-medium leading-relaxed italic">
                    Onboarded into ZPL on {new Date(player.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}.
                    The player is currently categorized as{" "}
                    <span className="text-indigo-600 font-bold uppercase">{player.status}</span>.
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl bg-white">
                <CardHeader className="px-6 py-4 border-b border-slate-50">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Trail</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-400 uppercase">Registered</span>
                        <span className="font-mono font-bold text-slate-700">{new Date(player.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-400 uppercase">Last Sync</span>
                        <span className="font-mono font-bold text-slate-700">{new Date(player.updatedAt).toLocaleDateString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}