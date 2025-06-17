"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";

export default function SidebarPage({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppSidebar />
            {/* <div className="flex flex-col gap-2 items-center w-full max-w-screen-xl min-h-[90vh] h-full mx-auto px-4"> */}
            <div className="flex flex-col gap-2 items-center w-full max-w-screen-xl min-h-[90vh] h-full mx-auto px-4">
                {children}
            </div>
        </>
    )
}