"use client";

import Image from "next/image";
import pendingApproval from "../../../assets/img/pending-approval.svg";
import styles from "@/app/styles";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store";
import { setAuthUser } from "@/lib/features/auth/authSlice";
import { setUser } from "@/lib/features/user/userSlice";

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkStatus = async () => {
      const res = await fetch("/api/user/status");
      const { redirect, authUser, user } = await res.json();
      if (res.ok) {
        // If user is authenticated, set the data from Supabase
        // auth.users in the store
        if (authUser) {
          dispatch(setAuthUser(authUser));
        }

        // If user profile exists (has filled out the sign up form),
        // set the user data in the store
        if (user) {
          dispatch(setUser(user));
        }
      }
      router.replace(redirect);
    };
    checkStatus();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-xl h-[70vh] text-gray-800 md:mx-0 mx-10 mb-12">
      <Image
        src={pendingApproval}
        alt="Pending Approval"
        className="w-64 h-64 mb-8"
      />
      <h1 className={styles.heading1}>REDIRECTING</h1>
      <p className="text-lg mt-4">Breathe in ... Breathe out ...</p>
    </div>
  );
}
