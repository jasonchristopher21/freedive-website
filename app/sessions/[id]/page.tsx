"use client";

import {
  getDateString,
  getTimeString,
} from "@/app/common/functions/dateTimeUtils";
import styles from "@/app/styles";
import LevelLabel from "@/components/LevelLabel";
import { useSessionDetailQuery } from "@/queries/useSessionDetailQuery";
import { MoreOutlined } from '@ant-design/icons';
import { UserIcon } from "@heroicons/react/24/outline";
import { Level, User } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TrainingPlan from "./TrainingPlan";

import MemberGuard from "@/app/common/authguard/MemberGuard";
import { getUserLevelColor } from "@/app/common/functions/userUtils";
import Loading from "@/app/Loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset
} from "@/components/ui/sidebar";
import { useAvatarQuery } from "@/queries/useAvatarQuery";
import { useAppSelector } from "@/redux/store";
import { UseQueryResult } from "@tanstack/react-query";
import { Dropdown, MenuProps } from "antd";
import clsx from "clsx";
import RenderButton from "../RenderButton";
import { defaultSessionBoxProps } from "../SessionBox";
import { SessionDetailedResponseMapped } from "@/app/api/sessions/[id]/route";

type AttendeeCardUser = Pick<SessionDetailedResponseMapped['signups'][0], 'name'|'role'|'preferredName'|'level'|'avatarUrl'>
function AttendeeCard({ currUser, user, isIc }: { currUser: User, user: AttendeeCardUser, isIc: boolean }) {
  
  // Fetch avatar public url
  const { data: publicAvatarUrl, isError, error }: UseQueryResult<string | null> = useAvatarQuery(user.avatarUrl)
  if (isError) {
    console.error(error.message)
  }
  const actionIconStyle = 'transition-all p-3 hover:bg-gray-200 rounded-full cursor-pointer'
  const dropdownItems: MenuProps['items'] = [
    {
      label: ("Remove"), key: '0'
    }
  ]
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
            src={publicAvatarUrl || undefined}
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
                <span className={`${styles.paragraph} text-white font-bold text-[11px] my-auto bg-blue-500 px-1 rounded-sm`}>
                  IC
                </span>
              </div>
            )}
          </div>
          <span className="text-[11px] text-grey-500 -mt-0.5">
            {user.role}
          </span>
        </div>
        {
          currUser.accessRole === 'ADMIN' &&
          <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
            <MoreOutlined className={actionIconStyle} />
          </Dropdown>
        }
      </div>
    </div>
  );
}

export default function PageAuth() {
  return (
    <MemberGuard>
      <Page />
    </MemberGuard>
  )
}

function Page() {
  const router = useRouter()
  const { id } = useParams();
  const currUser = useAppSelector(state => state.user.user)!
  const { data, isLoading, isError, error } = useSessionDetailQuery(id as string);

  if (isLoading) {
    return (
      <Loading />
    );
  }
  if (isError) {
    console.error(error.message)
    return (
      <div>ERROR</div>
    )
  }
  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-grey-500">Session not found</span>
      </div>
    );
  }

  const icList = data.ics.map((ic) => ic.id)
  const userList = data.signups.map(u => {
    return {...u, isIc: icList.includes(u.id)}
  })

  return (
    <SidebarInset>
      <header className="sticky flex mt-8 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2 px-4">
          {/** Breadcrumbs */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink onClick={() => router.back()}>Sessions</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.name}</BreadcrumbPage>
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
            {data.name.toUpperCase()}
          </span>
          <div className="flex flex-col gap-1">
            <span className={`${styles.paragraph}`}>
              {getDateString(data.date)}
            </span>
            <span className={`${styles.paragraph}`}>
              {getTimeString(data.startTime)} - {getTimeString(data.endTime)}
            </span>
            <div className="flex">
              <span className={`${styles.paragraph}`}>
                Lanes {data.lanes.join(", ")}
              </span>
              <UserIcon className="ml-3 h-4 my-auto text-grey-500" />
              <span className={`ml-1 ${styles.paragraph}`}>
                {userList.length}/{data.maxParticipants}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {data.levels.map((level) => (
                <LevelLabel label={level} key={level} />
              ))}
            </div>
          </div>
          <div>

            { /** Attendees */}
            <span className={`${styles.heading2}`}>ATTENDEES</span>
            <div className="flex flex-col border rounded-lg border-grey-300 max-w-screen-lg p-4 mt-2">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userList.map((user) => (
                  <AttendeeCard currUser={currUser} user={user} isIc={user.isIc} key={user.id} />
                ))}
              </div>
              <div className="w-full mt-2">
                <RenderButton
                  props={data || defaultSessionBoxProps}
                />
              </div>
            </div>
          </div>

          {/* Description Box */}
          {data.description && data.description.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className={`${styles.heading2}`}>DESCRIPTION</span>
              <span className={`${styles.paragraph}`}>
                {data.description}
              </span>
            </div>
          )}

          {/* Training Plan */}
          {data.trainingPlan && (
            <TrainingPlan props={data.trainingPlan} />
          )}
        </div>
      </div>
    </SidebarInset>
  );
}
