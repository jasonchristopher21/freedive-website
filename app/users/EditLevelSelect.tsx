"use client"

import { Prisma } from "@/generated/prisma"
import { Select, Space, Tag } from "antd"
import { SetStateAction } from "react"
import { Level } from "@/app/types"
import { getTableLevelColor } from "../common/functions/userUtils"

type UserWithRole = Prisma.UserGetPayload<{
    include: { role: true };
}>;

type Edit = {
    confirm: () => Promise<void>,
    cancel: () => void
}


const updateLevel = async (userId: string, level: Level) => {
    const response = await fetch("/api/user/update-level", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId,
            level: level,
        })
    })
    if (!response.ok) {
        throw new Error("Failed to update CCA role")
    }
}

interface Props {
    userRow: UserWithRole
    userList: UserWithRole[]
    setEdit: React.Dispatch<SetStateAction<Edit | null>>
    refetch: () => void
}

export default function EditLevelSelect({ userRow, userList, setEdit, refetch }: Props) {
    return (
        <Select
            variant='borderless'
            style={{ width: '100%' }}
            options={Object.values(Level)
                .filter(k => typeof k === 'string')
                .map(k => { return { value: k } })} value={userRow.level}
            labelRender={props => <Space size="middle"><Tag color={getTableLevelColor(props.value as Level)}>{props.value}</Tag></Space>
            }
            onChange={v => {
                const old = userList.find(u => u.id === userRow.id)!
                if (old.role.name === v) {
                    return
                }
                // If user confirms change, send request to update database, then refetch.
                setEdit({
                    confirm: async () => {
                        await updateLevel(old.id, v as Level)
                        refetch()
                        setEdit(null)
                    },
                    cancel: () => {
                        setEdit(null)
                    }
                })
            }} />
    )
}