import { Grade } from "../types/types";


export const GRADE_THEME: Record<Grade, string> = {
    A: "bg-green-100 text-green-700",
    B: "bg-blue-100 text-blue-700",
    C: "bg-yellow-100 text-yellow-700",
    D: "bg-gray-100 text-gray-700",
};

export const BID_STEPS = [50000, 100000, 200000]

export const formatNumber = (value: number | string): string => {
    if (value === "" || value === null) return ""
    return new Intl.NumberFormat("en-IN").format(Number(value))
}

export const parseNumber = (value: string): string => value.replace(/,/g, "")