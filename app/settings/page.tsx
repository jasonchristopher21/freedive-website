"use client"

import { Label } from "@/components/ui/label";
import MemberGuard from "../common/authguard/MemberGuard";
import styles from "../styles";
import { useAppSelector } from "@/redux/store";
import { Avatar } from "antd";
import { useEffect, useState } from "react";
import Loading from "../Loading";


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
                <UserAvatar url={user.avatarUrl} />
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

function UserAvatar({url}: {url: string | null}) {
    const [blobUrl, setBlobUrl] = useState<string>()
    useEffect(() => {
        if (!url) {
            return
        }

    }, [url])
    return (
        <Avatar src={url}/>
    )
}