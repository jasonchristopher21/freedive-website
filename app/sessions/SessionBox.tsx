import { getDateString, getTimeString } from "@/app/common/functions/dateTimeUtils";
import RenderButton from "@/app/sessions/RenderButton";
import LevelLabel from "@/components/LevelLabel";
import { useAppSelector } from "@/redux/store";
import { UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Session, Signup } from "../types";

type SessionBoxProps = Session & {signups: Pick<Signup,'id'>[]}

export default function SessionBox({ props }: {props: SessionBoxProps}) {
  const user = useAppSelector((state) => state.user.user);
  const userId = user?.id || "";

  const handleSignup = async () => {
    await fetch("/api/sessions/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: props.id,
        userId: userId,
      }),
    }).then(async (response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        const err = await response.json()
        throw new Error(err.error)
      }
    }).catch((error) => {
      console.error("Error during signup:", error);
      alert(error.message);
    });
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
              <span className="text-grey-500 text-[14px]">{props.signups?.length || 0}/{props.maxParticipants}</span>
            </div>
            {props.levels.map((level) => (
              <LevelLabel label={level} key={level} />
            ))}
          </div>
        </div>
      </Link>
      <RenderButton props={props} />
    </div>
  );
}
