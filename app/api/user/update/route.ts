import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({
  userId: z.string(),
  data: z.string(),
  type: z.enum(["name", "preferredName", "email", "telegramHandle"])
})

/** Update one attribute of the user table */
export async function PATCH(req: Request) {
  const body = await req.json()
  const parseResult = bodySchema.safeParse(body)

  if (!parseResult.success) {
    console.error(parseResult.error)
    return NextResponse.json(
      { error: "Invalid input", details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const { userId, data, type } = parseResult.data

  switch (type) {
    case "name":
    case "preferredName":
      await prisma.$transaction(async tx => {
        await tx.user.update({
          data: { [type]: { set: data, } },
          where: { id: userId }
        })

        console.log(`User's ${type} updated to: ${data}`)
      })
      break
    default:
      console.error("Unhandled type")
      return NextResponse.json({
        status: 200
      })
  }

  return NextResponse.json({
    message: "Update success!",
  }, { status: 200 })
}