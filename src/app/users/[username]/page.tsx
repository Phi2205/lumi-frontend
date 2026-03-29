"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { cn } from "@/lib/utils"
import { getUserByUsername } from "@/services/user.service"
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest } from "@/services/friendRequest.service"
import { deleteFriendService } from "@/services/friend.service"
import { User, FriendshipStatus } from "@/types/user.type"
import { Modal } from "@/lib/components/modal"
import { Button } from "@/components/ui/button"
import { GlassButton } from "@/lib/components"
import { UserMinus, AlertCircle } from "lucide-react"
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
  const [showUnfriendModal, setShowUnfriendModal] = useState(false)

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

  const handleDeleteFriend = async () => {
    if (!userProfile?.id || isLoading) return;
    setShowUnfriendModal(true);
  };

  const confirmDeleteFriend = async () => {
    if (!userProfile?.id || isLoading) return;

    try {
      setIsLoading(true);
      await deleteFriendService(userProfile.id);
      setUserProfile(prev => prev ? { ...prev, friend_status: 'none' } : null);
      setShowUnfriendModal(false);
    } catch (error) {
      console.error("Unfriend failed:", error);
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
          handleAcceptRequest={handleAcceptRequest}
          handleRejectRequest={handleRejectRequest}
          handleCancelRequest={handleCancelRequest}
          handleAddFriend={handleAddFriend}
          handleDeleteFriend={handleDeleteFriend}
          handleStartChat={handleStartChat}
          onProfileUpdate={(updated) => setUserProfile(updated)}
        />

        <Modal
          isOpen={showUnfriendModal}
          onClose={() => setShowUnfriendModal(false)}
          title={
            <div className="flex items-center gap-3 text-red-500">
              <AlertCircle className="w-6 h-6" />
              <span>Unfriend?</span>
            </div>
          }
          maxWidthClassName="max-w-md"
        >
          <div className="space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-white/80 text-center leading-relaxed">
                Are you sure you want to unfriend <span className="text-white font-bold">{userProfile?.name}</span>?
                This will remove them from your friend list.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <GlassButton
                className="flex-1 bg-white/5 hover:bg-white/10"
                onClick={() => setShowUnfriendModal(false)}
              >
                Cancel
              </GlassButton>
              <GlassButton
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 font-bold h-11 rounded-xl"
                onClick={confirmDeleteFriend}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Unfriend"}
              </GlassButton>
            </div>
          </div>
        </Modal>
      </main>
      <RightSidebar />
    </div>
  )
}
