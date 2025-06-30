import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { AccessRole } from "@prisma/client";

/**
 * GET handler to check the user's authentication status and access role.
 * This endpoint is accessed by users who have successfully authenitcated. Problems with
 * individual sign in and sign up flows are handled in the respective `actions.ts` functions
 * and the respective pages.
 *
 * This endpoint is used to determine if the user is authenticated, and what to do next
 * based on their current authentication state.
 * - Authenticated users who have yet to complete the sign up form are redirected to the sign up form.
 * - Authenticated users who have completed the sign up form but are still pending approval are redirected to the pending page.
 * - Authenticated users who have completed the sign up form and are approved are redirected to the sessions page.
 * @returns NextResponse with the user's status and redirect URL.
 */
export async function GET() {
  const supabase = await createClient();

  // Fetch the user's access role from the User table
  // This is to check if the user has completed the sign up process (i.e., has an entry in the User table).
  const { data: sessions, error } = await supabase
    .from("Session")
    .select(`
      *,
      Signup(userId)
    `)
    .gt("date", new Date().toISOString())

  if (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch sessions." },
      { status: 500 }
    );
  }

  if (!sessions || sessions.length === 0) {
    return NextResponse.json(
      { status: "no-sessions", message: "No upcoming sessions found." },
      { status: 404 }
    );
  }

  console.log("Fetched sessions:", sessions);
  console.log("Sessions signup", sessions.map(session => session.Signup));
  return NextResponse.json({
    status: "success",
    sessions: sessions,
  });
}
