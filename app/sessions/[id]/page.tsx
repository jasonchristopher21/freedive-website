"use client";

import styles from "@/app/styles";
import { useSessionDetailQuery } from "@/queries/useSessionDetailQuery";
import { MoreOutlined } from '@ant-design/icons';
import { User } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import TrainingPlan from "./TrainingPlan";

import { hasPermission } from "@/app/access-rules";
import { SessionDetailedResponseMapped } from "@/app/api/sessions/[id]/route";
import MemberGuard from "@/app/common/authguard/MemberGuard";
import { getUserLevelColor } from "@/app/common/functions/userUtils";
import Loading from "@/app/Loading";
import ConfirmEditModal, { EditModalProps } from "@/app/users/ConfirmEditModal";
import {
  SidebarInset
} from "@/components/ui/sidebar";
import { useAvatarQuery } from "@/queries/useAvatarQuery";
import { useAppSelector } from "@/redux/store";
import { UseQueryResult } from "@tanstack/react-query";
import { Dropdown, MenuProps } from "antd";
import clsx from "clsx";
import RenderButton from "../RenderButton";
import SessionDetails from "./SessionDetails";
import SessionHeader from "./SessionHeader";

type AttendeeCardUser =
  Pick<SessionDetailedResponseMapped['signups'][0], 'id' | 'name' | 'role' | 'preferredName' | 'level' | 'avatarUrl'> & { isIc: boolean }

type UserEditFunctions = "delete"

function AttendeeCard({ sessionId, currUser, user, dispatch }:
  { sessionId: string, currUser: User, user: AttendeeCardUser, dispatch: (fn: () => Promise<void>) => void }) {
  // Fetch avatar public url
  const { data: publicAvatarUrl, isError, error }: UseQueryResult<string | null> = useAvatarQuery(user.avatarUrl)
  if (isError) {
    console.error(error.message)
  }

  const actionIconStyle = 'transition-all p-3 hover:bg-gray-200 rounded-full cursor-pointer'

  const handleRemoveFromSession = async () => {
    const response = await fetch(`/api/sessions/${sessionId}/remove-user`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id })
    })
    if (!response.ok) {
      console.error("Failed to remove member from session")
    }
  }

  const dropdownItems: MenuProps['items'] = [{
    label: ("Remove"), key: '0',
    onClick: () => dispatch(handleRemoveFromSession),
  }]

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
            {user.isIc && (
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
          hasPermission(currUser, "sessions", "remove-attendee", user) &&
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
  const { id } = useParams() // Session ID
  const currUser = useAppSelector(state => state.user.user)!
  const { data: session, isLoading, isError, error, refetch } = useSessionDetailQuery(id as string);
  const [editModal, setEditModal] = useState<EditModalProps | null>(null)

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
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-grey-500">Session not found</span>
      </div>
    );
  }

  /** Executes the function only on confirmation in EditModal */
  const dispatchEdit = (fn: () => Promise<void>) => {
    setEditModal({
      confirm: async () => {
        await fn()
        await refetch()
        setEditModal(null)
      },
      cancel: () => {
        setEditModal(null)
      }
    })
  }


  const icList = session.ics.map((ic) => ic.id)
  const userList = session.signups.map(u => {
    return { ...u, isIc: icList.includes(u.id) }
  })

  return (
    <SidebarInset>
      <SessionHeader name={session.name} />
      <div>
        <div className="px-4 py-6 flex flex-col gap-4 max-w-screen-xl mx-auto">
          <SessionDetails {...session} numberOfParticipants={userList.length} />
          <div>
            { /** Attendees */}
            <span className={`${styles.heading2}`}>ATTENDEES</span>
            <div className="flex flex-col border rounded-lg border-grey-300 max-w-screen-lg p-4 mt-2">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userList.map((user) => (<AttendeeCard sessionId={session.id} currUser={currUser} user={user} dispatch={dispatchEdit} key={user.id} />))}
              </div>
              <div className="w-full mt-2">
                <RenderButton refresh={async () => { await refetch() }} props={session} />
              </div>
            </div>
            {editModal && <ConfirmEditModal confirm={editModal.confirm} cancel={editModal.cancel} />}

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
          {session.trainingPlan && (
            <TrainingPlan props={session.trainingPlan} />
          )}
        </div>
      </div>
    </SidebarInset>
  );
}