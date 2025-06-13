import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("GET hit BP1");

  const supabase = await createClient();

  console.log("GET hit BP2");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("GET hit BP3");

  console.log(user);

  if (!user) {
    return NextResponse.json({ status: "unauthenticated" }, { status: 401 });
  }

  console.log("GET hit BP4");
  
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

  if (!existingUser) {
    return NextResponse.json({ status: "new", redirect: "/sign-up/form" });
  }

  if (existingUser.accessRole === "PENDING") {
    return NextResponse.json({ status: "pending", redirect: "/pending" });
  }

  return NextResponse.json({ status: "complete", redirect: "/sessions" });
}
