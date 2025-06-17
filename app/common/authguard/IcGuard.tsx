"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { AccessRole } from "@prisma/client";

export default function IcGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAppSelector((state) => state.user.user);
    const [loading, setLoading] = useState(true);

    const ALLOWED_ROLES: AccessRole[] = [AccessRole.ADMIN, AccessRole.IC]; // Define allowed roles

    useEffect(() => {
        const checkUser = async () => {
            if (!user) {
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
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}