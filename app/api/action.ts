const BASE_URL = "https://mikki-noncredent-darius.ngrok-free.dev/api";
const NGROK_HEADERS = { "ngrok-skip-browser-warning": "69420" };

export const getPlayers = async () => {
    const response = await fetch(`${BASE_URL}/players`, { headers: NGROK_HEADERS });
    if (!response.ok) {
        throw new Error("Failed to fetch players");
    }
    return response.json();
}

export const getPlayerById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/players/${id}`, { headers: NGROK_HEADERS });
    if (!response.ok) {
        throw new Error("Failed to fetch player");
    }
    return response.json();
}