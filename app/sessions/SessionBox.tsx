import { UserIcon } from "@heroicons/react/24/outline";
import LevelLabel from "@/components/LevelLabel";
import Link from "next/link";

interface SessionBoxProps {
  id: string;
  name: string;
  date: string;
  time: string;
  numPax: number;
  levels: string[];
}

export default function SessionBox({ props }: { props: SessionBoxProps }) {
  return (
    <div className="flex flex-col h-full justify-between rounded-xl border border-grey-100 px-5 py-5">
      <Link href="/sessions/[id]" as={`/sessions/${props.id}`}>
        <div className="flex flex-col gap-1.5">
          <span className="font-heading text-[17px] font-bold leading-tight w-4/5">
            {props.name.toUpperCase()}
          </span>
          <div className="flex gap-2">
            <span className="text-grey-500 text-[14px]">{props.date}</span>
            <span className="text-grey-500 text-[14px]">{props.time}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <div className="flex pr-1">
              <UserIcon className="h-3.5 my-auto text-grey-500" />
              <span className="text-grey-500 text-[14px]">{props.numPax}</span>
            </div>
            {props.levels.map((level) => (
              <LevelLabel label={level} />
            ))}
          </div>
        </div>
      </Link>
      <button className="mt-3 font-heading text-white bg-blue-500 text-white rounded-md font-bold text-[16px] py-1.5">
        SIGN UP
      </button>
    </div>
  );
}
