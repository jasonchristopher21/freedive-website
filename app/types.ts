import { AccessRole as AccessRoleEnum, Level as LevelEnum, SessionType, YearOfStudy } from "@prisma/client";

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
  levels: LevelEnum[],
}
export type Signup = {
  id: string,
  userId: string,
  name: string,
  year: YearOfStudy,
  role: string
  preferredName: string,
  level: LevelEnum,
  avatarUrl: string
}

export enum CcaRoles {
  'Member', 'Publicity Manager', 'Logistics Manager', 'Projects Manager', 'Captain', 'Vice Captain', 'Events Manager', 'Admin'
}

export const AccessRole: { [k in AccessRoleEnum]: k } = {
  "MEMBER": "MEMBER",
  "PENDING": "PENDING",
  "ADMIN": "ADMIN",
  "IC": "IC"
}

export const Level: { [k in LevelEnum]: k } = {
  "BEGINNER": "BEGINNER",
  "INTERMEDIATE": "INTERMEDIATE",
  "ADVANCED": "ADVANCED"
}