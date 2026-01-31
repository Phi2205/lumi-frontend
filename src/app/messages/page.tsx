"use client"

import { useState } from "react"
import { ConversationList, type Conversation } from "@/components/messages/ConversationList"
import { ChatWindow, type Message } from "@/components/messages/ChatWindow"

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    lastMessage: "That sounds great! When are you free?",
    timestamp: "2m",
    unread: true,
    isOnline: true,
  },
  {
    id: "2",
    name: "Mike Johnson",
    avatar: "/placeholder.svg",
    lastMessage: "Check out my latest post!",
    timestamp: "1h",
    unread: false,
    isOnline: true,
  },
  {
    id: "3",
    name: "Emma Davis",
    avatar: "/placeholder.svg",
    lastMessage: "Thanks for the invitation!",
    timestamp: "3h",
    unread: false,
    isOnline: false,
  },
  {
    id: "4",
    name: "Alex Rivera",
    avatar: "/placeholder.svg",
    lastMessage: "See you this weekend!",
    timestamp: "5h",
    unread: false,
    isOnline: true,
  },
  {
    id: "5",
    name: "Julia Anderson",
    avatar: "/placeholder.svg",
    lastMessage: "Let's catch up soon!",
    timestamp: "1d",
    unread: true,
    isOnline: false,
  },
  {
    id: "6",
    name: "David Park",
    avatar: "/placeholder.svg",
    lastMessage: "Sounds good to me!",
    timestamp: "2d",
    unread: false,
    isOnline: false,
  },
  {
    id: "7",
    name: "Lisa Wong",
    avatar: "/placeholder.svg",
    lastMessage: "Miss you!",
    timestamp: "3d",
    unread: false,
    isOnline: true,
  },
  {
    id: "8",
    name: "Tom Wilson",
    avatar: "/placeholder.svg",
    lastMessage: "Let me know!",
    timestamp: "1w",
    unread: false,
    isOnline: false,
  },
]

const mockMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      sender: "Sarah Chen",
      senderAvatar: "/placeholder.svg",
      content: "Hey! How's everything going?",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      senderAvatar: "/placeholder.svg",
      content: "Pretty good! Just finished a project. You?",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: "3",
      sender: "Sarah Chen",
      senderAvatar: "/placeholder.svg",
      content: "Amazing! We should celebrate with coffee ☕",
      timestamp: "10:33 AM",
      isOwn: false,
    },
    {
      id: "4",
      sender: "You",
      senderAvatar: "/placeholder.svg",
      content: "That sounds great! When are you free?",
      timestamp: "10:35 AM",
      isOwn: true,
    },
  ],
  "2": [
    {
      id: "1",
      sender: "Mike Johnson",
      senderAvatar: "/placeholder.svg",
      content: "Check out my latest post!",
      timestamp: "1:15 PM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      senderAvatar: "/placeholder.svg",
      content: "Will do! Sounds exciting.",
      timestamp: "1:20 PM",
      isOwn: true,
    },
  ],
  "3": [
    {
      id: "1",
      sender: "Emma Davis",
      senderAvatar: "/placeholder.svg",
      content: "Thanks so much for the invitation!",
      timestamp: "2:45 PM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      senderAvatar: "/placeholder.svg",
      content: "Of course! Looking forward to it.",
      timestamp: "3:00 PM",
      isOwn: true,
    },
  ],
  "4": [
    {
      id: "1",
      sender: "Alex Rivera",
      senderAvatar: "/placeholder.svg",
      content: "See you this weekend!",
      timestamp: "4:20 PM",
      isOwn: false,
    },
  ],
  "5": [
    {
      id: "1",
      sender: "Julia Anderson",
      senderAvatar: "/placeholder.svg",
      content: "Let's catch up soon!",
      timestamp: "Yesterday",
      isOwn: false,
    },
  ],
  "6": [
    {
      id: "1",
      sender: "David Park",
      senderAvatar: "/placeholder.svg",
      content: "Are you coming to the event?",
      timestamp: "2:00 PM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      senderAvatar: "/placeholder.svg",
      content: "Yeah, wouldn't miss it!",
      timestamp: "2:05 PM",
      isOwn: true,
    },
    {
      id: "3",
      sender: "David Park",
      senderAvatar: "/placeholder.svg",
      content: "Sounds good to me!",
      timestamp: "2:10 PM",
      isOwn: false,
    },
  ],
  "7": [
    {
      id: "1",
      sender: "Lisa Wong",
      senderAvatar: "/placeholder.svg",
      content: "Miss you!",
      timestamp: "11:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      senderAvatar: "/placeholder.svg",
      content: "Miss you too! Let's meet up soon",
      timestamp: "11:35 AM",
      isOwn: true,
    },
  ],
  "8": [
    {
      id: "1",
      sender: "Tom Wilson",
      senderAvatar: "/placeholder.svg",
      content: "Let me know!",
      timestamp: "9:00 AM",
      isOwn: false,
    },
  ],
}

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState("1")
  const [conversations, setConversations] = useState(mockConversations)
  const [allMessages, setAllMessages] = useState(mockMessages)

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)
  const currentMessages = allMessages[selectedConversationId] || []

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: String(currentMessages.length + 1),
      sender: "You",
      senderAvatar: "/placeholder.svg",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }

    setAllMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage],
    }))

    // Update conversation's last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId ? { ...conv, lastMessage: content, timestamp: "now", unread: false } : conv,
      ),
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(59, 130, 246, 0.15) 0%, rgba(3, 0, 20, 0.8) 50%, #000000 100%)'
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle 600px at 20% 50%, rgba(34, 211, 238, 0.12) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Instagram-style Layout */}
      <div className="flex h-screen pt-16">
        {/* Left Sidebar - Conversation List */}
        <div className="hidden lg:flex w-full lg:w-80 flex-shrink-0 border-r border-white/10 overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={setSelectedConversationId}
          />
        </div>

        {/* Right Area - Chat Window */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {selectedConversation ? (
            <ChatWindow
              conversationName={selectedConversation.name}
              conversationAvatar={selectedConversation.avatar}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-white/50 text-sm">Select a conversation to start messaging</div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Fallback - Show conversation list */}
        <div className="lg:hidden fixed inset-0 z-50 bg-black/95">
          <div className="h-full pt-16">
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversationId}
              onSelect={setSelectedConversationId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
