import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

/**
 * Fetches the public image URL of the user from Supabase Storage.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = (await params).id

    const supabase = await createClient()
    const data = await prisma.user.findFirst({
        select: {avatarUrl: true},
        where: { id: userId }
    })
    const avatarUrl = data?.avatarUrl || undefined

    if (!avatarUrl) {
        return NextResponse.json({
            status: 204
        })
    }

    const url = supabase.storage.from('images-avatar')
        .getPublicUrl(avatarUrl).data.publicUrl

    if (!url) {
        return NextResponse.json({status:204})
    }

    return NextResponse.json({
        status: 200,
        data: url
    })
}

const bodySchema = z.object({
    file: z.instanceof(File),
    filename: z.string()
})

/**
 * Replaces the current user avatar in Supabase with the new avatar, and updates the url string in database
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const userId = (await params).id
    const data: z.infer<typeof bodySchema> = Object.fromEntries(await req.formData()) as z.infer<typeof bodySchema>

    try {
        bodySchema.parse(data)
    } catch (err) {
        console.error("Error parsing file:", err)
        return NextResponse.json({
            status: 400
        })
    }

    const prev = await prisma.$transaction(async tx => {
        const prev = await tx.user.findFirst({
            select: { avatarUrl: true },
            where: { id: userId }
        })
        await tx.user.updateMany({
            data: { avatarUrl: { set: data.filename } },
            where: { id: userId }
        })
        return prev?.avatarUrl
    })

    const supabase = await createClient()

    if (prev && prev !== data.filename) {
        supabase.storage.from('images-avatar')
            .remove([prev])
    }


    const url = await supabase.storage.from('images-avatar')
        .upload(data.filename, data.file, {upsert: true})


    if (url.error) {
        console.log("Error uploading image to Supabase Storage: ", url.error.message)
        return NextResponse.json({status: 400})
    }

    

    return NextResponse.json({
        status: 200
    })
}