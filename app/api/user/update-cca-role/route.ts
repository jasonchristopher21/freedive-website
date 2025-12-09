import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({
    userId: z.string(),
    role: z.string()
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

    const res = await prisma.$transaction(async tx => {
        const roleId = await tx.role.findUnique({
            select: { id: true },
            where: { name: role }
        })

        if (!roleId) {
            throw new Error("Role name not found in database")
        }

        const res = await tx.user.update({
            data: { roleId: { set: roleId.id, } },
            where: { id: userId }
        })

        console.log(`User ${userId}'s role updated to: ${role}`)
    })

    return NextResponse.json({
        message: "Update success!",
    }, {status: 200})
}