import { prisma } from "@/lib/prisma"
import { AccessRole } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({
    userId: z.string(),
    role: z.enum(AccessRole)
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

    const {userId, role} = parseResult.data

    await prisma.$transaction(async tx => {
        await tx.user.update({
            data: { accessRole: { set: role, } },
            where: { id: userId }
        })

        console.log(`User's access role updated to: ${role}`)
    })

    return NextResponse.json({
        message: "Update success!",
    }, {status: 200})
}