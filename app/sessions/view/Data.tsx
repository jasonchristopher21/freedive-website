import { exportExcel } from "@/app/actions"
import { Month, SessionQueryWithSignups } from "@/app/types"
import { format } from "date-fns"
import { saveAs } from "file-saver"
import { ArrowUpRightFromSquare } from "lucide-react"
import SessionBox from "../SessionBox"


export default function Data({ sessions, date }: {
    sessions: SessionQueryWithSignups[], date: {month: Month, year: number}
}) {

    


    return (
        <>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session: SessionQueryWithSignups) => <SessionBox props={session} key={session.id} />)}
            </div>
        </>
    )
}