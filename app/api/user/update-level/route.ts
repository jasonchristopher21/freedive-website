import { Level } from "@/app/types"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({
    userId: z.string(),
    level: z.enum(Level)
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

    const {userId, level} = parseResult.data

    const res = await prisma.$transaction(async tx => {
        await tx.user.update({
            data: { level: { set: level, } },
            where: { id: userId }
        })

        console.log(`User's level updated to: ${level}`)
    })

    return NextResponse.json({
        message: "Update success!",
    }, {status: 200})
}