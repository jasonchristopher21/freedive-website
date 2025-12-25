"use client"
import { useUserSessionHistoryQuery } from "@/queries/useUserSessionHistory"
import CircularProgress from "../../components/ui/circular-progress"
import styles from "../styles"
import { useAppSelector } from "@/redux/store"
import MemberGuard from "../common/authguard/MemberGuard"
import Loading from "../Loading"
import { Session } from "@prisma/client"

export default function PageAuth() {
  return (
    <MemberGuard>
      <Page />
    </MemberGuard>
  )
}

function Page() {
  const user = useAppSelector((state) => state.user.user)!

  const { data, isLoading } = useUserSessionHistoryQuery(user.id)

  if (isLoading) {
    return <Loading />
  }

  const sessions = data as Session[]
  const attended = sessions.length
  const total = 69
  const percent = total > 0 ? Math.round((attended / total) * 100) : 0

  return (
    <div className="h-[90vh] min-w-full w-fit px-8 py-8 flex flex-col gap-4 max-w-screen-lg ml-0">
      <span className={styles.heading1}>DASHBOARD</span>
      <div
        className=" grid grid-cols-[1fr_1fr] h-fit w-full items-center p-8 border-2 border-grey-100 border-opacity-50
                        rounded-lg gap-6 md:flex-row md:px-8 md:py-6 md:gap-10">
        {/** Grid row 1 - 1 */}
        <div  className="flex flex-col h-full rounded-xl bg-muted/50 p-4 justify-center items-center gap-4">
          <div className="flex flex-col md:flex-row h-full justify-center items-center gap-4">
            <CircularProgress value={percent} size={100} strokeWidth={10} />
            <div>
              <h1 className="text-sm font-medium">Attendance</h1>
              <h1 className="text-xs text-muted-foreground">
                {attended} of {total} sessions
              </h1>
            </div>
          </div>
          <h1 className={styles.paragraph + " py-3"}>Hit 50% attendance to get the teamNUS shirt!</h1>
        </div>
        {/** Grid row 1 - 2 */}
        <div className="flex flex-col min-w-fit w-full h-full rounded-xl bg-muted/50 p-4 items-center ">
          <h1 className={styles.heading3 + " px-3 text-nowrap"}>Personal Bests</h1>
          <div className="my-auto">
            <p className={styles.paragraph}>Static: -</p>
            <p className={styles.paragraph}>DYNB: -</p>
            <p className={styles.paragraph}>DNF: -</p>
          </div>
          <h1 className={styles.paragraph + " py-3"}>Reach 100m DYNB to get our exclusive biege 100m shirt!</h1>
        </div>

        {/** Grid 2 */}
        <div className="block col-span-2 items-center justify-between rounded-xl bg-muted/50 p-6">
          <div>
            <div className="text-sm font-medium">Attended Sessions</div>
            <div className="text-xs text-muted-foreground">Recent sessions you've attended</div>
          </div>
          <ul className="mt-4 divide-y divide-muted/60">
            {sessions.map((s) => {
              const d = new Date(s.date)
              const dateStr = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
              return (
                <li key={s.id} className="py-3 flex items-center justify-between">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{dateStr}</div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
