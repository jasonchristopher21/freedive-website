import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";
import { Level, SessionType } from "@prisma/client";

const sessionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  date: z.string().datetime(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  lanes: z.array(z.number()),
  maxParticipants: z.number(),
  sessionType: z.nativeEnum(SessionType),
  levels: z.array(z.nativeEnum(Level)).optional(),
});

const trainingPlanSchema = z.object({
  generalPlan: z.string().optional(),
  beginnerPlan: z.string().optional(),
  intermediatePlan: z.string().optional(),
  advancedPlan: z.string().optional()
});

const sessionICSchema = z.object({
  userId: z.string().uuid()
});

const bodySchema = z.object({
  sessionData: sessionSchema,
  trainingPlanData: trainingPlanSchema, // Make optional if needed
  sessionICs: z.array(z.string())
});

// --- POST handler ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = bodySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { sessionData, trainingPlanData, sessionICs } = parseResult.data;

    const result = await prisma.$transaction(async (tx) => {
      // Insert Session
      const session = await tx.session.create({
        data: sessionData,
      });

      // Insert Training Plan
      await tx.trainingPlan.create({
        data: {
          ...trainingPlanData,
          sessionId: session.id,
        },
      });

      // Insert Session ICs
      if (sessionICs.length > 0) {
        await tx.sessionIC.createMany({
          data: sessionICs.map((ic) => ({
            sessionId: session.id,
            userId: ic,
          })),
        });
      }

      return session;
    });

    return NextResponse.json({
      message: "Session created",
      session: result,
      redirect: "/sessions"
    }, { status: 201 });
  } catch (error) {
    console.error("Transaction failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
