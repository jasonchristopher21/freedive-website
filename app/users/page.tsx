"use client";

import styles from "@/app/styles";
import { useUserListQuery } from "@/queries/useUserListQuery";
import { useAppSelector } from "@/redux/store";
import { AccessRole, Level, Prisma, User } from "@prisma/client";
import { UseQueryResult } from "@tanstack/react-query";
import type { TableProps } from "antd";
import { Space, Table, Tag } from "antd";
import { useState } from "react";
import { hasPermission } from "../access-rules";
import AdminGuard from "../common/authguard/AdminGuard";
import Loading from "../Loading";
import ConfirmEditModal, { EditModalProps } from "./ConfirmEditModal";
import EditCcaRolesSelect from "./EditCcaRolesSelect";
import EditLevelSelect from "./EditLevelSelect";
import EditAccessRolesSelect from "./EditAccessRoleSelect";

type UserWithRole = Prisma.UserGetPayload<{
  include: { role: true };
}>;

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

const getTableLevelColor = (level: Level) => {
  switch (level) {
    case Level.BEGINNER:
      return "green";
    case Level.INTERMEDIATE:
      return "orange";
    case Level.ADVANCED:
      return "red";
    default:
      return "blue";
  }
};

export default function PageAuth() {
  return (
    <AdminGuard>
      <Page/>
    </AdminGuard>
  )
}

function Page() {
  const user = useAppSelector(state => state.user.user)!
  const [edit, setEdit] = useState<EditModalProps | null>(null)
  const { data, isRefetchError, isLoading, error, refetch }: UseQueryResult<UserWithRole[]> = useUserListQuery();

  if (isLoading) {
    return <Loading />
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (isRefetchError) {
    return <div>Error: Failed to refetch</div>;
  }
  const userList = data!.sort((u1, u2) => {
    return u1.accessRole.localeCompare(u2.accessRole)
  })
  console.log(userList);


  const columns: TableProps<UserWithRole>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Year of Study",
      dataIndex: "yearOfStudy",
      key: "yearOfStudy",
      onFilter: (value, record) => record.yearOfStudy === value,
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      onFilter: (value, record) => record.level === value,
      filters: Object.values(Level).map((level) => ({
        text: level,
        value: level,
      })),
      render: (_, record) => (
        hasPermission(user, "users", "edit-user", record) ?
          <EditLevelSelect userRow={record} userList={userList} setEdit={setEdit} refetch={refetch} /> :
          <Space size='middle'><Tag style={{ marginLeft: 12 }} color={getTableLevelColor(record.level)}>{record.level}</Tag></Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      minWidth: 150,
      render: (val, record) => {
        return hasPermission(user, "users", "edit-user", record) ?
          <EditCcaRolesSelect userRow={record} userList={userList} setEdit={setEdit} refetch={refetch} /> :
          <span style={{ marginLeft: 12 }}>{record.role.name}</span>
      },
    },
    {
      title: "Access Role",
      dataIndex: "accessRole",
      key: "accessRole",
      render: (_, record) => (
        hasPermission(user, "users", "edit-user-access-role", record) ?
          <EditAccessRolesSelect userRow={record} userList={userList} setEdit={setEdit} refetch={refetch} /> :
          <Space size="middle"><Tag style={{ marginLeft: 12 }} color={getTableAccessRoleColor(record.accessRole)}>{record.accessRole}</Tag></Space>
      ),
      onFilter: (value, record) => record.accessRole === value,
      filters: Object.values(AccessRole).map((role) => ({
        text: role,
        value: role,
      })),
    },
  ];

  return (
    <div className="px-8 py-8 flex flex-col gap-4 max-w-screen-xl ml-0">
      <span className={styles.heading1}>MANAGE USERS</span>
      <div className="p-4 md:px-8 md:py-6 border-2 border-grey-100 border-opacity-50 rounded-lg flex flex-col gap-2 md:gap-0">

        <Table<UserWithRole>
          columns={columns}
          dataSource={userList}
          rowKey="id"
          pagination={false}
          className="cursor-pointer"
        />
        {edit && <ConfirmEditModal confirm={edit.confirm} cancel={edit.cancel} />}
      </div>
    </div>
  );
}
