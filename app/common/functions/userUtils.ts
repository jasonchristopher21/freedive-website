"use client"

import { Level } from "@/app/types"

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

export const getTableLevelColor = (level: Level) => {
  switch (level) {
    case Level.BEGINNER:
      return "green";
    case Level.INTERMEDIATE:
      return "orange";
    case Level.ADVANCED:
      return "red";
    default:
      return "blue";
  }
};