import { GRADE_THEME } from "@/app/constants";
import { GRADES, Grade } from "@/app/types/types";

type Props = {
    stats: Record<Grade, number>;
    onSave: () => void;
    isSaving: boolean;
};

export default function PlayerHeader({ stats, onSave, isSaving }: Props) {
    return (
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                    Player Management
                </h1>

                <div className="flex gap-3 mt-3">
                    {GRADES.map((g) => (
                        <div
                            key={g}
                            className={`px-3 py-1 rounded-md text-xs font-bold ${GRADE_THEME[g]}`}
                        >
                            {g}: {stats[g]}
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onSave}
                className="bg-black text-white px-6 py-2 rounded-lg font-semibold"
            >
                {isSaving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}