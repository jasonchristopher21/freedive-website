"use client"

import { Prisma } from "@/generated/prisma";
import { Select } from "antd";
import React, { SetStateAction } from "react";
import { CcaRoles } from "../types";

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
  const response = await fetch("/api/user/update-cca-role", {
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


export default function EditCcaRolesSelect({ userRow, userList, setEdit, refetch }: Props) {

  return (
      <Select
        variant="borderless"
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