"use client"
import CircularProgress from "../../components/ui/circular-progress"
import styles from "../styles"

export default function Page() {
  // mock data — replace with real user/session data
  const attended = 12
  const total = 15
  const percent = total > 0 ? Math.round((attended / total) * 100) : 0

  // mock attended sessions list — replace with real query data
  const sessions = [
    { id: "s1", name: "Intro to Freediving", date: "2025-11-02T18:00:00Z" },
    { id: "s2", name: "Breathhold Techniques", date: "2025-11-16T18:00:00Z" },
    { id: "s3", name: "Pool Practice", date: "2025-12-01T16:30:00Z" },
  ]

  return (
    <div className="h-[90vh] min-w-full w-fit px-8 py-8 flex flex-col gap-4 max-w-screen-lg ml-0">
      <span className={styles.heading1}>DASHBOARD</span>
      <div
        className=" grid grid-cols-[1fr_1fr] h-fit w-full items-center p-8 border-2 border-grey-100 border-opacity-50
                        rounded-lg gap-6 md:flex-row md:px-8 md:py-6 md:gap-10">
        {/** Grid row 1 - 1 */}
        <div className="flex flex-col md:flex-row min-w-fit h-full rounded-xl bg-muted/50 p-6 items-center gap-4">
          <CircularProgress value={percent} size={100} strokeWidth={10} />
          <div>
            <h1 className="text-sm font-medium">Attendance</h1>
            <h1 className="text-xs text-muted-foreground">
              {attended} of {total} sessions
            </h1>
          </div>
        </div>
        {/** Grid row 1 - 2 */}
        <div className="flex flex-col min-w-fit w-full h-full rounded-xl bg-muted/50 p-4 items-center ">
          <h1 className={styles.heading3 + " px-3 text-nowrap"}>Personal Bests</h1>
          <div className="my-auto">
            <p className={styles.paragraph}>Static: -</p>
            <p className={styles.paragraph}>DYNB: -</p>
            <p className={styles.paragraph}>DNF: -</p>
          </div>
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
