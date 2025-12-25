import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { Level, SessionType } from "@/app/types"

const sessionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  date: z.iso.datetime(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
  lanes: z.array(z.number()),
  maxParticipants: z.number(),
  sessionType: z.enum(SessionType),
  levels: z.array(z.enum(Level)).optional(),
});

const trainingPlanSchema = z.object({
  generalPlan: z.string().optional(),
  beginnerPlan: z.string().optional(),
  intermediatePlan: z.string().optional(),
  advancedPlan: z.string().optional()
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
        { error: "Invalid input", details: z.treeifyError(parseResult.error) },
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

        // Insert Signup records for each IC
        await tx.signup.createMany({
          data: sessionICs.map((userId) => ({
            sessionId: session.id,
            userId: userId,
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
