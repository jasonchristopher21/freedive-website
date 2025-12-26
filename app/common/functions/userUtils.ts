"use client"

import { Level, YearOfStudy } from "@/app/types"

export function toDisplayText(year: YearOfStudy) {
  switch (year) {
    case YearOfStudy.YEAR_1:
      return "Year 1"
    case YearOfStudy.YEAR_2:
      return "Year 2"
    case YearOfStudy.YEAR_3:
      return "Year 3"
    case YearOfStudy.YEAR_4:
      return "Year 4"
    case YearOfStudy.YEAR_5:
      return "Year 5"
    case YearOfStudy.GRADUATE:
      return "Graduate"
    case YearOfStudy.ALUMNI:
      return "Alumni"
    case YearOfStudy.OTHERS:
      return "Others"
  }
}

export function getUserLevelColor(level: Level): string {
  switch (level) {
    case Level.BEGINNER:
      return "bg-green-500"
    case Level.INTERMEDIATE:
      return "bg-orange-500"
    case Level.ADVANCED:
      return "bg-red-500"
    default:
      return "bg-blue-500" // Fallback color
  }
}

export const getTableLevelColor = (level: Level) => {
  switch (level) {
    case Level.BEGINNER:
      return "green"
    case Level.INTERMEDIATE:
      return "orange"
    case Level.ADVANCED:
      return "red"
    default:
      return "blue"
  }
}
