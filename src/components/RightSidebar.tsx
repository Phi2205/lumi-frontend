import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <aside className="hidden lg:flex flex-col fixed right-0 top-16 h-[calc(100vh-64px)] w-80 border-l border-border bg-card px-6 py-8 gap-6 overflow-y-auto">
      {/* Online Friends */}
      <Card className="border-border bg-secondary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Online Friends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {onlineFriends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white dark:ring-card" />
                </div>
                <span className="text-sm font-medium text-foreground">{friend.name}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Users */}
      <Card className="border-border bg-secondary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Suggested Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.mutual}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  )
}
