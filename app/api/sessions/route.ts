import { prisma } from "@/lib/prisma";
import { Level, SessionType, YearOfStudy } from "@prisma/client"
import { NextResponse } from "next/server";

type SessionResponse = {
    signups: {
        id: string;
        name: string;
        year: YearOfStudy;
        role: string;
    }[];
    startTime: string;
    endTime: string;
    name: string;
    id: string;
    createdAt: Date;
    description: string | null;
    date: Date;
    lanes: number[];
    maxParticipants: number;
    sessionType: SessionType;
    levels: Level[];
}[]

/** Converts any Date types to string */
export type SessionResponseMapped = { [P in keyof SessionResponse[0]]: SessionResponse[0][P] extends Date ? string : SessionResponse[0][P] }[]

/**
 * GET handler to check the user's authentication status and access role.
 * This endpoint is accessed by users who have successfully authenitcated. Problems with
 * individual sign in and sign up flows are handled in the respective `actions.ts` functions
 * and the respective pages.
 *
 * This endpoint is used to determine if the user is authenticated, and what to do next
 * based on their current authentication state.
 * - Authenticated users who have yet to complete the sign up form are redirected to the sign up form.
 * - Authenticated users who have completed the sign up form but are still pending approval are redirected to the pending page.
 * - Authenticated users who have completed the sign up form and are approved are redirected to the sessions page.
 * @returns NextResponse with the user's status and redirect URL.
 */
export async function GET() {

  const result = await prisma.$transaction(async (tx) => {
    const sessions = await tx.session.findMany({
      select: { id: true, name: true, description: true, date: true, startTime: true, endTime: true, maxParticipants: true, createdAt: true, sessionType: true, lanes: true, levels: true,
        signups: { select: { userId: true, user: { select: { name: true, yearOfStudy: true, role: { select: { name: true } } } } } }
      },
      where: { date: {gte: new Date()} }
    })

    // IMPORTANT: Prisma returns Time objects as 1970-01-01TXX:XX:XX.000Z, thus the need for further processing
    const mappedSessions = sessions.map(s => {return {...s,
      startTime: new Date(s.startTime).toTimeString().split(' ')[0],
      endTime: new Date(s.endTime).toTimeString().split(' ')[0]
    }})
    // Flatten user name, year, and role
    const flattenUser = mappedSessions.map(s => {
      return {
        ...s, signups: s.signups.map(u => { return {
          id: u.userId, name: u.user.name, year: u.user.yearOfStudy, role: u.user.role.name
        }})
      }
    })
    return flattenUser as SessionResponse
  })

  console.log("Sessions fetched: ", result)
  return NextResponse.json({
    sessions: result
  }, { status: 201 })
}
