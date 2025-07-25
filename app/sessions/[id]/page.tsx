"use client";

import { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import styles from "@/app/styles";
import LevelLabel from "@/components/LevelLabel";
import TrainingPlan from "./TrainingPlan";
import { useParams } from "next/navigation";
import { useSessionDetailQuery } from "@/queries/useSessionDetailQuery";
import {
  getDateString,
  getTimeString,
} from "@/app/common/functions/dateTimeUtils";
import type {
  Level,
  Signup,
  TrainingPlan as TrainingPlanType,
  User,
} from "@prisma/client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import MemberGuard from "@/app/common/authguard/MemberGuard";
import clsx from "clsx";
import { getUserLevelColor } from "@/app/common/functions/userUtils";
import RenderButton from "../RenderButton";
import { defaultSessionBoxProps, SessionBoxProps } from "../SessionBox";

export interface SessionDetailResponse {
  id: string;
  name: string;
  description: string | null;
  date: Date; // ISO date string
  startTime: Date; // time string
  endTime: Date; // time string
  lanes: number[];
  maxParticipants: number;
  createdAt: string; // ISO datetime string
  sessionType: string; // enum as string
  levels: Level[];

  attendance: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
      role: {
        name: string;
      };
    };
  }>;

  ics: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
      role: {
        name: string;
      };
    };
  }>;

  TrainingPlan: Array<TrainingPlanType>;
}

interface SignupObject {
  User: User;
  userId: string;
}

function AttendeeCard({ user, isIc }: { user: any; isIc: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "p-1 rounded-full flex-none justify-center items-center",
            getUserLevelColor(user.level)
          )}
        >
          <img
            src={user.avatarUrl || "/default-avatar.png"}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex gap-1.5">
            <span className={`${styles.heading3} font-bold text-black`}>
              {user.preferredName
                ? user.preferredName.toUpperCase()
                : user.name.split(" ")[0].toUpperCase()}
            </span>
            {isIc && (
              <div className="flex flex-col justify-center">
                <span
                  className={`${styles.paragraph} text-white font-bold text-[11px] my-auto bg-blue-500 px-1 rounded-sm`}
                >
                  IC
                </span>
              </div>
            )}
          </div>
          <span className="text-[11px] text-grey-500 -mt-0.5">
            {user.Role.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const { id } = useParams();
  const { data, isLoading, refetch } = useSessionDetailQuery(id as string);
  const [users, setUsers] = useState([]);
  const [renderButtonData, setRenderButtonData] = useState<SessionBoxProps>();

  useEffect(() => {
    if (data && data.SessionIC && data.Signup) {
      const icUserIds = data.SessionIC.map((ic: SignupObject) => ic.User.id);
      const memberList = data.Signup.filter(
        (signup: SignupObject) => !icUserIds.includes(signup.User.id)
      ).map((signup: SignupObject) => ({
        ...signup.User,
        isIc: false,
      }));
      const userList = data.SessionIC.map((ic: SignupObject) => ({
        ...ic.User,
        isIc: true,
      })).concat(memberList);
      setUsers(userList);
      setRenderButtonData({
        ...data,
        Signup: data.Signup.map((signup: SignupObject) => ({
          userId: signup.User.id,
        })),
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-grey-500">Session not found</span>
      </div>
    );
  }

  console.log("Session data:", data);
  console.log(data.TrainingPlan);

  const session: SessionDetailResponse = data;

  return (
    <MemberGuard>
      <SidebarInset>
        <header className="sticky flex mt-8 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/sessions">Sessions</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{session.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div>
          <div className="px-4 py-6 flex flex-col gap-4 max-w-screen-xl mx-auto">
            {/* <Link href="/sessions">
              <button className="flex gap-4 items-center">
                <ChevronLeftIcon className="h-5 text-grey-500" />
                <span className={`${styles.heading4} text-grey-500`}>BACK TO UPCOMING SESSIONS</span>
              </button>
            </Link> */}
            <span className="font-heading font-bold text-[22px] leading-tight">
              {session.name.toUpperCase()}
            </span>
            <div className="flex flex-col gap-1">
              <span className={`${styles.paragraph}`}>
                {getDateString(session.date)}
              </span>
              <span className={`${styles.paragraph}`}>
                {getTimeString(session.startTime)} -{" "}
                {getTimeString(session.endTime)}
              </span>
              <div className="flex">
                <span className={`${styles.paragraph}`}>
                  Lanes {session.lanes.join(", ")}
                </span>
                <UserIcon className="ml-3 h-4 my-auto text-grey-500" />
                <span className={`ml-1 ${styles.paragraph}`}>
                  {users.length}/{session.maxParticipants}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {session.levels.map((level) => (
                  <LevelLabel label={level} key={level} />
                ))}
              </div>
            </div>
            <div>
              <span className={`${styles.heading2}`}>ATTENDEES</span>
              <div className="flex flex-col border rounded-lg border-grey-300 max-w-screen-lg p-4 mt-2">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {users.map((user: User & { isIc: boolean }) => (
                    <AttendeeCard user={user} isIc={user.isIc} key={user.id} />
                  ))}
                </div>
                <div className="w-full mt-2">
                  <RenderButton
                    props={renderButtonData || defaultSessionBoxProps}
                  />
                </div>
              </div>
            </div>

            {/* Description Box */}
            {session.description && session.description.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className={`${styles.heading2}`}>DESCRIPTION</span>
                <span className={`${styles.paragraph}`}>
                  {session.description}
                </span>
              </div>
            )}

            {/* Training Plan */}
            {session.TrainingPlan.length > 0 && (
              <TrainingPlan props={session.TrainingPlan[0]} />
            )}
          </div>
        </div>
      </SidebarInset>
    </MemberGuard>
  );
}
