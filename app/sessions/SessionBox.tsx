import { getDateString, getTimeString } from "@/app/common/functions/dateTimeUtils"
import RenderButton from "@/app/sessions/RenderButton"
import LevelLabel from "@/components/LevelLabel"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { UserIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { Session, Signup } from "../types"
import { MoreOutlined } from "@ant-design/icons"
import { Dropdown, MenuProps } from "antd"
import { setError } from "@/redux/features/error/errorSlice"
import { hasPermission } from "../access-rules"

type SessionBoxProps = Session & { signups: Pick<Signup, "id">[] }

export default function SessionBox({ props, refresh }: { props: SessionBoxProps; refresh: () => Promise<void> }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.user)!

  const dropdownItems: MenuProps['items'] = [{
      label: ("Delete"), key: '0',
      onClick: async (e) => {
        e.domEvent.preventDefault()
        const response = await fetch(`/api/sessions/${props.id}`, {
          method: "DELETE"
        })

        if (!response.ok) {
          const data = await response.json()
          console.error(data.error)
          dispatch(setError(data.error))
        } else {
          await refresh()
        }
      },
    }]

  return (
    <div className="flex flex-col h-full justify-between rounded-xl border border-grey-100 px-5 pb-5">
      <Link href="/sessions/[id]" as={`/sessions/${props.id}`}>
        <div className="flex flex-col gap-1.5">
          <div className="flex min-h-10 justify-between items-end">
            <span className="font-heading text-[17px] font-bold leading-tight">{props.name.toUpperCase()}</span>
            {hasPermission(user, "sessions", "delete-session") && <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
              <MoreOutlined className="translate-y-2 transition-all p-3 hover:bg-gray-200 rounded-full cursor-pointer" onClick={e => e.preventDefault()}/>
            </Dropdown>}
          </div>
          <div className="flex gap-1.5">
            <span className="text-grey-500 text-[14px]">{getDateString(props.date)}</span>
            <span className="bg-grey-300 w-1 h-1 rounded-full my-auto" />
            <span className="text-grey-500 text-[14px]">
              {getTimeString(props.startTime)} - {getTimeString(props.endTime)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <div className="flex pr-1">
              <UserIcon className="h-3.5 my-auto text-grey-500" />
              <span className="text-grey-500 text-[14px]">
                {props.signups?.length || 0}/{props.maxParticipants}
              </span>
            </div>
            {props.levels.map((level) => (
              <LevelLabel label={level} key={level} />
            ))}
          </div>
        </div>
      </Link>
      <RenderButton props={props} refresh={refresh} />
    </div>
  )
}
