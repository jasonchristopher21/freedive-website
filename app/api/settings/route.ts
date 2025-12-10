"use server"

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
    userId: z.string(),
    file: z.instanceof(File)
})

// Update the user's image URL
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
        return NextResponse.json({
            status: 400
        })
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