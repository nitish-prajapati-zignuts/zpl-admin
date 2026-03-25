import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getPlayerById, getPlayers, onBlockCall } from "../api/action"
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

// export const useOnBlockCall = (id: string) => {
//     return useMutation<SinglePlayer>({
//         mutationKey: ["player", id],
//         mutationFn: () => onBlockCall(id),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["player", id] })
//         }
//     })
// }
export const useOnBlockCall = (id: string, onSuccess?: () => void) => {
    const queryClient = useQueryClient()

    return useMutation<SinglePlayer>({
        mutationKey: ["player", id],
        mutationFn: () => onBlockCall(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["player", id] })
            onSuccess?.()
        }
    })
}


