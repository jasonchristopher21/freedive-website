import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = (await params).id

  const data = await prisma.$transaction(async (tx) => {
    return await tx.session.findMany({
      where: { signups: { some: { userId } } }
    })
  })

  console.log(data)

  return NextResponse.json({
    sessions: data
  }, { status: 200 })
}
