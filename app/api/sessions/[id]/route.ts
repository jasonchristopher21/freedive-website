// File: app/api/session/[id]/route.ts

import { Level, SessionType, YearOfStudy } from "@/app/types"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type SessionDetailedResponse = {
  signups: {
    id: string // Same as userId
    role: string
    name: string
    preferredName: string | null
    year: YearOfStudy
    level: Level
    avatarUrl: string | null
  }[]
  startTime: string
  endTime: string
  id: string
  name: string
  createdAt: Date
  date: Date
  description: string | null
  lanes: number[]
  maxParticipants: number
  sessionType: SessionType
  levels: Level[]
  trainingPlan: {
    id: string
    createdAt: string
    sessionId: string | null
    generalPlan: string | null
    beginnerPlan: string | null
    intermediatePlan: string | null
    advancedPlan: string | null
  } | null
  ics: {
    id: string
    role: string
    name: string
    preferredName: string | null
    level: Level
    avatarUrl: string | null
    userId: string
  }[]
}

/** Convert any Date types to string */
export type SessionDetailedResponseMapped = {
  [P in keyof SessionDetailedResponse]: SessionDetailedResponse[P] extends Date ? string : SessionDetailedResponse[P]
}

/** A GET request to fetch session details with the specified route id. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await prisma.$transaction(async (tx) => {
    const session = await tx.session.findUnique({
      select: {
        id: true,
        name: true,
        description: true,
        date: true,
        startTime: true,
        endTime: true,
        lanes: true,
        maxParticipants: true,
        createdAt: true,
        sessionType: true,
        levels: true,
        trainingPlan: true,
        signups: { select: { user: { select: { id: true, name: true, yearOfStudy: true, preferredName: true, avatarUrl: true, level: true, role: { select: { name: true } } } } } },
        ics: { select: { userId: true, user: { select: { id: true, name: true, preferredName: true, avatarUrl: true, level: true, role: { select: { name: true } } } } } },
      },
      where: { id },
    })

    const mappedSession = session && {
      ...session,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
    }

    // Flatten user name, year, and role
    const flattenUser = mappedSession && {
      ...mappedSession,
      signups: mappedSession.signups.map((s) => {
        return {
          ...s.user,
          year: s.user.yearOfStudy,
          role: s.user.role.name,
        }
      }),
      ics: mappedSession.ics.map((ic) => {
        return { ...ic.user, role: ic.user.role.name, userId: ic.userId }
      }),
    }
    return flattenUser
  })

  if (!session) {
    return NextResponse.json({ status: "no-session", message: "Session not found." }, { status: 404 })
  }

  return NextResponse.json({
    status: "success",
    session: session as SessionDetailedResponse,
  })
}

/** A DELETE request to delete the session with the specified id */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sessionId = (await params).id
  console.log("SESSION ID: " + sessionId)

  await prisma.$transaction(async (tx) => {
    await tx.session.delete({
      where: { id: sessionId }
    })
  })

  return NextResponse.json({
    message: `Session with ID ${sessionId} deleted`
  }, { status: 200 })
}
