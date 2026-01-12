"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { Feed } from "@/components/Feed"
import { MessagesView } from "@/components/messages/MessagesView"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Show loading or nothing while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Don't render content if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      {activeTab === "messages" ? (
        <MessagesView />
      ) : (
        <main className="md:ml-64 lg:mr-80 pt-4 pb-20 md:pb-4">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">{activeTab === "home" && <Feed />}</div>
        </main>
      )}

      {activeTab !== "messages" && <RightSidebar />}
    </div>
  )
}
