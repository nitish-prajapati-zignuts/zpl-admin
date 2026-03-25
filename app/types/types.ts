export interface Player {
    _id: string;
    name: string;
    gender: "male" | "female";
    basePrice: number;
    status: "pending" | "sold" | "unsold" | "on_block"; // extend if needed
    soldTo: string | null;
    grade: string
    finalAmount: number | null;
    isRetained: boolean;
    role: string,
    isAuctionable: boolean
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
    data: Player
}

export interface Team {
    _id: string
    name: string
    captainName: string
    managerName: string
    totalBudget: number
    budgetRemaining: number
    players: Player[]
    __v: number
    createdAt: string
    updatedAt: string
}


export interface Teams {
    success: boolean
    count: number
    data: Team[]
}

