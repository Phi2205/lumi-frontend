import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProviderWrapper } from "@/components/providers/AuthProviderWrapper"
import { SocketProvider } from "@/contexts/SocketContext"
import { MiniChatProvider } from "@/components/messages/MiniChatContext"
import { UploadProvider } from "@/contexts/UploadContext"
import { UploadStack } from "@/components/common/UploadStack"
import { ReelProvider } from "@/contexts/ReelContext"
import { StoryProvider } from "@/contexts/StoryContext"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "SocialHub - Connect & Share",
  description: "A modern social media platform to share stories, posts, and connect with friends",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${dancingScript.variable}`} suppressHydrationWarning>
        <AuthProviderWrapper>
          <SocketProvider>
            <UploadProvider>
              <MiniChatProvider>
                <ReelProvider>
                  <StoryProvider>
                    {children}
                    {modal}
                    <UploadStack />
                  </StoryProvider>
                </ReelProvider>
              </MiniChatProvider>
            </UploadProvider>
          </SocketProvider>
        </AuthProviderWrapper>
        <Analytics />
      </body>
    </html>
  )
}
