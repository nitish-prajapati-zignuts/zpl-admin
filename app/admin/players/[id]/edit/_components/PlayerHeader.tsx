import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const PlayerHeader = ({ name }: { name: string }) => {
    return (
        <CardHeader className="bg-indigo-600 text-white p-8">
            <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
                    {name?.charAt(0) || "?"}
                </div>
                <div>
                    <CardTitle className="text-2xl font-black">
                        Edit Settings
                    </CardTitle>
                    <CardDescription className="text-indigo-100/80">
                        Update player status and assignment
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
    )
}