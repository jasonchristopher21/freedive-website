"use client"
import { useAvatarQuery } from "@/queries/useAvatarQuery"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { CheckOutlined, CloseCircleOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { useEffect, useRef, useState } from "react"
import MemberGuard from "../common/authguard/MemberGuard"
import styles from "../styles"
import { UseQueryResult } from "@tanstack/react-query"
import { setUser } from "@/redux/features/user/userSlice"
import { Input } from "antd"
import { useDispatch } from "react-redux"
import { setError } from "@/redux/features/error/errorSlice"
import { User } from "@/generated/prisma"
import { toDisplayText } from "../common/functions/userUtils"

export default function SettingsPageAuth() {
  return (
    <MemberGuard>
      <SettingsPage />
    </MemberGuard>
  )
}

function SettingsPage() {
  const user = useAppSelector((state) => state.user.user)!

  return (
    <div className="flex flex-col px-8 py-8 justify-center items-center min-w-full max-w-screen-lg ml-0">
      <div className="flex flex-col w-fit gap-4">
        <span className={styles.heading1 + " place-self-start"}>SETTINGS</span>
        <div
          className="p-6 border-2 border-grey-100 border-opacity-50 rounded-lg flex flex-col gap-2 w-fit
                      md:px-20 md:py-12 md:gap-4">
          {/** Row 1 */}
          <div className="flex flex-col gap-4 items-center md:flex-row md:gap-24 md:pl-10">
            <EdittableAvatar user={user} />
            <EdittableName user={user} />
          </div>

          <div className="w-full border-t-2 border-grey-200 mt-4 mb-6" />

          <div className="flex flex-col md:pl-10 gap-4">
            {/** Row 2 */}
            <div className="flex flex-col items-center md:flex-row md:gap-12">
              <h1 className={styles.heading3 + " md:min-w-[200]"}>Preferred name: </h1>
              <EdittableAttribute user={user} attribute="preferredName" />
            </div>

            <div className="flex flex-col items-center md:flex-row md:gap-12">
              <h1 className={styles.heading3 + " md:min-w-[200]"}>Telegram Handle: </h1>
              <EdittableAttribute user={user} attribute="telegramHandle" />
            </div>

            <div className="flex flex-col items-center md:flex-row md:gap-12">
              <h1 className={styles.heading3 + " md:min-w-[200]"}>Email: </h1>
              <h1 className={styles.heading3 + " pl-4"}>{user.email}</h1>
            </div>

            <div className="flex flex-col items-center md:flex-row md:gap-12">
              <h1 className={styles.heading3 + " md:min-w-[200]"}>NUSNet Email: </h1>
              <h1 className={styles.heading3 + " pl-4"}>{user.nusnetEmail}</h1>
            </div>

            <div className="flex flex-col items-center md:flex-row md:gap-12">
              <h1 className={styles.heading3 + " md:min-w-[200]"}>Year of Study: </h1>
              <h1 className={styles.heading3 + " pl-4"}>{toDisplayText(user.yearOfStudy)}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EdittableAvatar({ user }: { user: User }) {
  const dispatch = useAppDispatch()

  // Fetch avatar public url
  const { data: publicAvatarUrl, isLoading, isRefetching, isRefetchError, isError, error, refetch }: UseQueryResult<string | null> = useAvatarQuery(user.id)

  if (isError || isRefetchError) {
    console.error(error.message)
    dispatch(setError("Failed to fetch avatar: " + error.message))
  }

  // Use timestamp to prevent browser from caching the result due to the same file name being used.
  const [timestamp, setTimestamp] = useState<number>(new Date().getTime())
  const ref = useRef<HTMLInputElement>(null) // Allows input to be clicked

  const validateAndUploadFile = async (file: File | null) => {
    const ACCEPTED_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"]
    const MAX_FILE_SIZE = 1 << 21 // 2 MB

    if (!file) {
    } else if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      const message = "Image file not suitable! Accepted file types: PNG, JPG, JPEG"
      console.log(message)
      dispatch(setError(message))
    } else if (file.size > MAX_FILE_SIZE) {
      const message = "Image file too large! Max file size: 2 MB"
      console.log(message)
      dispatch(setError(message))
    } else {
      const filetype = file.name.split(".").pop()
      const filename = `${user.id}.${filetype}` // The name of the file to be stored in Users table and Storage

      const updateImage = async () => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("filename", filename)
        const response = await fetch(`/api/user/${user.id}/avatar`, {
          method: "PATCH",
          body: formData,
        })
        if (response.ok) {
          dispatch(setUser({ ...user, avatarUrl: filename }))
          setTimestamp(new Date().getTime())
          await refetch()
        } else {
          console.error("Failed to update image:", response.statusText)
          dispatch(setError("Failed to update image: " + response.statusText))
        }
      }

      await updateImage()
    }
  }

  // Displays a overlay that allows uploading of image file when clicked.
  const UploadInput = () => (
    <div className="flex justify-center items-center h-full w-full">
      <img src={publicAvatarUrl ? publicAvatarUrl + "?t=" + timestamp : undefined} />
      <input
        ref={ref}
        className="hidden bg-gray-100"
        type="file"
        onChange={(e) => {
          validateAndUploadFile(e.target.files && e.target.files[0])
        }}
        accept="image/png, image/jpg, image/jpeg"
      />
      <div
        id="hover-upload-overlay"
        className={`flex flex-col items-center justify-center absolute top-0 left-0 w-full h-full
        transition-opacity ${publicAvatarUrl ? "opacity-0 hover:opacity-50" : "opacity-50 hover:opacity-100"} cursor-pointer bg-gray-100`}
        onClick={(e) => ref.current?.click()}>
        <PlusOutlined />
        <div style={{ marginTop: 4 }}>Upload</div>
      </div>
    </div>
  )

  return (
    <>
      <svg width={150} height={150} viewBox="0 0 100 100">
        <defs>
          <clipPath id="cut-circle">
            <circle cx={50} cy={50} r={48.5} />
          </clipPath>
          <clipPath id="cut-circle-outline">
            <circle cx={50} cy={50} r={50} />
          </clipPath>
        </defs>
        {isLoading || isRefetching ? (
          <circle cx={50} cy={50} r={50} fill="white" clipPath="url(#cut-circle)" />
        ) : (
          <>
            <circle cx={50} cy={50} r={50} fill="navy" fillOpacity={0.5} clipPath="url(#cut-circle-outline)" />
            <circle cx={50} cy={50} r={50} fill="white" clipPath="url(#cut-circle)" />
            <foreignObject width={100} height={100} clipPath="url(#cut-circle)">
              <UploadInput />
            </foreignObject>
          </>
        )}
      </svg>
    </>
  )
}

function EdittableName({ user }: { user: User }) {
  const actionIconStyle = "transition-all p-3 hover:bg-gray-200 rounded-full cursor-pointer"

  const [edit, setEdit] = useState<boolean>(false)
  const [editName, setEditName] = useState<string>(user.name)

  return (
    <div className="flex min-w-[300] p-4 items-center border-2 shadow-md">
      {edit ? (
        <>
          <Input value={editName} onChange={(e) => setEditName(e.target.value)} className={styles.heading2 + " mr-auto w-44"} variant="underlined" />
          <CheckOutlined className={actionIconStyle} onClick={() => {}} />
          <CloseCircleOutlined
            className={actionIconStyle}
            onClick={() => {
              setEdit(false)
              setEditName(user.name)
            }}
          />
        </>
      ) : (
        <>
          <h1 className={styles.heading1 + " mr-auto pl-2"}>{user.name}</h1>
          <EditOutlined className={actionIconStyle} onClick={() => setEdit(true)} />
        </>
      )}
    </div>
  )
}

type UserAttribute = "name" | "preferredName" | "email" | "telegramHandle"
function EdittableAttribute({ user, attribute }: { user: User; attribute: UserAttribute }) {
  const actionIconStyle = "transition-all p-3 hover:bg-gray-200 rounded-full cursor-pointer"

  const dispatch = useDispatch()
  const data = user[attribute]
  const [edit, setEdit] = useState<boolean>(false)
  const [editAttribute, setEditAttribute] = useState<string>(data || "")

  const handlePrefNameUpdate = async () => {
    const newData = editAttribute === "" ? null : editAttribute

    if (newData === data) {
      setEdit(false)
      return
    }

    const response = await fetch(`/api/user/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        data: newData,
        type: attribute,
      }),
    })
    if (!response.ok) {
      console.error("Failed to update " + attribute)
      dispatch(setError({ message: `Failed to update ${attribute}:`, response }))
    } else {
      dispatch(setUser({ ...user, [attribute]: newData }))
    }
    setEdit(false)
  }

  return (
    <div className="flex min-w-[300] px-4 py-0 items-center border-[1px] border-gray-300 shadow-sm">
      {edit ? (
        <>
          <Input value={editAttribute} onChange={(e) => setEditAttribute(e.target.value)} className={styles.heading3 + " mr-auto w-44"} variant="underlined" />
          <CheckOutlined className={actionIconStyle} onClick={handlePrefNameUpdate} />
          <CloseCircleOutlined
            className={actionIconStyle}
            onClick={() => {
              setEdit(false)
              setEditAttribute(data || "")
            }}
          />
        </>
      ) : (
        <>
          <h1 className={styles.heading2 + " mr-auto pl-2"}>{data}</h1>
          <EditOutlined className={actionIconStyle} onClick={() => setEdit(true)} />
        </>
      )}
    </div>
  )
}
