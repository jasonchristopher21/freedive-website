import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

/**
 * Fetches the public image URL of the user from Supabase Storage.
 * Avatar link should be included in the link's search parameter
 */
export async function GET(req: NextRequest) {
    const avatarUrl = req.nextUrl.searchParams.get('url')
    if (!avatarUrl) {
        console.error("No search parameter supplied")
        return NextResponse.json({status:400})
    }
    const supabase = await createClient()
    const url = supabase.storage.from('images-avatar')
        .getPublicUrl(avatarUrl).data.publicUrl

    if (!url) {
        return NextResponse.json({status:404})
    }

    return NextResponse.json({
        status: 200,
        data: url
    })
}

const bodySchema = z.object({
    userId: z.string(),
    file: z.instanceof(File),
    filename: z.string()
})

/**
 * Replaces the current user avatar in Supabase with the new avatar, and updates the url string in database
 */
export async function PATCH(req: Request) {
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
        const prev = await tx.user.findUnique({
            select: { avatarUrl: true },
            where: { id: data.userId }
        })
        await tx.user.update({
            data: { avatarUrl: { set: data.filename } },
            where: { id: data.userId }
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