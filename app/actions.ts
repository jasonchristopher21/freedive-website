"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { readFileSync } from "fs";
import { SessionQueryWithSignups } from "./types";
import { format } from "date-fns";
import { YearOfStudy } from "@prisma/client";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/register",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });

  // If there's an error, log it and redirect to the register page with an error message.
  // Usually for the case of user already registered with the email.
  if (error) {
    console.error("Sign Up Error: " + error.code + " " + error.message);
    switch (error.code) {
      case "user_already_exists":
        return encodedRedirect(
          "error",
          "/register",
          "A user already exists with this email. Please sign in instead."
        );
      default:
        return encodedRedirect("error", "/register", error.message);
    }
  } else {
    return redirect("/auth/redirect");
  }
};

export const signUpWithGoogleAction = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`, // or your preferred callback URL
    },
  });

  if (error) {
    console.error("OAuth Error " + error.code + " " + error.message);
    return encodedRedirect("error", "/register", error.message);
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/auth/redirect");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const exportExcel = async (sessions: SessionQueryWithSignups[], monthWithYear: string) => {
  const defaultFont = { size: 10, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' }
  const defaultAllBorderFill = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  const formatOrange = (cell: any) => {
    cell.font = { ...defaultFont, size: 8, bold: true }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD5B0' } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = defaultAllBorderFill
  }
  const formatGray = (cell: any) => {
    cell.font = { ...defaultFont, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EEEEEE' } }
    cell.border = defaultAllBorderFill
  }
  const formatTableCell = (cell: any) => {
    cell.font = { ...defaultFont, size: 8, italic: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = defaultAllBorderFill
  }

  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'yitao36';
  workbook.lastModifiedBy = 'yitao36';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  const worksheet = workbook.addWorksheet('Sheet 1')

  const numberOfSessions = sessions.length
  const totalCol = 5 + sessions.length

  // Edit column widths
  worksheet.getColumn(2).width = 25
  worksheet.getColumn(3).width = 12
  worksheet.getColumn(4).width = 21
  const lastColumn = totalCol
  worksheet.getColumn(lastColumn).width = 25

  // Add NUS png
  const NUSpng = readFileSync("app/assets/img/nus.png")
  const nusImage = workbook.addImage({
    buffer: NUSpng.buffer,
    extension: 'png'
  })
  worksheet.addImage(nusImage, {
    tl: { col: lastColumn - 0.5, row: 0 },
    ext: { width: 120, height: 65 }
  })

  // Row 1 - 2
  worksheet.mergeCells('A1:B2')
  const A1 = worksheet.getCell('A1')
  A1.value = {
    richText: [
      { font: { ...defaultFont, bold: true }, text: 'Office of Student Affairs\n' },
      { font: { ...defaultFont }, text: 'Sports' }
    ]
  }
  A1.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }
  worksheet.getRow(1).height = 55


  // Row 3 - 4
  worksheet.mergeCells(3, 1, 4, lastColumn)
  const A3 = worksheet.getCell('A3')
  A3.value = 'ATTENDANCE FOR SPORTS GROUPS'
  formatGray(A3)

  // Row 5 - 7
  worksheet.mergeCells(5, 1, 7, 3)
  const A5 = worksheet.getCell('A5')
  A5.value = {
    richText: [
      { font: { ...defaultFont, size: 8, bold: true }, text: "Sport: " },
      { font: { ...defaultFont, size: 8, italic: true }, text: "DIVE [Freedive]" }
    ]
  }
  formatGray(A5)

  const D5 = worksheet.getCell('D5')
  const D6 = worksheet.getCell('D6')
  const D7 = worksheet.getCell('D7')
  D5.value = 'Month & Year'
  D6.value = 'Day'
  D7.value = 'Date'
  formatOrange(D5)
  formatOrange(D6)
  formatOrange(D7)

  if (numberOfSessions > 0) {
    worksheet.mergeCells(5, 5, 5, lastColumn - 1)
    const E5 = worksheet.getCell('E5')
    E5.value = monthWithYear
    formatOrange(E5)

    const dayRow = worksheet.getRow(6)
    const dateRow = worksheet.getRow(7)
    for (let i = 0; i < numberOfSessions; i++) {
      const dayCell = dayRow.getCell(5 + i)
      const dateCell = dateRow.getCell(5 + i)

      dayCell.value = format(new Date(sessions[i].date), 'EEE')
      dateCell.value = parseInt(format(new Date(sessions[i].date), 'd'))
      formatOrange(dayCell)
      formatOrange(dateCell)
    }
  }

  worksheet.mergeCells(5, lastColumn, 7, lastColumn)
  const remarkCell = worksheet.getRow(5).getCell(lastColumn)
  remarkCell.value = "Remarks"
  formatOrange(remarkCell)

  // Row 8 - Row (n-1)
  // Add a table to a sheet
  const allUsers: {
    name: string,
    year: YearOfStudy,
    role: string,
  }[] = []
  sessions.forEach(s => {
    s.signups.forEach(u => {
      if (!allUsers.some(au => au.name === u.name)) {
        allUsers[allUsers.length] = u
      }
    })
  })
  const rolePriority = ['Member', 'Logistics Manager', 'Publicity Manager', 'Projects Manager', 'Events Manager', 'Vice Captain', 'Captain', 'Admin']
  const yearPriority = ['ALUMNI', 'GRADUATE', 'YEAR_5', 'YEAR_4', 'YEAR_3', 'YEAR_2', 'YEAR_1']
  allUsers.sort((u1, u2) => {
    const c1 = Math.sign(rolePriority.indexOf(u2.name) - rolePriority.indexOf(u1.name))
    if (c1 === 0) {
      const c2 = Math.sign(yearPriority.indexOf(u2.year) - yearPriority.indexOf(u1.year))
      if (c2 === 0) {
        return u2.name.localeCompare(u1.name)
      }
      return c2
    }
    return c1
  })

  worksheet.addTable({
    name: 'MyTable',
    ref: 'A8',
    headerRow: true,
    totalsRow: true,
    style: {
      theme: 'TableStyleLight16',
      showRowStripes: true,
    },
    columns: [
      { name: 'S/No', totalsRowLabel: 'Totals:', filterButton: false },
      { name: 'Full Name (as in NUS records)', filterButton: false },
      { name: 'Role', filterButton: false },
      { name: 'Year of Study (AY 25/26)', filterButton: false },
      ...sessions.map((s, i) => { return { name: `Session${i}`, filterButton: false, totalsRowFunction: 'sum' } }),
      { name: 'Remarks', filterButton: false }
    ],
    rows: [
      ...allUsers.map(u => {
        return [{ formula: '=ROW() - ROW(MyTable[[#Headers],[S/No]])', result: 0 }, u.name, u.role, u.year,
        ...sessions.map(s => s.signups.some(s2 => s2.name === u.name) ? 1 : undefined)
          , '']
      })
    ],
  })

  for (let i = 0; i < allUsers.length + 2; i++) {
    const tableRow = worksheet.getRow(8 + i)
    for (let j = 1; j <= sessions.length + 5; j++) {
      const tableCell = tableRow.getCell(j)
      formatTableCell(tableCell)

      // Bold names
      if (j == 2) {
        tableCell.font = { ...tableCell.font, bold: true, size: 8 }
        continue;
      }
      // Black out date columns
      else if (i == 0 && j > 4 && j <= sessions.length + 5) {
        tableCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } }
        continue;
      }
    }
  }

  // Row n
  const lastRow = worksheet.getRow(9 + allUsers.length)
  for (let i = 1; i <= sessions.length + 5; i++) {
    const cell = lastRow.getCell(i)
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '92D050' } }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}