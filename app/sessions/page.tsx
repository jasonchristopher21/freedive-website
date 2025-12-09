"use client";
import styles from "@/app/styles";
import { useUpcomingSessionsQuery } from "@/queries/useUpcomingSessionsQuery";
import MemberGuard from "../common/authguard/MemberGuard";
import SessionBox from "./SessionBox";
import { SessionQueryWithSignups } from "../types";
import Loading from "../Loading";

export default function PageAuth() {
  return (
    <MemberGuard>
      <Page />
    </MemberGuard>
  )
}

function Page() {

  const { data: sessions, isLoading } = useUpcomingSessionsQuery();

  
  if (isLoading) {
    return <Loading />
  }
  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-500">No upcoming sessions available.</span>
      </div>
    );
  }

  return (
      <div className="px-8 py-8 flex flex-col gap-4 max-w-screen-xl ml-0">
        <span className={styles.heading1}>UPCOMING SESSIONS</span>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((item: SessionQueryWithSignups) => <SessionBox props={item} key={item.id} />)}
        </div>
      </div>
  )
}
