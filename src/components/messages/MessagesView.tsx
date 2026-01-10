"use client"

import { useState } from "react"
import { ConversationList, type Conversation } from "./ConversationList"
import { ChatWindow, type Message } from "./ChatWindow"

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
}

export function MessagesView() {
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
    <div className="flex h-[calc(100vh-64px)] gap-0">
      {/* Conversation List */}
      <div className="hidden sm:flex w-full sm:w-80 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
        />
      </div>

      {/* Chat Window */}
      {selectedConversation && (
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow
            conversationName={selectedConversation.name}
            conversationAvatar={selectedConversation.avatar}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
          />
        </div>
      )}
    </div>
  )
}
