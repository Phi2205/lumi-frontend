import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

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

  return (
    <aside className="hidden lg:flex flex-col fixed right-0 top-16 h-[calc(100vh-64px)] w-80 border-l border-white/20 backdrop-blur-3xl bg-white/5 px-6 py-8 gap-6 overflow-y-auto">
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
