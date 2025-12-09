"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { AccessRole } from "@prisma/client";
import Loading from "../../Loading";

export default function MemberGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAppSelector((state) => state.user.user);
    const authUser = useAppSelector((state) => state.auth.authUser)
    const [loading, setLoading] = useState(true);
    const ALLOWED_ROLES: AccessRole[] = [AccessRole.MEMBER, AccessRole.ADMIN, AccessRole.IC]; // Define allowed roles

    useEffect(() => {
        const checkUser = async () => {
            if (!user || !authUser) {
                // User is not authenticated, redirect to the sign in page
                router.push("/sign-in");
            } else if (!ALLOWED_ROLES.includes(user.accessRole)) {
                // User is not authenticated or does not have the correct role.
                // Redirect to the authentication page to determine the correct action.
                router.push("/auth/redirect")
            } else {
                setLoading(false); // User is authenticated and has the correct role
            }
        };

        checkUser();
    }, [user, router]);

    if (loading) {
        return <Loading />;
    }

    return <>{children}</>;
}