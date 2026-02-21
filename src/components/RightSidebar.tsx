import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from "@/services/friendRequest.service"
import { SkeletonFriendRequests } from "@/components/skeleton"
import { Check, X } from "lucide-react"
import type { FriendRequestItem } from "@/apis/friendRequest.api"
import { formatTime } from "@/utils/format"

export function RightSidebar() {
  const onlineFriends = [
    { id: 1, name: "Sarah Chen", avatar: "/placeholder.svg" },
    { id: 2, name: "Mike Johnson", avatar: "/placeholder.svg" },
    { id: 3, name: "Emma Davis", avatar: "/placeholder.svg" },
    { id: 4, name: "Alex Rivera", avatar: "/placeholder.svg" },
  ]

  const suggestedUsers = [
    { id: 1, name: "Julia Anderson", mutual: "12 mutual friends" },
    { id: 2, name: "Tom Wilson", mutual: "8 mutual friends" },
    { id: 3, name: "Lisa Park", mutual: "15 mutual friends" },
  ]

  const [requestFriendList, setRequestFriendList] = useState<FriendRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRequestFriendList = async () => {
      try {
        setIsLoading(true);
        const response = await getFriendRequests(1, 10);
        console.log(response);
        setRequestFriendList(response.data.items || []);
      } catch (error) {
        console.error("Fetch request friend list failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRequestFriendList();
  }, []);

  const handleAcceptRequest = async (requestId: string) => {
    if (processingIds.has(requestId)) return;
    try {
      setProcessingIds(prev => new Set(prev).add(requestId));
      await acceptFriendRequest(requestId);
      setRequestFriendList(prev => prev.filter(req => (req.id ?? req.requester_id) !== requestId));
    } catch (error) {
      console.error("Accept friend request failed:", error);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (processingIds.has(requestId)) return;
    try {
      setProcessingIds(prev => new Set(prev).add(requestId));
      await rejectFriendRequest(requestId);
      setRequestFriendList(prev => prev.filter(req => (req.id ?? req.requester_id) !== requestId));
    } catch (error) {
      console.error("Reject friend request failed:", error);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  return (
    <aside className="hidden lg:flex flex-col fixed right-0 top-16 h-[calc(100vh-64px)] w-80 border-l border-white/20 backdrop-blur-3xl bg-white/5 px-6 py-8 gap-6 overflow-y-auto scroll-glass">
      {/* Online Friends */}
      <div className="backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3 pb-3 border-b border-white/10">Online Friends</h3>
        <div className="space-y-3">
          {onlineFriends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8 ring-2 ring-blue-400/50">
                    <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white/20" />
                </div>
                <span className="text-sm font-medium text-white">{friend.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Friend Requests */}
      <div className="backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3 pb-3 border-b border-white/10">Friend Requests</h3>
        {isLoading ? (
          <SkeletonFriendRequests count={3} />
        ) : requestFriendList.length > 0 ? (
          <div className="space-y-4">
            {requestFriendList.map((req) => {
              const requestId = req.id ?? req.requester_id;
              const isProcessing = processingIds.has(requestId);
              return (
                <div
                  key={requestId}
                  className="space-y-2 rounded-xl p-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-blue-400/50 shrink-0">
                      <AvatarImage src={req.requester?.avatar_url || "/placeholder.svg"} alt={req.requester?.username || "User"} />
                      <AvatarFallback className="bg-linear-to-br from-brand-primary to-brand-primary-dark">
                        {(req.requester?.name?.[0] || "").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{req.requester?.name}</p>
                      <p className="text-xs text-white/50 truncate">@{req.requester?.username}</p>
                    </div>
                    <span className="text-xs text-white/50 shrink-0">{formatTime(req.created_at)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs rounded-lg bg-green-500/10 border-green-500/20 text-green-300 hover:bg-green-500/20 hover:border-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleAcceptRequest(requestId)}
                      disabled={!!isProcessing}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {isProcessing ? 'Processing...' : 'Accept'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs rounded-lg bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20 hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleRejectRequest(requestId)}
                      disabled={!!isProcessing}
                    >
                      <X className="w-3 h-3 mr-1" />
                      {isProcessing ? 'Processing...' : 'Reject'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-white/50 text-center py-4">No friend requests</p>
        )}
      </div>

      {/* Suggested Users */}
      <div className="backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3 pb-3 border-b border-white/10">Suggested Users</h3>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 ring-2 ring-blue-400/50">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white/50">{user.mutual}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
