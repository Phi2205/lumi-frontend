import { Avatar, AvatarImage, AvatarFallback, StoryAvatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { GlassButton } from "@/lib/components/glass-button"
import { useState, useEffect, useCallback } from "react"
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from "@/services/friendRequest.service"
import { getRecommendedUsers } from "@/services/recommend.service"
import { SkeletonFriendRequests } from "@/components/skeleton"
import { Check, X, UserPlus } from "lucide-react"
import type { FriendRequestItem } from "@/apis/friendRequest.api"
import type { RecommendedUser } from "@/apis/recommend.api"
import { formatTime } from "@/utils/format"
import { useRouter } from "next/navigation"
import { User } from "@/types/user.type"
import { usePresenceRealtime } from "@/socket/presence/usePresenceRealtime"
import { useStoryRealtime } from "@/socket/story/useStoryRealtime"
import { getOnlineUsers } from "@/socket/presence/presence.socket"

export function RightSidebar() {
  const router = useRouter()
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOnlineFriends = useCallback((excludeIds: string[] = []) => {
    getOnlineUsers({ limit: 20, exclude: excludeIds }, (users) => {
      setOnlineFriends(prev => {
        const currentIds = new Set(prev.map(u => u.id));
        const newOnes = users.filter(u => !currentIds.has(u.id));
        const combined = [...prev, ...newOnes];
        return combined.slice(0, 20);
      });
    });
  }, []);

  useEffect(() => {
    fetchOnlineFriends();
  }, [fetchOnlineFriends]);

  usePresenceRealtime({
    onStatusChanged: (data) => {
      if (!data.is_online) {
        setOnlineFriends(prev => {
          const isCurrentlyDisplayed = prev.some(u => u.id === data.userId);
          if (isCurrentlyDisplayed) {
            const remaining = prev.filter(u => u.id !== data.userId);
            fetchOnlineFriends(remaining.map(u => u.id));
            return remaining;
          }
          return prev;
        });
      } else {
        setOnlineFriends(prev => {
          if (prev.length < 20 && !prev.some(u => u.id === data.userId)) {
            fetchOnlineFriends(prev.map(u => u.id));
          }
          return prev;
        });
      }
    }
  });

  useStoryRealtime({
    onStoryStatusChanged: (data) => {
      console.log(data)
      setOnlineFriends(prev => prev.map(u => {
        if (u.id === data.userId) {
          return { ...u, has_story: data.hasStory };
        }
        return u;
      }));
    }
  });

  return (
    <aside className="hidden lg:flex flex-col fixed right-0 top-16 h-[calc(100vh-64px)] w-80 border-l border-white/20 backdrop-blur-3xl bg-white/5 px-6 py-8 gap-6 overflow-y-auto scroll-glass">
      {/* Online Friends Card */}
      <div className="backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online Friends
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">
            {onlineFriends.length}
          </span>
        </h3>
        <div className="space-y-4">
          {onlineFriends.length > 0 ? (
            onlineFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between group hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <StoryAvatar
                    username={friend.username}
                    src={friend.avatar_url || "/avatar-default.jpg"}
                    alt={friend.name}
                    hasStory={friend.has_story}
                    isOnline={true}
                    className="h-9 w-9 shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span
                      className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate cursor-pointer"
                      onClick={() => router.push(`/users/${friend.username}`)}
                    >
                      {friend.name}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 opacity-40">
              <p className="text-xs text-white text-center">No friends online</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
