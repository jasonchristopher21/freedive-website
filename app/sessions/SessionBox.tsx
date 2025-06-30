import { UserIcon } from "@heroicons/react/24/outline";
import LevelLabel from "@/components/LevelLabel";
import Link from "next/link";
import { Session } from "@prisma/client";
import { getDateString, getTimeString } from "@/app/common/functions/dateTimeUtils";
import { useAppSelector } from "@/redux/store";

type SessionBoxProps = Session & { Signup?: { userId: string }[] };

export default function SessionBox({ props }: { props: SessionBoxProps }) {
  const user = useAppSelector((state) => state.user.user);
  const userId = user?.id || "";

  const RenderButton = () => {
    // If user already signed up for the session
    if (props.Signup && props.Signup.length > 0 && userId && props.Signup.some((signup) => signup.userId === userId)) {
      return (
        <button disabled className="mt-3 font-heading text-white bg-green-500 text-white rounded-md font-bold text-[16px] py-1.5">
          CONFIRMED
        </button>
      );
    }

    // If session is full
    if (props.Signup && props.Signup.length >= props.maxParticipants) {
      return (
        <button disabled className="mt-3 font-heading text-white bg-grey-300 text-white rounded-md font-bold text-[16px] py-1.5">
          FULL
        </button>
      );
    }

    // If user level is not suitable for the session
    if (props.levels.length > 0 && user?.level && !props.levels.includes(user.level)) {
      return (
        <button disabled className="mt-3 font-heading text-white bg-grey-300 text-white rounded-md font-bold text-[16px] py-1.5">
          LOCKED
        </button>
      )
    }

    return (
      <button className="mt-3 font-heading text-white bg-blue-500 text-white rounded-md font-bold text-[16px] py-1.5">
        SIGN UP
      </button>
    );

  }

  return (
    <div className="flex flex-col h-full justify-between rounded-xl border border-grey-100 px-5 py-5">
      <Link href="/sessions/[id]" as={`/sessions/${props.id}`}>
        <div className="flex flex-col gap-1.5">
          <span className="font-heading text-[17px] font-bold leading-tight w-4/5">
            {props.name.toUpperCase()}
          </span>
          <div className="flex gap-1.5">
            <span className="text-grey-500 text-[14px]">{getDateString(props.date)}</span>
            <span className="bg-grey-300 w-1 h-1 rounded-full my-auto" />
            <span className="text-grey-500 text-[14px]">{getTimeString(props.startTime)} - {getTimeString(props.endTime)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <div className="flex pr-1">
              <UserIcon className="h-3.5 my-auto text-grey-500" />
              <span className="text-grey-500 text-[14px]">{props.Signup?.length || 0}/{props.maxParticipants}</span>
            </div>
            {props.levels.map((level) => (
              <LevelLabel label={level} key={level} />
            ))}
          </div>
        </div>
      </Link>
      <RenderButton />
    </div>
  );
}
