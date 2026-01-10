"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { Feed } from "@/components/Feed"
import { MessagesView } from "@/components/messages/MessagesView"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")

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
