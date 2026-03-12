"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { cn } from "@/lib/utils"
import { getUserByUsername } from "@/services/user.service"
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest } from "@/services/friendRequest.service"
import { User, FriendshipStatus } from "@/types/user.type"
import { useMiniChat } from "@/components/messages/MiniChatContext"
import { getOrCreatePrivateConversationApi } from "@/apis/conversation.api"
import { useAuth } from "@/contexts/AuthContext"
import { mapConversationToUI } from "@/services/conversation.service"
import { ProfileContent } from "@/components/profile/ProfileContent"
import { useDarkMode } from "@/hooks/useDarkMode"
import { useBackgroundImage } from "@/hooks/useBackgroundImage"
import { BackgroundRenderer } from "@/components/BackgroundRenderer"

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { user } = useAuth()
  const isOwnProfile = useMemo(() => user?.username === username, [user?.username, username])

  const [activeTab, setActiveTab] = useState("home")
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const { isDarkMode, handleDarkModeToggle } = useDarkMode()
  const { imageLoaded, imageError } = useBackgroundImage("/bg12.jpg", isDarkMode)
  const { openChat } = useMiniChat()
  const [isStartingChat, setIsStartingChat] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsInitialLoading(true);
        const response = await getUserByUsername(username);
        setUserProfile(response.data);
      } catch (error) {
        console.error("Fetch user failed:", error);
      } finally {
        setIsInitialLoading(false);
      }
    }
    fetchUser()
  }, [username]);

  const handleAddFriend = async () => {
    if (!userProfile?.id || isLoading) return;
    try {
      setIsLoading(true);
      await sendFriendRequest(userProfile.id);
      setUserProfile(prev => prev ? { ...prev, friend_status: 'pending' } : null);
    } catch (error) {
      console.error("Send friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!userProfile?.id || isLoading) return;
    try {
      setIsLoading(true);
      await acceptFriendRequest(userProfile.id);
      setUserProfile(prev => prev ? { ...prev, friend_status: 'friend' } : null);
    } catch (error) {
      console.error("Accept friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!userProfile?.id || isLoading) return;
    try {
      setIsLoading(true);
      await cancelFriendRequest(userProfile.id);
      setUserProfile(prev => prev ? { ...prev, friend_status: 'none' } : null);
    } catch (error) {
      console.error("Cancel friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!userProfile?.id || isLoading) return;
    try {
      setIsLoading(true);
      await rejectFriendRequest(userProfile.id);
      setUserProfile(prev => prev ? { ...prev, friend_status: 'rejected' } : null);
    } catch (error) {
      console.error("Reject friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!userProfile?.id || isStartingChat) return
    try {
      setIsStartingChat(true)
      const res = await getOrCreatePrivateConversationApi(userProfile.id)
      if (res.data.success) {
        const conversation = res.data.data
        const mapped = mapConversationToUI(conversation, user?.id || "")
        openChat({
          recipientId: userProfile.id,
          recipientName: userProfile.name || "User",
          recipientAvatar: userProfile.avatar_url || "/avatar-default.jpg",
          conversationId: conversation.id,
          participants: mapped.participants,
          lastSeenMessageId: mapped.lastSeenMessageId,
        })
      }
    } catch (error) {
      console.error("Failed to start chat:", error)
    } finally {
      setIsStartingChat(false)
    }
  }

  const getButtonConfig = (status: FriendshipStatus | undefined) => {
    switch (status) {
      case 'none': return { text: 'Add Friend', onClick: handleAddFriend, disabled: isLoading, className: 'bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap' };
      case 'friend': return { text: 'Friends', onClick: undefined, disabled: true, className: 'bg-white/10 whitespace-nowrap' };
      case 'pending': return { text: isLoading ? 'Processing...' : 'Request Sent', onClick: handleCancelRequest, disabled: isLoading, className: 'bg-white/10 hover:bg-white/20 whitespace-nowrap' };
      case 'accepted': return { text: 'Friends', onClick: undefined, disabled: true, className: 'bg-white/10 whitespace-nowrap' };
      case 'rejected': return { text: 'Add Friend', onClick: handleAddFriend, disabled: isLoading, className: 'bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap' };
      case 'received_pending': return { text: isLoading ? 'Processing...' : 'Accept Request', onClick: handleAcceptRequest, disabled: isLoading, className: 'bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap' };
      default: return { text: 'Add Friend', onClick: handleAddFriend, disabled: isLoading, className: 'bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap' };
    }
  };

  const buttonConfig = useMemo(() => {
    if (!userProfile || isInitialLoading) return { text: 'Add Friend', onClick: undefined, disabled: true, className: 'bg-white/10 whitespace-nowrap' };
    return getButtonConfig(userProfile.friend_status);
  }, [userProfile, isLoading, isInitialLoading]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundRenderer
        isDarkMode={isDarkMode}
        imageLoaded={imageLoaded}
        imageError={imageError}
      />

      <Header isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="md:ml-64 lg:mr-80 pt-20 pb-20 md:pb-4 relative z-10">
        <ProfileContent
          userProfile={userProfile}
          isInitialLoading={isInitialLoading}
          isOwnProfile={isOwnProfile}
          isLoading={isLoading}
          isStartingChat={isStartingChat}
          buttonConfig={buttonConfig}
          handleAcceptRequest={handleAcceptRequest}
          handleRejectRequest={handleRejectRequest}
          handleStartChat={handleStartChat}
          onProfileUpdate={(updated) => setUserProfile(updated)}
        />
      </main>
      <RightSidebar />
    </div>
  )
}
