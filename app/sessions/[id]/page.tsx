"use client"

import styles from "@/app/styles"
import { useSessionDetailQuery } from "@/queries/useSessionDetailQuery"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import TrainingPlan from "./TrainingPlan"

import MemberGuard from "@/app/common/authguard/MemberGuard"
import Loading from "@/app/Loading"
import ConfirmEditModal, { EditModalProps } from "@/app/users/ConfirmEditModal"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import RenderButton from "../RenderButton"
import SessionDetails from "./SessionDetails"
import SessionHeader from "./SessionHeader"
import AttendeeCard from "./AttendeeCard"
import { setError } from "@/redux/features/error/errorSlice"

export default function PageAuth() {
  return (
    <MemberGuard>
      <Page />
    </MemberGuard>
  )
}

function Page() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { id } = useParams() // Session ID
  const currUser = useAppSelector((state) => state.user.user)!
  const { data: session, isLoading, isError, error, refetch } = useSessionDetailQuery(id as string)
  const [editModal, setEditModal] = useState<EditModalProps | null>(null)

  const [loading, setLoading] = useState(true)
  if (!isLoading) setTimeout(() => setLoading(false), 500) // Artificially increase loading time
  if (loading) return <Loading />

  if (isError) {
    console.error(error.message)
    dispatch(setError(error.message))
    return <div>ERROR</div>
  }
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-grey-500">Session not found</span>
      </div>
    )
  }

  /** Executes the function only on confirmation in EditModal */
  const dispatchEdit = (fn: () => Promise<void>) => {
    setEditModal({
      confirm: async () => {
        await fn()
        await refetch()
        setEditModal(null)
      },
      cancel: () => {
        setEditModal(null)
      },
    })
  }

  const icList = session.ics.map((ic) => ic.id)
  const userList = session.signups.map((u) => {
    return { ...u, isIc: icList.includes(u.id) }
  })

  return (
    <SidebarInset>
      <SessionHeader name={session.name} />
      <div>
        <div className="px-4 py-6 flex flex-col gap-4 max-w-screen-xl mx-auto">
          <SessionDetails {...session} numberOfParticipants={userList.length} />
          <div>
            {/** Attendees */}
            <span className={`${styles.heading2}`}>ATTENDEES</span>
            <div className="flex flex-col border rounded-lg border-grey-300 max-w-screen-lg p-4 mt-2">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userList.map((user) => (
                  <AttendeeCard sessionId={session.id} currUser={currUser} user={user} key={user.id} callbackFn={dispatchEdit} />
                ))}
              </div>
              <div className="w-full mt-2">
                <RenderButton
                  refresh={async () => {
                    await refetch()
                  }}
                  props={session}
                />
              </div>
            </div>
            {editModal && <ConfirmEditModal confirm={editModal.confirm} cancel={editModal.cancel} />}
          </div>

          {/* Description Box */}
          {session.description && session.description.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className={`${styles.heading2}`}>DESCRIPTION</span>
              <span className={`${styles.paragraph}`}>{session.description}</span>
            </div>
          )}

          {/* Training Plan */}
          {session.trainingPlan && <TrainingPlan props={session.trainingPlan} />}
        </div>
      </div>
    </SidebarInset>
  )
}
