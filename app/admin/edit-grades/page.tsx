"use client";

import React, { useState, useEffect } from "react";
import { useGetPlayers, useBulkSetGradeMutation } from "@/app/services/query";

import { Player, GRADES, Grade } from "@/app/types/types";

import PlayerHeader from "./_components/PlayerHeader";
import PlayerToolbar from "./_components/PlayerToolBar";
import PlayerTable from "./_components/PlayerTable";
import { useFilteredPlayers, usePlayerStats } from "@/hooks/GradesHooks";

export default function PlayerGradeManager() {
    const { data, isLoading } = useGetPlayers();
    const { mutateAsync } = useBulkSetGradeMutation();

    const [players, setPlayers] = useState<Player[]>([]);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (data?.data) {
            setPlayers(data.data);
        }
    }, [data]);

    const filtered = useFilteredPlayers(players, search);
    const stats = usePlayerStats(players);

    const toggleId = (id: string) => {
        const next = new Set(selectedIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedIds(next);
    };

    const handleBulkGrade = (grade: any) => {
        setPlayers((prev) =>
            prev.map((p) =>
                selectedIds.has(p._id) ? { ...p, grade } : p
            )
        );
        setSelectedIds(new Set());
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            const originalPlayersMap = new Map((data?.data || []).map((p: any) => [p._id, p.grade]));
            const changedPlayers = players.filter(p => p.grade !== originalPlayersMap.get(p._id));

            if (changedPlayers.length === 0) {
                alert("No changes to save.");
                setIsSaving(false);
                return;
            }

            const gradeGroups: Record<Grade, string[]> = { A: [], B: [], C: [], D: [] };
            changedPlayers.forEach(p => {
                gradeGroups[p.grade as Grade].push(p._id);
            });

            const updatePromises = GRADES
                .filter(g => gradeGroups[g].length > 0)
                .map(g => mutateAsync({ grade: g, playerIds: gradeGroups[g] }));

            await Promise.all(updatePromises);
            alert("Grades updated successfully")
        } catch (error) {
            console.error("Failed to save grade changes:", error);
            alert("Error saving some changes. Please check console.");
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <PlayerHeader stats={stats} onSave={handleSave} isSaving={isSaving} />

            <PlayerToolbar
                search={search}
                setSearch={setSearch}
                onBulkGrade={handleBulkGrade}
                selectedCount={selectedIds.size}
            />

            <PlayerTable
                players={filtered}
                selectedIds={selectedIds}
                toggleId={toggleId}
            />
        </div>
    );
}