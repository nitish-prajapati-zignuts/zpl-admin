import { useQuery } from "@tanstack/react-query"
import { getPlayerById, getPlayers } from "../api/action"
import { PlayersResponse, SinglePlayer } from "../types/types"

export const useGetPlayers = () => {
    return useQuery<PlayersResponse>({
        queryKey: ["players"],
        queryFn: () => getPlayers(),
    })
}

export const useGetPlayerById = (id: string) => {
    return useQuery<SinglePlayer>({
        queryKey: ["player", id],
        queryFn: () => getPlayerById(id),
    })
}




