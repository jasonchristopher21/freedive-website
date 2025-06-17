"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import styles from "@/app/styles";
import LevelLabel from "@/components/LevelLabel";
import TrainingPlan from "./TrainingPlan";
import { useParams } from "next/navigation";
import { useSessionDetailQuery } from "@/queries/useSessionDetailQuery";
import { getDateString, getTimeString } from "@/app/common/functions/dateTimeUtils";
import type { TrainingPlan as TrainingPlanType } from "@prisma/client";

const dummyData =
{
  name: "Thursday Safety Refresher (All Levels)",
  date: "Tuesday, 15 October 2024",
  time: "17.00 - 19.00",
  numPax: 12,
  levels: ["Beginner", "Intermediate", "Advanced"],
  lanes: "7, 8, 9",
  trainingPlan: {
    general: "General Training Plan",
    beginner: "Beginner Training Plan",
    intermediate: "Intermediate Training Plan",
    advanced: "Advanced Training Plan",
  },
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, vestibulum mi id, ultricies nunc. Nulla facilisi. Nullam nec nunc nec libero",
}
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import MemberGuard from "@/app/common/authguard/MemberGuard";

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
  levels: any[]; // Adjust if you know the type

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

export default function Page() {
  const { id } = useParams();
  const { data, isLoading, refetch } = useSessionDetailQuery(id as string);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
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
          <div className="flex items-center gap-2 px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Sessions
                  </BreadcrumbLink>
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
          <div className="px-8 py-6 flex flex-col gap-4 max-w-screen-xl mx-auto">
            {/* <Link href="/sessions">
              <button className="flex gap-4 items-center">
                <ChevronLeftIcon className="h-5 text-grey-500" />
                <span className={`${styles.heading4} text-grey-500`}>BACK TO UPCOMING SESSIONS</span>
              </button>
            </Link> */}
            <span className="font-heading font-bold text-[22px] leading-tight">{session.name.toUpperCase()}</span>
            <div className="flex flex-col gap-1">
              <span className={`${styles.paragraph}`}>{getDateString(session.date)}</span>
              <span className={`${styles.paragraph}`}>{getTimeString(session.endTime)} - {getTimeString(session.endTime)}</span>
              <div className="flex">
                <span className={`${styles.paragraph}`}>Lanes {dummyData.lanes}</span>
                <UserIcon className="ml-3 h-4 my-auto text-grey-500" />
                <span className={`ml-1 ${styles.paragraph}`}>{session.maxParticipants}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {session.levels.map((level) => (
                  <LevelLabel label={level} key={level} />
                ))}
              </div>
            </div>
            <div>
              <span className="font-heading font-bold text-[22px] leading-tight">TODO ATTENDEES</span>
            </div>

            {/* Description Box */}
            {session.description && session.description.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className={`${styles.heading2}`}>DESCRIPTION</span>
                <span className={`${styles.paragraph}`}>{dummyData.description}</span>
              </div>
            )}

            {/* Training Plan */}
            {session.TrainingPlan.length > 0 && <TrainingPlan props={session.TrainingPlan[0]} />}
          </div>
        </div>
      </SidebarInset>
    </MemberGuard>
  )
}
