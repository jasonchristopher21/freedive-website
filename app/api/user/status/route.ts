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

  // Get the current user from Supabase auth
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();


  console.log(user);

  if (!user) {
    return NextResponse.json({ status: "unauthenticated" }, { status: 401 });
  }

  // Fetch the user's access role from the User table
  // This is to check if the user has completed the sign up process (i.e., has an entry in the User table).
  const { data: existingUser, error } = await supabase
    .from("User")
    .select("accessRole")
    .eq("id", user.id)
    .single();

  // Error PGRST116:
  // "No user found with the given ID. This usually means the user has not completed the signup process."
  // In this case, we treat it as a new user who has not completed the signup process.
  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch user data." },
      { status: 500 }
    );
  }

  // If the user does not exist in the User table, they have not completed the sign up form.
  // Redirect them to the sign up form.
  if (!existingUser) {
    return NextResponse.json({ status: "new", redirect: "/sign-up/form" });
  }

  // If the form has been completed but has not yet been approved,
  // we redirect the user to the pending page.
  if (existingUser.accessRole === AccessRole.PENDING) {
    return NextResponse.json({ status: "pending", redirect: "/sign-up/pending-approval" });
  }

  // If the user has completed the sign up form and is approved,
  // we redirect them to the sessions page.
  return NextResponse.json({ status: "complete", redirect: "/sessions" });
}
