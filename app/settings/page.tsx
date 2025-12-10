"use client"
import { useAvatarQuery } from '@/queries/useAvatarQuery';
import { useAppSelector } from "@/redux/store";
import { PlusOutlined } from '@ant-design/icons';
import { User } from '@prisma/client';
import { useEffect, useRef, useState } from "react";
import MemberGuard from "../common/authguard/MemberGuard";
import styles from "../styles";
import { UseQueryResult } from '@tanstack/react-query';


export default function SettingsPageAuth() {
  return (
    <MemberGuard>
      <SettingsPage />
    </MemberGuard>
  )
}

function SettingsPage() {
  const user = useAppSelector(state => state.user.user)!

  return (
    <div className="flex flex-col px-8 py-8 min-w-full justify-center gap-4 max-w-screen-lg ml-0">
      <span className={styles.heading1}>SETTINGS</span>
      <div className="p-4 md:px-8 md:py-6 border-2 border-grey-100 border-opacity-50 rounded-lg flex flex-col gap-2 md:gap-0">
        <h1 className={styles.heading1}>{user.name}</h1>
        <AvatarUpload user={user} />
        <h1 className={styles.heading1}>{user.preferredName}</h1>
        <h1 className={styles.heading1}>{user.email}</h1>
        <h1 className={styles.heading1}>{user.nusnetEmail}</h1>
        <h1 className={styles.heading1}>{user.yearOfStudy}</h1>
        <h1 className={styles.heading1}>{user.telegramHandle}</h1>
        <h1 className={styles.heading1}>{user.remarks}</h1>
      </div>
    </div>
  )
}

function AvatarUpload({ user }: { user: User }) {
  // Fetch avatar public url
  const { data, isError, error }: UseQueryResult<string | null> = useAvatarQuery(user.avatarUrl)
  if (isError) {
    console.error(error.message)
  }
  const publicAvatarUrl: string | undefined = data || undefined

  const [file, setFile] = useState<File | null>(null)
  const ref = useRef<HTMLInputElement>(null)

  const validateAndSetFile = (file: File | null) => {
    const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg']
    const MAX_FILE_SIZE = 1 << 21
    if (file && ACCEPTED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE) {
      // console.log(file)
      setFile(file)
    }
  }

  useEffect(() => {
    if (!file) {
      return
    }
    const updateImage = async () => {
      const formData = new FormData()
      formData.append('userId', user.id)
      formData.append("file", file)
      await fetch(`/api/avatar`, {
        method: "PATCH",
        body: formData
      })
    }
    updateImage()

  }, [file])

  // Displays a overlay that allows uploading of image file when clicked.
  const UploadInput = () => (
    <div className='flex justify-center items-center h-full w-full'>
      <img src={publicAvatarUrl} />
      <input ref={ref} className='hidden bg-gray-100' type='file'
        onChange={(e) => { validateAndSetFile(e.target.files && e.target.files[0]) }} accept='image/png, image/jpg, image/jpeg' />
      <div id='hover-upload-overlay' className={`flex flex-col items-center justify-center absolute top-0 left-0 w-full h-full
        transition-opacity ${publicAvatarUrl ? 'opacity-0 hover:opacity-50' : 'opacity-50 hover:opacity-100'} cursor-pointer bg-gray-100`} onClick={e => ref.current?.click()}>
        <PlusOutlined />
        <div style={{ marginTop: 4 }}>Upload</div>
      </div>
    </div>
  )
  return (
    <>
      <svg className='fill-black' width={100} height={100} viewBox='0 0 100 100'>
        <defs>
          <clipPath id='cut-circle'>
            <circle cx={50} cy={50} r={50} />
          </clipPath>
        </defs>
        <foreignObject width={100} height={100} clipPath='url(#cut-circle)'>
          <UploadInput />
        </foreignObject>
      </svg>
    </>
  )
}