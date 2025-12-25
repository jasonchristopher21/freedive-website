import { AccessRole as AccessRoleEnum, Level as LevelEnum, SessionType as SessionTypeEnum, YearOfStudy as YearOfStudyEnum } from "@prisma/client";

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
  sessionType: SessionTypeEnum,
  levels: LevelEnum[],
}
export type Signup = {
  id: string,
  userId: string,
  name: string,
  year: YearOfStudyEnum,
  role: string
  preferredName: string,
  level: LevelEnum,
  avatarUrl: string
}

export enum CcaRoles {
  'Member', 'Publicity Manager', 'Logistics Manager', 'Projects Manager', 'Captain', 'Vice Captain', 'Events Manager', 'Admin'
}

export type AccessRole = AccessRoleEnum
export const AccessRole: { [k in AccessRoleEnum]: k } = {
  "MEMBER": "MEMBER",
  "PENDING": "PENDING",
  "ADMIN": "ADMIN",
  "IC": "IC"
}

export type Level = LevelEnum
export const Level: { [k in LevelEnum]: k } = {
  "BEGINNER": "BEGINNER",
  "INTERMEDIATE": "INTERMEDIATE",
  "ADVANCED": "ADVANCED"
}

export type SessionType = SessionTypeEnum
export const SessionType: { [k in SessionTypeEnum]: k } = {
  TRAINING: "TRAINING",
  SAFETY_REFRESHER: "SAFETY_REFRESHER",
  EVENT: "EVENT"
}

export type YearOfStudy = YearOfStudyEnum
export const YearOfStudy: { [k in YearOfStudyEnum]: k} = {
    YEAR_1: "YEAR_1",
    YEAR_2: "YEAR_2",
    YEAR_3: "YEAR_3",
    YEAR_4: "YEAR_4",
    ALUMNI: "ALUMNI",
    GRADUATE: "GRADUATE",
    YEAR_5: "YEAR_5",
    OTHERS: "OTHERS"
}