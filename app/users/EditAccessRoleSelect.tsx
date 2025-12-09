import { AccessRole, Prisma } from "@prisma/client";
import { Select, Space, Tag } from "antd";
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


export default function EditAccessRolesSelect({ userRow, userList, setEdit, refetch }: Props) {

  return (
      <Select
        variant="borderless"
        style={{ width: '100%' }}
        labelRender={props => <Space size="middle"><Tag color={getTableAccessRoleColor(props.value as AccessRole)}>{props.value}</Tag></Space>}
        options={Object.values(AccessRole)
          .filter(k => typeof k === 'string')
          .map(k => { return { value: k } })} value={userRow.accessRole}
        onChange={v => {
          const old = userList.find(u => u.id === userRow.id)!
          if (old.accessRole === v) {
            return
          }
          // If user confirms change, send request to update database, then refetch.
          setEdit({
            confirm: async () => {
              await updateAccessRole(old.id, v)
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