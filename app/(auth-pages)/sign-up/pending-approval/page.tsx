"use client";

import Image from "next/image";
import pendingApproval from "../../../assets/img/pending-approval.svg";
import styles from "@/app/styles";
import { useRouter } from "next/navigation";

/**
 * Page component that displays a pending approval message.
 * This page is shown when a user's account is pending approval by an admin.
 *
 * @returns A page that displays a pending approval message with an image and a button to go back to the home page.
 */
export default function PendingPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-xl h-[70vh] text-gray-800 md:mx-0 mx-10 mb-12">
      <Image
        src={pendingApproval}
        alt="Pending Approval"
        className="w-64 h-64 mb-8"
      />
      <h1 className={styles.heading1}>PENDING APPROVAL</h1>
      <p className="text-lg mt-4">
        Your account is pending approval. Please wait for the admin to review
        your request.
      </p>
      <button
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={() => router.push("/")}
      >
        Back to Home
      </button>
    </div>
  );
}
