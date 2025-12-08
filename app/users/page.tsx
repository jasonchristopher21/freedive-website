"use client";

import styles from "@/app/styles";
import AdminGuard from "../common/authguard/AdminGuard";
import { useUserListQuery } from "@/queries/useUserListQuery";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { Prisma, User, Level, AccessRole } from "@prisma/client";
import { checkDomainOfScale } from "recharts/types/util/ChartUtils";
import { getUserLevelColor } from "../common/functions/userUtils";

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
    render: (_, record) => record.role.name,
  },
];

export default function Page() {
  const { data: userList, isLoading, error } = useUserListQuery();
  console.log(userList);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <AdminGuard>
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
      </div>
    </AdminGuard>
  );
}
