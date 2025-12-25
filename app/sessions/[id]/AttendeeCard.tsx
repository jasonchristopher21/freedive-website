"use client"

import { hasPermission } from "@/app/access-rules"
import { SessionDetailedResponseMapped } from "@/app/api/sessions/[id]/route"
import { getUserLevelColor } from "@/app/common/functions/userUtils"
import styles from "@/app/styles"
import { useAvatarQuery } from "@/queries/useAvatarQuery"
import { UseQueryResult } from "@tanstack/react-query"
import { MenuProps, Dropdown } from "antd"
import clsx from "clsx"
import { MoreOutlined } from '@ant-design/icons';
import { setError } from "@/redux/features/error/errorSlice"
import { useAppDispatch } from "@/redux/store"
import { User } from "@/generated/prisma"


type AttendeeCardUser =
  Pick<SessionDetailedResponseMapped['signups'][0], 'id' | 'name' | 'role' | 'preferredName' | 'level' | 'avatarUrl'> & { isIc: boolean }
  
export default function AttendeeCard({ sessionId, currUser, user, callbackFn }:
  { sessionId: string, currUser: User, user: AttendeeCardUser, callbackFn: (fn: () => Promise<void>) => void }) {
  const dispatch = useAppDispatch()
  // Fetch avatar public url
  const { data: publicAvatarUrl, isError, error }: UseQueryResult<string | null> = useAvatarQuery(user.id)
  if (isError) {
    console.error(error.message)
    dispatch(setError(error.message))
  }

  const actionIconStyle = 'transition-all p-3 hover:bg-gray-200 rounded-full cursor-pointer'

  const handleRemoveFromSession = async () => {
    const response = await fetch(`/api/sessions/${sessionId}/remove-user`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id })
    })
    if (!response.ok) {
      console.error("Failed to remove member from session")
      dispatch(setError(response.statusText))
    }
  }

  const dropdownItems: MenuProps['items'] = [{
    label: ("Remove"), key: '0',
    onClick: () => callbackFn(handleRemoveFromSession),
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