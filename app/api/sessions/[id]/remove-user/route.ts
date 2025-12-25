import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
    userId: z.string()
})

/** Remove user signup from session */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const data = await req.json()
    const { id: sessionId } = await params
    const body = bodySchema.safeParse(data)
    if (body.error) {
        console.error(body.error.flatten())
        return NextResponse.json({
            status: 400
        })
    }

    await prisma.$transaction(async tx => {
        const res = await tx.signup.deleteMany({
            where: { sessionId, userId: body.data.userId }
        })
        if (res.count !== 1) {
            throw new Error(`Unexpected error: Expected 1, (${res.count}) user removed. Rollback occured`)
        }
    })

    return NextResponse.json({
        status: 200
    })
}