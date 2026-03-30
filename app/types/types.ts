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
    isAuctionable: boolean,
    isCaptain: boolean,
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

export const GRADES = ["A", "B", "C", "D"] as const;

export type Grade = (typeof GRADES)[number];
export type Status = "pending" | "sold" | "on_block";

export interface PlayerGrading {
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