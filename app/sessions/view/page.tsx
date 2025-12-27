"use client"

import { exportExcel } from "@/app/actions"
import AdminGuard from "@/app/common/authguard/AdminGuard"
import Loading from "@/app/Loading"
import styles from "@/app/styles"
import { Month } from "@/app/types"
import { Label } from "@/components/ui/label"
import { useMonthlySessionsQuery } from "@/queries/useMonthlySessionsQuery"
import { Select } from "antd"
import { format } from "date-fns"
import saveAs from "file-saver"
import { ArrowUpRightFromSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { z } from "zod"
import SessionBox from "../SessionBox"
import { useAppDispatch } from "@/redux/store"
import { setError } from "@/redux/features/error/errorSlice"

const formSchema = z.object({
  month: z.nativeEnum(Month),
  year: z.number(),
})

export default function ViewSessionsPageAuth() {
  return (
    <AdminGuard>
      <ViewSessionsPage />
    </AdminGuard>
  )
}

function ViewSessionsPage() {
  const dispatch = useAppDispatch()
  const [date, setDate] = useState<{ month: Month; year: number }>({ month: parseInt(format(new Date(), "M")), year: parseInt(format(new Date(), "y")) })

  const { data: sessions = [], isLoading, error, isError, refetch } = useMonthlySessionsQuery(date)

  const [loading, setLoading] = useState(true)
	useEffect(() => {
		if (!isLoading) {
			const timer = setTimeout(() => setLoading(false), 500) // Artificially increase loading time
			return () => clearTimeout(timer)
		} else {
			setDate({...date})
		}
	}, [date])

  if (isError) {
    console.error("Failed to fetch monthly sessions", error.message)
    dispatch(setError("Failed to fetch monthly sessions: " + error.message))
  }

  const ex = async () => {
    const monthWithYear = format(new Date(date.year + "-" + date.month), "MMMM Y")
    const buffer = await exportExcel(sessions, monthWithYear)
    saveAs(new Blob([buffer]), monthWithYear.replace(" ", "_") + "_OSA_Sports_Attendance_for_NUS_Dive_Freedive.xlsx")
  }

  return (
    <div className="min-h-[90vh] min-w-full px-8 py-8 flex flex-col gap-4 max-w-screen-lg ml-0">
      <span className={styles.heading1}>VIEW SESSIONS</span>
      <div
        className="flex flex-col h-full w-full items-center p-8 border-2 border-grey-100 border-opacity-50 rounded-lg gap-6 
													md:flex-row md:px-8 md:py-6 md:gap-10">
        <div className="flex items-center gap-4">
          <Label>Month: </Label>
          <Select
            className="min-w-36 w-1/5"
            defaultValue={date.month}
            onChange={(v) => (setDate({ ...date, month: v }), setLoading(true))}
            options={[
              { value: Month.JANUARY, label: "January" },
              { value: Month.FEBRUARY, label: "February" },
              { value: Month.MARCH, label: "March" },
              { value: Month.APRIL, label: "April" },
              { value: Month.MAY, label: "May" },
              { value: Month.JUNE, label: "June" },
              { value: Month.JULY, label: "July" },
              { value: Month.AUGUST, label: "August" },
              { value: Month.SEPTEMBER, label: "September" },
              { value: Month.OCTOBER, label: "October" },
              { value: Month.NOVEMBER, label: "November" },
              { value: Month.DECEMBER, label: "December" },
            ]}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label>Year: </Label>
          <Select defaultValue={date.year} onChange={(v) => setDate({ ...date, year: v })} options={[{ value: 2025 }]} />
        </div>
        <button
          className={`font-heading text-white 
								${sessions.length == 0 ? "bg-gray-500 cursor-not-allowed" : "bg-navy cursor-pointer"}
								rounded-md font-bold text-[16px] py-1.5 px-6 min-w-fit mx-auto`}
          onClick={ex}
          disabled={sessions.length == 0}>
          <div className="flex flex-row gap-3 justify-center">
            <ArrowUpRightFromSquare />
            EXPORT
          </div>
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : sessions.length == 0 ? (
        <h1 className="flex mt-10 items-center justify-center font-bold text-2xl">No Sessions Found!</h1>
      ) : (
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionBox
              props={session}
              key={session.id}
              refresh={async () => {
								setLoading(true)
                await refetch()
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
