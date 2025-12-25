"use client"

import Unauthorised from "@/app/unauthorised";
import { AccessRole } from "@prisma/client"
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function MemberGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const authUser = useAppSelector((state) => state.auth.authUser)

  const ALLOWED_ROLES: AccessRole[] = [AccessRole.MEMBER, AccessRole.ADMIN, AccessRole.IC]; // Define allowed roles
  const authorized = user ? ALLOWED_ROLES.includes(user.accessRole) : false

  useEffect(() => {
    console.log(authorized, user, authUser)
    if (!user || !authUser) {
      router.push('/sign-in')
    } else if (!authorized) {
      // User has Pending role, send to pending approval page.
      router.push('/register/pending-approval')
    }
  }, [])

  if (!authorized || !user || !authUser) {
    return <Unauthorised />;
  }

  return <>{children}</>;
}