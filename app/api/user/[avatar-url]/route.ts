import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"


export async function GET(req: Request, { params }: { params: Promise<{ "avatar-url": string }> }) {
    const avatarUrl = (await params)["avatar-url"]
    
    const supabase = await createClient()
    const url = supabase.storage.from('images-avatar')
        .getPublicUrl(avatarUrl).data.publicUrl

    return NextResponse.json({
        status: 200,
        data: url
    })
}