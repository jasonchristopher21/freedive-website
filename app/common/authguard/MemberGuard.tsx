"use client"

import Unauthorised from "@/app/unauthorised";
import { useAppSelector } from "@/redux/store";
import { AccessRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function MemberGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const authUser = useAppSelector((state) => state.auth.authUser)

  const ALLOWED_ROLES: AccessRole[] = [AccessRole.MEMBER, AccessRole.ADMIN, AccessRole.IC]; // Define allowed roles
  const authorized = user ? ALLOWED_ROLES.includes(user.accessRole) : false

  useEffect(() => {
    if (!authorized || !user || !authUser) {
      router.push('/sign-in')
    }
  }, [])

  if (!authorized || !user || !authUser) {
    return <Unauthorised />;
  }

  return <>{children}</>;
}