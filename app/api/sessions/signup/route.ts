import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

const bodySchema = z.object({
    sessionId: z.string(),
    userId: z.string(),
})

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

        const { sessionId, userId } = parseResult.data;

        const result = await prisma.$transaction(async (tx) => {

            // Combined fetch: session max participants + current signups + check if user already signed up
            const [sessionData] = await tx.session.findMany({
                where: { id: sessionId },
                take: 1,
                select: {
                    maxParticipants: true,
                    signups: {
                        select: { userId: true },
                    },
                },
            });

            if (!sessionData) {
                return NextResponse.json(
                    { error: "Session not found" },
                    { status: 404 }
                );
            }

            console.log(sessionData);

            const signupCount = sessionData.signups.length;
            const alreadySignedUp = sessionData.signups.some(s => s.userId === userId);

            if (alreadySignedUp) {
                return NextResponse.json(
                    { error: "User already signed up for this session" },
                    { status: 400 }
                );
            }

            if (signupCount >= sessionData.maxParticipants) {
                return NextResponse.json(
                    { error: "Session is full" },
                    { status: 400 }
                );
            }

            // Insert signup
            const signup = await tx.signup.create({
                data: { userId, sessionId },
            });

            return signup;
        });

        return NextResponse.json({
            message: "User added to session successfully",
            data: result,
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding user to session:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}