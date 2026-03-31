"use client"

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { User } from "@/types/user.type"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Search, MoreHorizontal, UserPlus, UserMinus, UserCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { GlassCard, GlassButton } from "@/lib/components"
import { searchFriendsService } from "@/services/friend.service"

interface FriendsPreviewProps {
    friends: User[]
    mutualFriends: User[]
    totalCount: number
    hasMore?: boolean
    onLoadMore?: () => void
    isLoadingMore?: boolean
    onShowAll?: () => void
    className?: string
    isOwnProfile?: boolean
    userId?: string
}

export function FriendsPreview({
    friends,
    mutualFriends,
    totalCount,
    hasMore = false,
    onLoadMore,
    isLoadingMore = false,
    onShowAll,
    className,
    isOwnProfile = false,
    userId
}: FriendsPreviewProps) {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<"all" | "mutual">("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [searchPage, setSearchPage] = useState(1)
    const [searchHasMore, setSearchHasMore] = useState(false)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    const currentList = searchQuery ? searchResults : (activeTab === "all" ? friends : mutualFriends)
    const isLoading = isSearching || isLoadingMore

    // Debounced search effect
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([])
            setIsSearching(false)
            return
        }

        const timer = setTimeout(async () => {
            if (!userId) return
            setIsSearching(true)
            try {
                const limit = 20
                const res = await searchFriendsService(searchQuery, userId, limit.toString(), "1")
                if (res.success && res.data) {
                    const users = Array.isArray(res.data) ? res.data : (res.data.users || [])
                    // Fallback: if pagination is missing, assume hasNextPage if users.length == limit
                    const hasNext = !Array.isArray(res.data)
                        ? (res.data.pagination?.hasNextPage ?? (users.length === limit))
                        : (users.length === limit)

                    setSearchResults(users)
                    setSearchHasMore(hasNext)
                    setSearchPage(1)
                }
            } catch (err) {
                console.error("Search error:", err)
            } finally {
                setIsSearching(false)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery, userId])

    // Load more search results
    const loadMoreSearch = useCallback(async () => {
        if (!userId || isSearching || !searchHasMore) return
        const nextPage = searchPage + 1
        const limit = 20
        setIsSearching(true)
        try {
            const res = await searchFriendsService(searchQuery, userId, limit.toString(), nextPage.toString())
            if (res.success && res.data) {
                const newUsers = Array.isArray(res.data) ? res.data : (res.data.users || [])
                const hasNext = !Array.isArray(res.data)
                    ? (res.data.pagination?.hasNextPage ?? (newUsers.length === limit))
                    : (newUsers.length === limit)

                setSearchResults(prev => [...prev, ...newUsers])
                setSearchHasMore(hasNext)
                setSearchPage(nextPage)
            }
        } catch (err) {
            console.error("Load more search error:", err)
        } finally {
            setIsSearching(false)
        }
    }, [userId, isSearching, searchHasMore, searchQuery, searchPage])

    const filteredList = currentList

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const canLoadMore = searchQuery ? searchHasMore : (hasMore && activeTab === "all")
        if (!canLoadMore || isLoading) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                if (searchQuery) {
                    loadMoreSearch()
                } else if (onLoadMore) {
                    onLoadMore()
                }
            }
        }, { threshold: 0.1 })

        const currentRef = loadMoreRef.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef)
            observer.disconnect()
        }
    }, [onLoadMore, hasMore, isLoading, activeTab, searchQuery, searchHasMore, loadMoreSearch])

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header with Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-white">{t('profile.friends')}</h2>
                <div className="relative group max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder={t('common.search', { defaultValue: 'Search' })}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-hidden focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-white/5">
                <button
                    onClick={() => setActiveTab("all")}
                    className={cn(
                        "pb-3 text-sm font-semibold transition-all relative",
                        activeTab === "all" ? "text-brand-primary" : "text-white/40 hover:text-white/60"
                    )}
                >
                    {t('profile.all_friends', { defaultValue: 'All friends' })}
                    {activeTab === "all" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                    )}
                </button>
                {!isOwnProfile && (
                    <button
                        onClick={() => setActiveTab("mutual")}
                        className={cn(
                            "pb-3 text-sm font-semibold transition-all relative",
                            activeTab === "mutual" ? "text-brand-primary" : "text-white/40 hover:text-white/60"
                        )}
                    >
                        {t('profile.mutual_friends', { defaultValue: 'Mutual friends' })}
                        {activeTab === "mutual" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                        )}
                    </button>
                )}
            </div>

            {/* Grid of Friends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredList.map((friend) => (
                    <div
                        key={friend.id}
                        className="p-4 flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all group"
                    >
                        <Link href={`/users/${friend.username}`} className="shrink-0">
                            <Avatar className="w-16 h-16 rounded-lg ring-2 ring-white/5 group-hover:ring-brand-primary/20 transition-all shadow-lg">
                                <AvatarImage src={friend.avatar_url || "/avatar-default.jpg"} className="object-cover" />
                                <AvatarFallback>{friend.name?.[0]}</AvatarFallback>
                            </Avatar>
                        </Link>

                        <div className="flex flex-col justify-center flex-1">
                            <Link href={`/users/${friend.username}`} className="text-white font-bold group-hover:text-brand-primary transition-colors block text-lg">
                                {friend.name}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading/Infinite scroll trigger */}
            {(searchQuery ? searchHasMore : (hasMore && activeTab === "all")) || isLoading ? (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                    {isLoading && (
                        <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                    )}
                </div>
            ) : null}

            {filteredList.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-white/20">
                    <Search className="w-12 h-12 mb-4 opacity-10" />
                    <p>{t('common.no_results', { defaultValue: 'No friends found' })}</p>
                </div>
            )}
        </div>
    )
}
