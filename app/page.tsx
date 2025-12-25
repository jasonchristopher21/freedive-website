"use client"

import { useAppSelector } from "@/redux/store"
import DashboardOutlined from "@ant-design/icons/lib/icons/DashboardOutlined"
import DockerOutlined from "@ant-design/icons/lib/icons/DockerOutlined"
import HistoryOutlined from "@ant-design/icons/lib/icons/HistoryOutlined"
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined"
import SettingOutlined from "@ant-design/icons/SettingOutlined"
import { Button } from "antd"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "./styles"
import FireOutlined from "@ant-design/icons/lib/icons/FireOutlined"

export default function Home() {
  const user = useAppSelector((state) => state.user.user)
  const router = useRouter()

  const iconProps = { className: "text-[50px] text-blue-500" }
  const userCards = [
    { href: "/sessions", title: "Sessions", icon: () => <DockerOutlined {...iconProps} />, desc: "View upcoming sessions" },
    { href: "/dashboard", title: "Dashboard (TODO)", icon: () => <DashboardOutlined {...iconProps} />, desc: "Overview" },
    { href: "/settings", title: "Settings", icon: () => <SettingOutlined {...iconProps} />, desc: "Edit your profile settings" },
  ]

  const adminCards = [
    { href: "/users", title: "Users", icon: () => <UserOutlined {...iconProps} />, desc: "Manage users and roles" },
    { href: "/sessions/add", title: "Add a session", icon: () => <FireOutlined {...iconProps} />, desc: "Create a new session" },
    { href: "/sessions/view", title: "History", icon: () => <HistoryOutlined {...iconProps} />, desc: "View and export sessions" },
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-16 px-6 bg-white">
      <div className="w-full max-w-5xl">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Freedive!</h1>
          <p className="text-gray-600 mt-2">Welcome. Choose where you'd like to go.</p>
        </header>

        {!user && (
          <>
            <h1 className={styles.heading1}>Please log in to access the application.</h1>
            <Button color="blue" variant="solid" onClick={() => router.push("/sign-in")}>
              SIGN IN
            </Button>
            <Button color="blue" variant="solid" onClick={() => router.push("/register")}>
              REGISTER
            </Button>
          </>
        )}

        {user && (
          <>
            <h1 className={styles.heading1}>Users</h1>
            <div className="w-full border-t border-grey-200 mt-2 mb-2" />
            <section className="grid grid-cols-1 py-4 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userCards.map((c) => (
                <Link key={c.href} href={c.href} className="block rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow bg-white">
                  <div className="flex flex-row gap-4">
                    {c.icon()}
                    <div>
                      <h3 className="text-lg font-semibold">{c.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
            <div className="py-4" />
          </>
        )}

        {user?.accessRole === "ADMIN" && (
          <>
            <h1 className={styles.heading1}>Admin</h1>
            <div className="w-full border-t border-grey-200 mt-2 mb-2" />
            <section className="grid grid-cols-1 py-4 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {adminCards.map((c) => (
                <Link key={c.href} href={c.href} className="block rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow bg-white">
                  <div className="flex flex-row gap-4">
                    {c.icon()}
                    <div>
                      <h3 className="text-lg font-semibold">{c.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  )
}
