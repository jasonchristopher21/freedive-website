import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    preferredName,
    nusnetEmail,
    yearOfEntry,
    yearOfStudy,
    remarks,
    accessCode,
  } = body;

  // Prevent duplicate signup
  const { data: existingUser } = await supabase
    .from("User")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json(
      { error: "User already registered" },
      { status: 409 }
    );
  }

  // Default role
  let accessRole: "MEMBER" | "PENDING" = "PENDING";
  let roleId: string | null = null;

  // Check access code
  if (accessCode) {
    const { data: validCode } = await supabase
      .from("AccessCode")
      .select("id, role")
      .eq("code", accessCode)
      .gt("expiresAt", new Date().toISOString())
      .maybeSingle();

    if (validCode) {
      accessRole = validCode.role || "MEMBER";
      // Optional: assign roleId = validCode.roleId if applicable
    }
  }

  // Create User
  const { error: userInsertError } = await supabase.from("User").insert({
    id: user.id,
    name,
    preferredName,
    email: user.email,
    nusnetEmail,
    yearOfEntry,
    yearOfStudy,
    remarks,
    accessRole,
    roleId,
  });

  if (userInsertError) {
    return NextResponse.json(
      { error: userInsertError.message },
      { status: 500 }
    );
  }

  // Create Profile (optional)
  await supabase.from("Profile").insert({
    id: user.id,
    name,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    status: "success",
    access: accessRole === "PENDING" ? "pending" : "granted",
  });
}
