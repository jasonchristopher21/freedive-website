import { Level, SessionType, YearOfStudy } from "@prisma/client";

// This file defines common types used in various places

export enum Month {
  JANUARY = 1,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER
}

export type SessionQuery = {
  id: string,
  name: string,
  description: string | null,
  date: string,
  startTime: string,
  endTime: string,
  lanes: number[],
  maxParticipants: number,
  createdAt: string,
  sessionType: SessionType,
  levels: Level[],
}

export type SessionQueryWithSignups = SessionQuery & {
  signups: {
    userId: string,
    name: string,
    year: YearOfStudy,
    role: string
  }[]
}

export enum CcaRoles {
  'Member', 'Publicity Manager', 'Logistics Manager', 'Projects Manager', 'Captain', 'Vice Captain', 'Events Manager', 'Admin'
}