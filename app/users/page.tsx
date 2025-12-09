"use client";

import styles from "@/app/styles";
import { useUserListQuery } from "@/queries/useUserListQuery";
import { AccessRole, Level, Prisma } from "@prisma/client";
import { UseQueryResult } from "@tanstack/react-query";
import type { TableProps } from "antd";
import { Select, Space, Table, Tag } from "antd";
import { useState } from "react";
import AdminGuard from "../common/authguard/AdminGuard";
import Loading from "../Loading";
import { CcaRoles } from "../types";
import ConfirmEditModal from "./ConfirmEditModal";
import { hasPermission } from "../access-rules";
import { useAppSelector } from "@/redux/store";
import Unauthorised from "../unauthorised";
import EditSelect from "./EditSelect";

type UserWithRole = Prisma.UserGetPayload<{
  include: { role: true };
}>;

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

export default function PageAuth() {
  return (
    <AdminGuard>
      <Page />
    </AdminGuard>
  )
}

type Edit = {
  confirm: () => Promise<void>,
  cancel: () => void
}

const notOwnRow = (rowId: string, userId: string) => rowId !== userId

function Page() {
  const user = useAppSelector(state => state.user.user)!
  const [edit, setEdit] = useState<Edit | null>(null)
  const { data, refetch, isLoading, error }: UseQueryResult<UserWithRole[]> = useUserListQuery();
  if (isLoading) {
    return <Loading />
  }
  if (error) {
    return <div>Error: {error.message}</div>;
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
        <Space size="middle">
          <Tag color={getTableLevelColor(record.level)}>{record.level}</Tag>
        </Space>
      ),
    },
    {
      title: "Access Role",
      dataIndex: "accessRole",
      key: "accessRole",
      render: (_, record) => (
        <Space size="middle">
          <Tag color={getTableAccessRoleColor(record.accessRole)}>
            {record.accessRole}
          </Tag>
        </Space>
      ),
      onFilter: (value, record) => record.accessRole === value,
      filters: Object.values(AccessRole).map((role) => ({
        text: role,
        value: role,
      })),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      minWidth: 150,
      render: (val, record) => {
        return hasPermission(user, "users", "edit-user") && notOwnRow(user.id, record.id) ?
        <EditSelect userRow={record} userList={userList} setEdit={setEdit} refetch={refetch} /> :
          record.role.name
      },
    },
  ];

  return (
    <div className="px-8 py-8 flex flex-col gap-4 max-w-screen-xl ml-0">
      <span className={styles.heading1}>MANAGE USERS</span>
      <Table<UserWithRole>
        columns={columns}
        dataSource={userList}
        rowKey="id"
        pagination={false}
        className="cursor-pointer"
        onRow={(record, rowIndex) => ({
          onClick: (event) => {
            // Handle row click if needed
            console.log("Row clicked:", record);
          },
        })}

      />
      {edit && <ConfirmEditModal edit={edit} setEdit={setEdit} />}
    </div>
  );
}
