"use client"

import {
  ArrowUpRightFromSquare,
  BookOpen,
  Bot,
  Calendar,
  CalendarPlus,
  FileSpreadsheet,
  LogOut,
  Settings2,
  SquareTerminal,
  Users
} from "lucide-react"
import DashboardOutline from "@ant-design/icons/DashboardOutlined"
import * as React from "react"

import { NavFooter } from "@/components/nav-footer"
import { NavItem } from "@/components/nav-item"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail
} from "@/components/ui/sidebar"
import { NO_SIDEBAR_PATHS } from "@/constants"
import { usePathname } from "next/navigation"
import { hasPermission } from "@/app/access-rules"
import { useAppSelector } from "@/redux/store"

// This is sample data.
const data = {
  navMain: [
    {
      name: "Sessions",
      url: "#",
      icon: SquareTerminal, 
      isActive: true,
      items: [

      ]
    },
    {
      name: "Playground",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      name: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      name: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  userView: [
    {
      name: "Sessions",
      url: "/sessions",
      icon: Calendar
    },
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: DashboardOutline
    }
  ],
  adminView: [
    {
      name: "Add Sessions",
      url: "/sessions/add",
      icon: CalendarPlus
    },
    {
      name: "View Sessions",
      url: "/sessions/view",
      icon: ArrowUpRightFromSquare
    },
    {
      name: "Manage Users",
      url: "/users",
      icon: Users
    },
    {
      name: "Reports",
      url: "/reports",
      icon: FileSpreadsheet
    }
  ],
  footer: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Log Out",
      url: "#",
      icon: LogOut,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const user = useAppSelector(state => state.user.user)
  if (NO_SIDEBAR_PATHS.includes(pathname)) {
    return null;
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavItem items={data.userView} title="Menu" />
        {user?.accessRole === 'ADMIN' && <NavItem items={data.adminView} title="Admin" />}
      </SidebarContent>
      <SidebarFooter>
        <NavFooter items={data.footer} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
