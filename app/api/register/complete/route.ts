import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { AccessRole, Level, YearOfStudy } from "@prisma/client" // Workaround as const import from @prisma/client doesn't work

function convertToYearOfStudy(year: string | number): string {
  const yearOfStudyMap: Record<string, string> = {
    "1": YearOfStudy.YEAR_1,
    "2": YearOfStudy.YEAR_2,
    "3": YearOfStudy.YEAR_3,
    "4": YearOfStudy.YEAR_4,
    "5": YearOfStudy.YEAR_5,
    Graduate: YearOfStudy.GRADUATE,
    Alumni: YearOfStudy.ALUMNI,
    Others: YearOfStudy.OTHERS,
  };
  return yearOfStudyMap[year.toString()] || "Others";
}

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
  let accessRole: string = AccessRole.PENDING; // Default role
  let roleId: string = "70938598-0b3a-403d-9dc4-0691c0a0db20"; // Default roleId
  let level: string = Level.BEGINNER; // Default level

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
    yearOfStudy: convertToYearOfStudy(yearOfStudy),
    remarks,
    accessRole,
    roleId,
    level,
  });

  if (userInsertError) {
    return NextResponse.json(
      { error: userInsertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "success",
    redirect: "/auth/redirect",
  });
}
