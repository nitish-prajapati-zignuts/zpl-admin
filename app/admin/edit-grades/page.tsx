"use client";

import { useGetPlayers, useBulkSetGradeMutation } from "@/app/services/query";
import React, { useState, useMemo, useEffect } from "react";

const GRADES = ["A", "B", "C", "D"] as const;
type Grade = (typeof GRADES)[number];
type Status = "pending" | "sold" | "on_block";

interface Player {
    _id: string;
    name: string;
    gender: "male" | "female";
    grade: Grade;
    role: string;
    basePrice: number;
    status: Status;
    soldTo: string | null;
    photoUrl: string | null;
}

const GRADE_THEME: Record<Grade, string> = {
    A: "bg-green-100 text-green-700",
    B: "bg-blue-100 text-blue-700",
    C: "bg-yellow-100 text-yellow-700",
    D: "bg-gray-100 text-gray-700",
};

export default function PlayerGradeManager() {
    const { data, isLoading } = useGetPlayers();
    const { mutateAsync } = useBulkSetGradeMutation();
    const [players, setPlayers] = useState<Player[]>([]);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (data?.data) {
            const safePlayers: Player[] = data.data.map((p: any) => ({
                _id: p._id,
                name: p.name,
                gender: p.gender,
                role: p.role,
                basePrice: p.basePrice,
                status: p.status,
                soldTo: p.soldTo ?? null,
                photoUrl: p.photoUrl ?? null,
                grade: GRADES.includes(p.grade) ? p.grade : "D",
            }));

            setPlayers(safePlayers);
        }
    }, [data]);

    const filtered = useMemo(() => {
        return players
            .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [players, search]);

    const stats = useMemo(() => {
        return GRADES.reduce((acc, g) => {
            acc[g] = players.filter((p) => p.grade === g).length;
            return acc;
        }, {} as Record<Grade, number>);
    }, [players]);

    const handleBulkGrade = (newGrade: Grade) => {
        setPlayers((prev) =>
            prev.map((p) =>
                selectedIds.has(p._id) ? { ...p, grade: newGrade } : p
            )
        );
        setSelectedIds(new Set());
    };

    const toggleId = (id: string) => {
        const next = new Set(selectedIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedIds(next);
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            // 1. Identify which players actually changed grade
            const originalPlayersMap = new Map((data?.data || []).map((p: any) => [p._id, p.grade]));
            const changedPlayers = players.filter(p => p.grade !== originalPlayersMap.get(p._id));

            if (changedPlayers.length === 0) {
                alert("No changes to save.");
                setIsSaving(false);
                return;
            }

            const gradeGroups: Record<Grade, string[]> = { A: [], B: [], C: [], D: [] };
            changedPlayers.forEach(p => {
                gradeGroups[p.grade].push(p._id);
            });

            const updatePromises = GRADES
                .filter(g => gradeGroups[g].length > 0)
                .map(g => mutateAsync({ grade: g, playerIds: gradeGroups[g] }));

            await Promise.all(updatePromises);
            alert("Grades updated successfully")
            // alert(`Successfully updated grades for ${changedPlayers.length} players.`);
        } catch (error) {
            console.error("Failed to save grade changes:", error);
            alert("Error saving some changes. Please check console.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading Roster...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans">
            {/* Header */}
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
                    onClick={handleSave}
                    className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
                >
                    {isSaving ? "Adding New Changes..." : "Add "}
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-3 mb-4">
                <input
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex items-center gap-2 bg-gray-50 px-4 rounded-xl border">
                    <span className="text-sm font-semibold text-gray-500">
                        Set Grade:
                    </span>
                    <div className="flex gap-1.5">
                        {GRADES.map((g) => (
                            <button
                                key={g}
                                onClick={() => handleBulkGrade(g)}
                                disabled={selectedIds.size === 0}
                                className={[
                                    "w-9 h-9 rounded-lg border text-sm font-bold transition-all",
                                    selectedIds.size > 0
                                        ? "bg-white hover:bg-gray-100 border-gray-300 shadow-sm active:scale-95 text-gray-900"
                                        : "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                                ].join(" ")}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                        <tr>
                            <th className="p-3 w-10"></th>
                            <th className="p-3">Player Detail</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Grade</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Base Price</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((p) => (
                            <tr
                                key={p._id}
                                className={`border-t transition-all cursor-pointer ${
                                    selectedIds.has(p._id)
                                        ? "bg-blue-50/70 border-blue-100"
                                        : "hover:bg-gray-50/80"
                                }`}
                                onClick={() => toggleId(p._id)}
                            >
                                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(p._id)}
                                        onChange={() => toggleId(p._id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>

                                <td className="p-3 font-semibold text-gray-900">
                                    {p.name}
                                </td>

                                <td className="p-3 text-sm capitalize">
                                    {p.role}
                                </td>

                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-bold ${GRADE_THEME[p.grade]}`}
                                    >
                                        Grade {p.grade}
                                    </span>
                                </td>

                                <td className="p-3 text-sm">
                                    <span
                                        className={
                                            p.status === "sold"
                                                ? "text-green-600"
                                                : p.status === "on_block"
                                                    ? "text-yellow-600"
                                                    : "text-gray-500"
                                        }
                                    >
                                        ● {p.status.replace("_", " ")}
                                    </span>
                                </td>

                                <td className="p-3 text-right font-bold font-mono">
                                    ₹{p.basePrice.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}