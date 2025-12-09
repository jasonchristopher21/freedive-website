import { Select } from "antd"
import { CcaRoles } from "../types"
import { Prisma, User } from "@prisma/client"
import React, { SetStateAction } from "react";

type UserWithRole = Prisma.UserGetPayload<{
  include: { role: true };
}>;

type Edit = {
  confirm: () => Promise<void>,
  cancel: () => void
}

interface Props {
    userRow: UserWithRole
    userList: UserWithRole[]
    setEdit: React.Dispatch<SetStateAction<Edit | null>>
    refetch: () => void
}

const updateCcaRole = async (userId: string, role: string) => {
  const response = await fetch("/api/user/update-ccarole", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      role: role,
    })
  })
  if (!response.ok) {
    throw new Error("Failed to update CCA role")
  }
}


export default function EditSelect({ userRow, userList, setEdit, refetch }: Props) {

    return (
        <Select
          style={{ width: '100%' }}
          options={Object.values(CcaRoles)
            .filter(k => typeof k === 'string')
            .map(k => { return { value: k } })} value={userRow.role.name}
          onChange={v => {
            const old = userList.find(u => u.id === userRow.id)!
            if (old.role.name === v) {
              return
            }
            // If user confirms change, send request to update database, then refetch.
            setEdit({
              confirm: async () => {
                await updateCcaRole(old.id, v)
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