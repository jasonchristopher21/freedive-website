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

export type Session = {
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
export type Signup = {
  id: string,
  userId: string,
  name: string,
  year: YearOfStudy,
  role: string
  preferredName: string,
  level: Level,
  avatarUrl: string
}

export enum CcaRoles {
  'Member', 'Publicity Manager', 'Logistics Manager', 'Projects Manager', 'Captain', 'Vice Captain', 'Events Manager', 'Admin'
}