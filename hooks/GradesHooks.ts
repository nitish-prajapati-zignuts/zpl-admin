import { useMemo } from "react";
import { Player, GRADES, Grade } from "../app/types/types";

export const useFilteredPlayers = (players: Player[], search: string) => {
    return useMemo(() => {
        return players
            .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [players, search]);
};

export const usePlayerStats = (players: Player[]) => {
    return useMemo(() => {
        return GRADES.reduce((acc, g) => {
            acc[g] = players.filter((p) => p.grade === g).length;
            return acc;
        }, {} as Record<Grade, number>);
    }, [players]);
};