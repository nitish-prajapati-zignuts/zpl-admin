import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { editPlayerDetails, getPlayerById, getPlayers, getTeams, onBlockCall, onCancelSetToPending, onSellConfirmation, onSetUnsold } from "../api/action"
import { PlayersResponse, SinglePlayer, Teams } from "../types/types"


export const useGetPlayers = () => {
    return useQuery<PlayersResponse>({
        queryKey: ["players"],
        queryFn: () => getPlayers(),
        refetchInterval: 0
    })
}

export const useGetPlayerById = (id: string) => {
    return useQuery<SinglePlayer>({
        queryKey: ["player", id],
        queryFn: () => getPlayerById(id),
        refetchInterval: 0
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
            queryClient.invalidateQueries({ queryKey: ['players'] })

            onSuccess?.()
        },

    })
}

export const useOnSellConfirmation = ({ id, teamName, soldAmount }: { id: string, teamName: string, soldAmount: number }, options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) => {
    const queryClient = useQueryClient()

    return useMutation<SinglePlayer>({
        mutationKey: ["player", id],
        mutationFn: () => onSellConfirmation(id, teamName, soldAmount),
        // onSuccess: () => {
        //     queryClient.invalidateQueries({ queryKey: ["player", id] })
        //     queryClient.invalidateQueries({ queryKey: ['players'] })
        //     onSuccess?.()
        // }
        ...options
    })
}

export const useGetTeams = () => {
    return useQuery<Teams>({
        queryKey: ['teams'],
        queryFn: () => getTeams(),
        refetchInterval: 0
    })
}

export const useUpdatePlayer = (id: string, onSuccess?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["player", id],
        mutationFn: (data: any) => editPlayerDetails(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["player", id] })
            queryClient.invalidateQueries({ queryKey: ["players"] })
            onSuccess?.()
        }
    })
}

export const useSetOnUnsold = (id: string, options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["player", id],
        mutationFn: () => onSetUnsold(id),
        ...options,
    })
}

// export const useCancelSetToPending = (id: string, onSuccess?: () => void) => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationKey: ["player", id],
//         mutationFn: () => onCancelSetToPending(id),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["player", id] })
//             queryClient.invalidateQueries({ queryKey: ["players"] })
//             onSuccess?.()
//         }
//     })
// }

export const useCancelSetToPending = (
    id: string,
    options?: {
        onSuccess?: () => void;
        onError?: (error: unknown) => void;
    }
) => {
    return useMutation({
        mutationKey: ["player", id],
        mutationFn: () => onCancelSetToPending(id),
        ...options,
    });
};