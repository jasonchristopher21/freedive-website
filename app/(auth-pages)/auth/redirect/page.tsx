"use client";

import Image from "next/image";
import pendingApproval from "../../../assets/img/pending-approval.svg";
import styles from "@/app/styles";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      const res = await fetch("/api/user/status");
      const { redirect } = await res.json();
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
      <p className="text-lg mt-4">
        Breathe in ... Breathe out ...
      </p>
    </div>
  );
}
