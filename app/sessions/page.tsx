import Image from "next/image";
import Header from "@/components/Header";
import SessionBox from "./SessionBox";

const dummyData = [
  {
    id: "1",
    name: "Tuesday Training",
    date: "Tuesday, 15 October 2024",
    time: "17.00 - 19.00",
    numPax: 12,
    levels: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    id: "2",
    name: "Thursday Safety Refresher (All Levels)",
    date: "Tuesday, 15 October 2024",
    time: "17.00 - 19.00",
    numPax: 12,
    levels: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    id: "abc",
    name: "Saturday Training",
    date: "Tuesday, 15 October 2024",
    time: "17.00 - 19.00",
    numPax: 12,
    levels: ["Beginner", "Intermediate", "Advanced"],
  },
]
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
      <div className="px-8 py-8 flex flex-col gap-4 max-w-screen-xl mx-auto">
        <span className="font-heading font-bold text-[22px]">UPCOMING SESSIONS</span>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          {dummyData.map((item) => <SessionBox props={item} />)}</div>
      </div>
  )
}

// export default function Page() {
//     return (
//         <div>
//             <div className="px-8 py-8 flex flex-col gap-4 max-w-screen-xl mx-auto">
//                 <span className="font-heading font-bold text-[22px]">UPCOMING SESSIONS</span>
//                 <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
//                     {dummyData.map((item) => <SessionBox props={item} />)}</div>
//             </div>
//         </div>
//     );
// }
