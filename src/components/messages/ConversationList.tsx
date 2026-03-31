"use client"

import { Search, PlusCircle } from "lucide-react"
import { StoryAvatar } from "@/components/ui/avatar"
import { useState, memo, useDeferredValue, useMemo, useEffect } from "react"
import { SkeletonConversationList } from "@/components/skeleton"
import { GlassButton } from "@/lib/components/glass-button"
import { CreateGroupModal } from "./CreateGroupModal"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"


export interface ParticipantUI {
  id: string
  name: string
  avatar_url: string
  isOnline: boolean
  lastSeenMessageId?: string
  lastOnline?: string
  username?: string
  joined_at?: string
}

export interface ConversationUI {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: boolean
  unreadCount: number
  isOnline: boolean
  lastMessageId?: string
  lastSeenMessageId?: string
  participants: ParticipantUI[]
  lastMessageAt?: string
  lastOnline?: string
  type: string
}

interface ConversationListProps {
  conversations: ConversationUI[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  loading?: boolean
  onOpenCreateGroup?: () => void
}

const ConversationItem = memo(({
  conversation,
  selectedId,
  onSelect
}: {
  conversation: ConversationUI,
  selectedId?: string | null,
  onSelect?: (id: string) => void
}) => {
  const isSelected = selectedId === conversation.id;

  return (
    <button
      onClick={() => onSelect?.(conversation.id)}
      className={`w-full text-left gap-3 px-3 py-3 rounded-xl transition-[background-color,border-color,box-shadow,transform] duration-200 group cursor-pointer flex items-center border transform translate-z-0 ${isSelected
        ? 'bg-brand-primary/20 border-brand-primary/40 shadow-lg shadow-brand-primary/5'
        : 'bg-white/5 border-white/5 hover:bg-white/10'
        }`}
    >
      <div className="relative flex-shrink-0">
        <StoryAvatar className="w-12 h-12" src={conversation.avatar || (conversation.type === 'group' ? "/avatar-group-default.jpg" : "/avatar-default.jpg")} alt={conversation.name} hasStory={false} />
        {conversation.isOnline && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-zinc-900" />
        )}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-white' : 'text-white group-hover:text-white'
            }`}>
            {conversation.name}
          </p>
          <span className={`text-xs ml-2 flex-shrink-0 transition-colors ${conversation.unread ? 'text-cyan-300 font-bold' : 'text-white/80'
            }`}>
            {conversation.timestamp}  
          </span>
        </div>
        <p className={`text-xs truncate transition-colors ${conversation.unread ? 'font-semibold text-white' : 'text-white/70 group-hover:text-white/90'
          }`}>
          {conversation.lastMessage}
        </p>
      </div>
      {conversation.unread && conversation.unreadCount > 0 && (
        <div className="min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
          <span className="text-[10px] font-bold text-white tabular-nums">
            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
          </span>
        </div>
      )}
    </button>
  );
});

ConversationItem.displayName = "ConversationItem";

export function ConversationList({ conversations, selectedId, onSelect, loading, onOpenCreateGroup }: ConversationListProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const deferredQuery = useDeferredValue(searchQuery)

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  const filtered = useMemo(() =>
    conversations.filter((conv) => conv.name.toLowerCase().includes(deferredQuery.toLowerCase())),
    [conversations, deferredQuery]
  )

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden">


      {/* Search Header */}
      <div
        className="p-4 border-b backdrop-blur-md relative z-10 bg-white/5 border-white/10"
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
            <input
              placeholder={t('messages.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm text-white placeholder-white/50 focus:outline-none transition-all bg-white/10 border border-white/10"
            />
          </div>
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={onOpenCreateGroup}
            className="h-10 w-10 p-0 rounded-full flex-shrink-0 border-white/10 hover:bg-brand-primary/20"
            title={t('messages.create_group')}
          >
            <PlusCircle className="h-5 w-5 text-cyan-300" />
          </GlassButton>
        </div>
      </div>


      {/* Conversations List */}
      <div
        className="flex-1 overflow-y-auto relative z-10 space-y-1.5 p-2 scroll-glass"
        style={{ contentVisibility: 'auto' } as any}
      >
        {loading ? (
          <SkeletonConversationList count={10} />
        ) : filtered.length > 0 ? (
          filtered.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))
        ) : (
          <div className="p-4 text-center text-white/40 text-sm">
            {t('messages.no_conversations')}
          </div>
        )}
      </div>
    </div >
  )
}
