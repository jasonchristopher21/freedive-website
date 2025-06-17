"use client";

import React from "react";

export default function NoSidebarPage({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 items-center justify-center w-full max-w-screen-xl min-h-[90vh] h-full mx-auto px-4">
            {children}
        </div>
    );
}