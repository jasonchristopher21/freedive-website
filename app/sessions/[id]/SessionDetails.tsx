import { SessionDetailedResponseMapped } from "@/app/api/sessions/[id]/route";
import { getDateString, getTimeString } from "@/app/common/functions/dateTimeUtils";
import styles from "@/app/styles";
import LevelLabel from "@/components/LevelLabel";
import { UserIcon } from "lucide-react";

export default function SessionDetails(session:
  Pick<SessionDetailedResponseMapped, 'name' | 'date' | 'startTime' | 'endTime' | 'maxParticipants' | 'lanes' | 'levels'>
  & { numberOfParticipants: number }) {
  return (
    <>
      {/** Session name */}
      <span className="font-heading font-bold text-[22px] leading-tight">
        {session.name.toUpperCase()}
      </span>

      <div className="flex flex-col gap-1">
        {/** Date */}
        <span className={`${styles.paragraph}`}>
          {getDateString(session.date)}
        </span>

        {/** Time */}
        <span className={`${styles.paragraph}`}>
          {getTimeString(session.startTime)} - {getTimeString(session.endTime)}
        </span>
        <div className="flex">

          {/** Lanes and pax */}
          <span className={`${styles.paragraph}`}>
            Lanes {session.lanes.join(", ")}
          </span>
          <UserIcon className="ml-3 h-4 my-auto text-grey-500" />
          <span className={`ml-1 ${styles.paragraph}`}>
            {session.numberOfParticipants}/{session.maxParticipants}
          </span>
        </div>

        {/** Levels */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {session.levels.map((level) => (
            <LevelLabel label={level} key={level} />
          ))}
        </div>
      </div>
    </>
  )
}