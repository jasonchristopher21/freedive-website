import { Month } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { Level, SessionType, YearOfStudy } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

type MonthlySessionsQuery = {
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
export type MonthlySessionsMapped = { [P in keyof MonthlySessionsQuery[0]]: MonthlySessionsQuery[0][P] extends Date ? string : MonthlySessionsQuery[0][P] }[]

const bodySchema = z.object({
    month: z.nativeEnum(Month),
    year: z.number()
})

export async function POST(req: Request) {
    const body = await req.json()
    const parseResult = bodySchema.safeParse(body)
    if (!parseResult.success) {
        console.log(parseResult.error)
        return NextResponse.json(
            { error: "Invalid input", details: parseResult.error.flatten() },
            { status: 400 }
        );
    }

    const { month, year } = parseResult.data
    // Convert month and year to Iso format. E.g. May 2025 -> 2025-05
    const IsoDate: string = year.toString() + '-' + (month <= Month.SEPTEMBER ? '0' : "") + month.toString()

    const result = await prisma.$transaction(async (tx) => {
        // Fetch sessions
        console.log("Fetching sessions with date: " + IsoDate)
        const sessions = await tx.session.findMany({
            select: {
                id: true, name: true, description: true, date: true, startTime: true, endTime: true, maxParticipants: true, createdAt: true, sessionType: true, lanes: true, levels: true,
                signups: { select: { userId: true, user: { select: { name: true, yearOfStudy: true, role: { select: { name: true } } } } } }
            },
            where: { AND: [{ date: { gte: new Date(IsoDate + "-01") } }, { date: { lte: new Date(IsoDate + "-31") } }] }
        })
        // IMPORTANT: Prisma returns Time objects as 1970-01-01TXX:XX:XX.000Z, thus the need for further processing
        const mappedSessions = sessions.map(s => {
            return {
                ...s,
                startTime: new Date(s.startTime).toTimeString().split(' ')[0],
                endTime: new Date(s.endTime).toTimeString().split(' ')[0]
            }
        })
        // Flatten user name, year, and role
        const flattenUser = mappedSessions.map(s => {
            return {
                ...s, signups: s.signups.map(u => {
                    return {
                        id: u.userId, name: u.user.name, year: u.user.yearOfStudy, role: u.user.role.name
                    }
                })
            }
        })
        return flattenUser
    })

    console.log("Sessions fetched: ", result)

    return NextResponse.json({
        message: "Sessions fetched",
        sessions: result as MonthlySessionsQuery
    }, { status: 201 })
}