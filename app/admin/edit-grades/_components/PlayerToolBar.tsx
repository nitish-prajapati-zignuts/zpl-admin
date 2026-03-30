import { GRADES, Grade } from "@/app/types/types";


type Props = {
    search: string;
    setSearch: (v: string) => void;
    onBulkGrade: (g: Grade) => void;
    selectedCount: number;
};

export default function PlayerToolbar({
    search,
    setSearch,
    onBulkGrade,
    selectedCount,
}: Props) {
    return (
        <div className="flex gap-3 mb-4">
            <input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border"
            />

            <div className="flex items-center gap-2 bg-gray-50 px-4 rounded-xl border">
                <span className="text-sm font-semibold text-gray-500">
                    Set Grade:
                </span>

                <div className="flex gap-1.5">
                    {GRADES.map((g) => (
                        <button
                            key={g}
                            onClick={() => onBulkGrade(g)}
                            disabled={selectedCount === 0}
                            className="w-9 h-9 rounded-lg border text-sm font-bold"
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}