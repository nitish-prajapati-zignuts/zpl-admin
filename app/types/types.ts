export interface Player {
    _id: string;
    name: string;
    gender: "male" | "female";
    basePrice: number;
    status: "pending" | "sold" | "unsold"; // extend if needed
    soldTo: string | null;
    finalAmount: number | null;
    isRetained: boolean;
    photoUrl: string | null;
    __v: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

export interface PlayersResponse {
    success: boolean;
    count: number;
    data: Player[];
}

export interface SinglePlayer {
    success: boolean
    data: Player & "role"
}