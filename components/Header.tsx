"use client"

import AuthButton from "./header-auth"
import { SidebarTrigger } from "./ui/sidebar"
import { useRouter } from "next/navigation"

export default function Header() {
  const router = useRouter()
  return (
    <div className="sticky top-0 w-full bg-navy py-4 px-4 z-10">
      <div className="flex justify-between md:grid md:grid-cols-3 w-full mx-auto bg-navy text-white">
        <div className="flex justify-start m-auto md:ml-0">
          <SidebarTrigger />
        </div>
        <button className="font-heading font-bold text-[20px] m-auto" onClick={() => router.push("/")}>
          NUS FREEDIVE
        </button>
        <div className="flex justify-end m-auto md:mr-0">
          <AuthButton />
        </div>
      </div>
    </div>
  )
}
