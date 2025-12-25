"use client"

import { setError } from "@/redux/features/error/errorSlice";
import { setUser } from "@/redux/features/user/userSlice";
import { useAppDispatch } from "@/redux/store";
import { Prisma } from "@prisma/client";
import { Select, Space, Tag } from "antd";
import React, { SetStateAction } from "react";
import { AccessRole } from "@/app/types"
import { User } from "@/generated/prisma"

type UserWithRole = Prisma.UserGetPayload<{
  include: { role: true };
}>;

type Edit = {
  confirm: () => Promise<void>,
  cancel: () => void
}

interface Props {
  user: User
  userRow: UserWithRole
  oldValue: string
  setEdit: React.Dispatch<SetStateAction<Edit | null>>
  refetch: () => void
}

const getTableAccessRoleColor = (role: string) => {
  switch (role) {
    case "MEMBER":
      return "green";
    case "IC":
      return "blue";
    case "ADMIN":
      return "red";
    default:
      return "default";
  }
};

const updateAccessRole = async (userId: string, role: AccessRole) => {
  const response = await fetch("/api/user/update-access-role", {
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


export default function EditAccessRolesSelect({ user, userRow, oldValue, setEdit, refetch }: Props) {
  const dispatch = useAppDispatch()
  return (
      <Select
        variant="borderless"
        style={{ width: '100%' }}
        labelRender={props => <Space size="middle"><Tag color={getTableAccessRoleColor(props.value as AccessRole)}>{props.value}</Tag></Space>}
        options={Object.values(AccessRole)
          .filter(k => typeof k === 'string')
          .map(k => { return { value: k } })} value={userRow.accessRole}
        onChange={v => {
          if (oldValue === v) {
            return
          }
          // If user confirms change, send request to update database, then refetch.
          setEdit({
            confirm: async () => {
              await updateAccessRole(userRow.id, v)
              // Change own credentials
              if (user.id === userRow.id) {
                const response = await fetch("/api/user/status")
                if (!response.ok) {
                  console.error("Failed to refetch user data")
                  dispatch(setError("Failed to refetch user data: " + response.statusText))
                } else {
                  const newUser = (await response.json()).user as User
                  dispatch(setUser(newUser))
                }
              }
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