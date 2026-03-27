import axios from "axios";

//const BASE_URL = "https://mikki-noncredent-darius.ngrok-free.dev/api";
const BASE_URL = "https://zpl-4h67.onrender.com/api"
const NGROK_HEADERS = { "ngrok-skip-browser-warning": "69420" };

const zplApi = axios.create({
    baseURL: BASE_URL
    //headers: NGROK_HEADERS,
});

export const getPlayers = async () => {
    try {
        const response = await zplApi.get("/players");
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch players");
    }
}

export const getPlayerById = async (id: string) => {
    try {
        const response = await zplApi.get(`/players/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch player");
    }
}

export const onBlockCall = async (id: string) => {
    try {
        const response = await zplApi.patch(`/players/${id}/on-block`);
        return response.data;
    } catch (error: any) {
        console.log(error.response.data.message)
        throw new Error(error.response?.data?.message || "Failed to block player");
    }
}

export const onSellConfirmation = async (id: string, teamName: string, soldAmount: number) => {
    const update = {
        soldTo: teamName,
        finalAmount: soldAmount
    }

    try {
        const response = await zplApi.patch(`/players/${id}/sell`, update);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to sell player");
    }
}

export const getTeams = async () => {
    try {
        const response = await zplApi.get("/teams");
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to load teams");
    }
}

export const editPlayerDetails = async (id: string, data: any) => {
    try {
        const response = await zplApi.patch(`/players/${id}`, data);
        return response.data;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.response?.data?.message || "Failed to edit player");
    }
}

export const onCancelSetToPending = async (id: string) => {
    try {
        const response = await zplApi.patch(`/players/${id}/reset`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to cancel player");
    }
}

export const onSetUnsold = async (id: string) => {
    try {
        const response = await zplApi.patch(`/players/${id}/unsold`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to mark Unsold player");
    }
}