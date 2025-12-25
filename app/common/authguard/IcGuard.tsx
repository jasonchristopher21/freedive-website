"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import Unauthorised from "@/app/unauthorised";
import Loading from "../../Loading";
import { AccessRole } from "@/app/types"

export default function IcGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAppSelector((state) => state.user.user);
    const [loading, setLoading] = useState(true);
    const [unauthorised, setUnauthorised] = useState(false); // State to track unauthorized access

    const ALLOWED_ROLES: AccessRole[] = [AccessRole.ADMIN, AccessRole.IC]; // Define allowed roles

    useEffect(() => {
        const checkUser = async () => {
            if (!user) {
                // User is not authenticated, redirect to the sign in page
                router.push("/sign-in");
            } else if (!ALLOWED_ROLES.includes(user.accessRole)) {
                // User is not authenticated or does not have the correct role.
                // Redirect to the authentication page to determine the correct action.
                setUnauthorised(true); // Set unauthorized state
                setLoading(false); // Stop loading since we are redirecting to unauthorized page
            } else {
                setLoading(false); // User is authenticated and has the correct role
            }
        };

        checkUser();
    }, [user, router]);

    if (loading) {
        return <Loading />;
    }

    if (unauthorised) {
        return <Unauthorised />;
    }

    return <>{children}</>;
}