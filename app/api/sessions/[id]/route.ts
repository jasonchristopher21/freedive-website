// File: app/api/session/[id]/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient(); // no need to await

  const { data: session, error } = await supabase
    .from("Session")
    .select(`
      *,
      TrainingPlan (*),
      Signup (
        userId,
        User (
          id,
          name,
          preferredName,
          avatarUrl,
          level,
          Role (
            name
          )
        )
      ),
      SessionIC (
        userId,
        User (
          id,
          name,
          preferredName,
          avatarUrl,
          level,
          Role (
            name
          )
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch sessions." },
      { status: 500 }
    );
  }

  if (!session) {
    return NextResponse.json(
      { status: "no-session", message: "Session not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "success",
    session,
  });
}
