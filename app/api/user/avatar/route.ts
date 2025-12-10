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
    file: z.instanceof(File)
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

    const url = await (await createClient()).storage.from('images-avatar')
        .upload(`${data.userId}.${data.file.name.split('.').pop()}`, data.file, {upsert: true})


    if (url.error) {
        console.log("Error uploading image to Supabase Storage: ", url.error.message)
        return NextResponse.json({status: 400})
    }

    await prisma.$transaction(async tx => {
        await tx.user.update({
            data: { avatarUrl: { set: url.data.path } },
            where: { id: data.userId }
        })
    })

    return NextResponse.json({
        status: 200
    })
}