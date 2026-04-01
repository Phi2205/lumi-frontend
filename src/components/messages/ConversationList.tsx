"use client"

import { Search, PlusCircle, X } from "lucide-react"
import { StoryAvatar } from "@/components/ui/avatar"
import { useState, memo, useDeferredValue, useMemo, useEffect, useRef, useCallback } from "react"
import { SkeletonConversationList } from "@/components/skeleton"
import { GlassButton } from "@/lib/components/glass-button"
import { CreateGroupModal } from "./CreateGroupModal"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import { useDebounce } from "@/hooks/useDebounce"
import { mapConversationToUI, searchConversationService } from "@/services/conversation.service"
import { useAuth } from "@/contexts/AuthContext"


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
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, 500)

  const [searchResults, setSearchResults] = useState<ConversationUI[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchPage, setSearchPage] = useState(1)
  const [hasMoreSearch, setHasMoreSearch] = useState(false)
  const [isSearchingMore, setIsSearchingMore] = useState(false)

  useEffect(() => {
    const handleInitialSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([])
        setSearchPage(1)
        setHasMoreSearch(false)
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      setSearchPage(1)
      try {
        const data = await searchConversationService(debouncedQuery, "1", "20")
        if (data && data.success && user?.id) {
          setSearchResults((data.data.items || []).map(conv => mapConversationToUI(conv, user.id)))
          setHasMoreSearch(data.data.pagination?.hasNextPage || false)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }

    handleInitialSearch()
  }, [debouncedQuery, user?.id])

  const loadMoreSearch = async () => {
    if (isSearchingMore || !hasMoreSearch || !debouncedQuery.trim()) return

    setIsSearchingMore(true)
    const nextPage = searchPage + 1
    try {
      const data = await searchConversationService(debouncedQuery, nextPage.toString(), "20")
      if (data && data.success && user?.id) {
        const newResults = (data.data.items || []).map(conv => mapConversationToUI(conv, user.id))
        setSearchResults(prev => [...prev, ...newResults])
        setSearchPage(nextPage)
        setHasMoreSearch(data.data.pagination?.hasNextPage || false)
      }
    } catch (error) {
      console.error("Load more search error:", error)
    } finally {
      setIsSearchingMore(false)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 20) {
      if (debouncedQuery.trim() && hasMoreSearch && !isSearchingMore) {
        loadMoreSearch()
      }
    }
  }

  const displayList = debouncedQuery.trim() ? searchResults : conversations
  const isLoading = debouncedQuery.trim() ? isSearching : loading


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
              className="w-full pl-10 pr-10 py-2.5 rounded-full text-sm text-white placeholder-white/50 focus:outline-none transition-all bg-white/10 border border-white/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors flex items-center justify-center p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
        onScroll={handleScroll}
      >
        {isLoading ? (
          <SkeletonConversationList count={10} />
        ) : displayList.length > 0 ? (
          <>
            {displayList.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
            {isSearchingMore && (
              <div className="flex justify-center p-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-primary"></div>
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-center text-white/40 text-sm">
            {debouncedQuery.trim() ? `${t('messages.no_results_for')} "${debouncedQuery}"` : t('messages.no_conversations')}
          </div>
        )}
      </div>
    </div >
  )
}
