"use client"

import Unauthorised from "@/app/unauthorised";
import { useAppSelector } from "@/redux/store";
import { AccessRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAppSelector((state) => state.user.user);
    const authUser = useAppSelector((state) => state.auth.authUser)

    const ALLOWED_ROLES: AccessRole[] = [AccessRole.ADMIN]; // Define allowed roles
    const authorized = user ? ALLOWED_ROLES.includes(user?.accessRole) : false

    useEffect(() => {
        if (!user || !authUser) {
            router.push('/sign-in')
        } else if (!authorized && user.accessRole === AccessRole.PENDING) {
            // User has Pending role, send to pending approval page.
            router.push('/register/pending-approval')
        } else if (!authorized) {
            router.push('/sessions')
        }
    }, [])

    if (!authorized || !user || !authUser) {
        return <Unauthorised />;
    }

    return <>{children}</>;
}