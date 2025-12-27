import { ThemeProvider } from "next-themes"
import "./globals.css"
import Header from "@/components/Header"
import StoreProvider from "./StoreProvider"
import icon from "./assets/img/NUS Freediving B&W Logo.png"

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "NUS Freedive website",
  description: "The best for managing sessions and tracking attendance",
  icons: {
    icon: icon.src,
  },
}

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { NO_SIDEBAR_PATHS } from "@/constants"
import QueryProvider from "./providers/QueryProvider"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"
import ErrorModal from "./common/modals/ErrorModal"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <StoreProvider>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <AntdRegistry>
                <ConfigProvider
                  theme={{
                    token: {
                      fontFamily: "Inter, sans-serif",
                    },
                  }}>
                  <SidebarProvider>
                    <main className="min-h-screen flex flex-col items-center">
                      <Header />
                      <div className="flex justify-start w-full">
                        <AppSidebar />
                        {/* <div className="flex flex-col gap-2 items-center w-full max-w-screen-xl min-h-[90vh] h-full mx-auto px-4"> */}
                        <div className="flex flex-col gap-2 w-full max-w-screen-xl min-h-[90vh] h-full mx-auto px-4">{children}</div>
                        {/* </div> */}
                      </div>
                      <ErrorModal />
                    </main>
                  </SidebarProvider>
                </ConfigProvider>
              </AntdRegistry>
            </ThemeProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
