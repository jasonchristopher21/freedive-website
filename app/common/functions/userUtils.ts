"use client"

import { Level } from "@prisma/client";

export function getUserLevelColor(level: Level): string {
    switch (level) {
        case Level.BEGINNER:
            return "bg-green-500";
        case Level.INTERMEDIATE:
            return "bg-orange-500";
        case Level.ADVANCED:
            return "bg-red-500";
        default:
            return "bg-blue-500"; // Fallback color
    }
}