"use client"

import { useState, useEffect, useMemo } from "react"
import { X, Search, Check, Users, Loader2, UserPlus } from "lucide-react"
import { GlassButton } from "@/lib/components/glass-button"
import { StoryAvatar } from "@/components/ui/avatar"
import { addParticipantService } from "@/services/conversation.service"
import { getFriendsService } from "@/services/friend.service"
import { User } from "@/types/user.type"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import { ParticipantUI } from "./ConversationList"

interface AddMemberModalProps {
    isOpen: boolean
    onClose: () => void
    onAdded: (users: User[]) => void
    conversationId: string
    existingParticipants: ParticipantUI[]
    isDarkMode?: boolean
}

export const AddMemberModal = ({ isOpen, onClose, onAdded, conversationId, existingParticipants, isDarkMode = true }: AddMemberModalProps) => {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState("")
    const [friends, setFriends] = useState<User[]>([])
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isFetchingMore, setIsFetchingMore] = useState(false)

    const fetchFriends = async (pageNumber: number) => {
        if (pageNumber === 1) {
            setIsLoading(true)
        } else {
            setIsFetchingMore(true)
        }

        try {
            const res = await getFriendsService("20", pageNumber.toString())
            if (res && res.data) {
                const newFriends = res.data
                if (newFriends.length < 20) {
                    setHasMore(false)
                }
                setFriends(prev => pageNumber === 1 ? newFriends : [...prev, ...newFriends])
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error("Failed to fetch friends", error)
        } finally {
            setIsLoading(false)
            setIsFetchingMore(false)
        }
    }

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery("")
            setSelectedUsers([])
            setPage(1)
            setHasMore(true)
            setFriends([])
            return
        }

        fetchFriends(1)
    }, [isOpen])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
        if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !isFetchingMore && !isLoading) {
            const nextPage = page + 1
            setPage(nextPage)
            fetchFriends(nextPage)
        }
    }

    const filteredFriends = useMemo(() => {
        // Lọc ra những friend CHƯA có trong existingParticipants
        const existingIds = new Set(existingParticipants.map(p => p.id))
        let available = friends.filter(f => !existingIds.has(f.id))

        if (!searchQuery.trim()) return available
        return available.filter(friend =>
            friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            friend.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [friends, searchQuery, existingParticipants])

    const toggleUser = (user: User) => {
        setSelectedUsers(prev =>
            prev.find(u => u.id === user.id)
                ? prev.filter(u => u.id !== user.id)
                : [...prev, user]
        )
    }

    const handleAddMember = async () => {
        if (selectedUsers.length === 0) return

        setIsAdding(true)
        try {
            const participantIds = selectedUsers.map(u => u.id)
            await addParticipantService(conversationId, participantIds)
            onAdded(selectedUsers)
            onClose()
        } catch (error) {
            console.error("Failed to add members", error)
        } finally {
            setIsAdding(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <style>{`
                @keyframes slideInModal {
                    from {
                        opacity: 0;
                        transform: scale(0.96) translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>

            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[8px]"
                onClick={onClose}
            />

            <div
                className="relative w-full max-w-md flex flex-col rounded-[32px] overflow-hidden"
                style={{
                    animation: "slideInModal 0.4s ease",
                }}
            >
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <linearGradient id="addMemberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: "rgba(30,30,30,0.98)" }} />
                            <stop offset="50%" style={{ stopColor: "rgba(20,20,20,0.98)" }} />
                            <stop offset="100%" style={{ stopColor: "rgba(10,10,10,0.99)" }} />
                        </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" rx="32" fill="url(#addMemberGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </svg>

                <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 flex items-center justify-center border border-brand-primary/20">
                            <UserPlus className="w-5 h-5 text-cyan-300" />
                        </div>
                        <h3 className="font-bold text-xl tracking-tight text-white">{t('messages.add_member', { defaultValue: 'Thêm thành viên' })}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white hover:rotate-90 duration-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div
                    onScroll={handleScroll}
                    className="relative z-10 p-6 space-y-6 flex-1 overflow-y-auto min-h-[400px] max-h-[70vh] scroll-glass"
                >
                    <div className="space-y-3 flex flex-col">
                        <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/80 ml-1">{t('messages.members')} ({selectedUsers.length})</label>

                        {selectedUsers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-1 p-3 bg-white/5 rounded-2xl border border-white/10 max-h-40 overflow-y-auto scroll-glass">
                                {selectedUsers.map(u => (
                                    <div
                                        key={u.id}
                                        className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 bg-brand-primary/20 border border-brand-primary/30 rounded-xl text-xs font-semibold text-white animate-in zoom-in slide-in-from-top-1 duration-200"
                                    >
                                        <StoryAvatar src={u.avatar_url} alt={u.name} className="w-6 h-6 rounded-lg" />
                                        <span className="max-w-[120px] truncate">{u.name}</span>
                                        <button onClick={() => toggleUser(u)} className="p-0.5 hover:bg-white/20 rounded-md transition-colors">
                                            <X className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/50 group-focus-within:text-brand-primary transition-colors" />
                            <input
                                placeholder={t('messages.search_friends')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl text-[14px] focus:outline-none transition-all duration-300 bg-white/5 border-white/15 focus:border-cyan-500/50 text-white placeholder:text-white/30`}
                            />
                        </div>

                        <div className="mt-2 space-y-1.5">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Loader2 className="w-8 h-8 animate-spin mb-3 text-cyan-400" />
                                    <p className="text-sm font-medium text-white/70">{t('messages.loading_friends')}</p>
                                </div>
                            ) : filteredFriends.length > 0 ? (
                                filteredFriends.map(u => (
                                    <button
                                        key={u.id}
                                        onClick={() => toggleUser(u)}
                                        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 border ${selectedUsers.find(sel => sel.id === u.id)
                                            ? "bg-brand-primary/20 border-brand-primary/40"
                                            : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="relative">
                                                <StoryAvatar src={u.avatar_url} alt={u.name} className="w-12 h-12 rounded-xl" />
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-950 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-bold text-white leading-none mb-1.5">{u.name}</p>
                                                <p className="text-[12px] font-medium text-white/60">@{u.username}</p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${selectedUsers.find(sel => sel.id === u.id)
                                            ? "bg-brand-primary text-white scale-110 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                            : "bg-white/10 border border-white/20 text-transparent"
                                            }`}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Users className="w-12 h-12 mb-3 text-white/20" />
                                    <p className="text-sm font-medium text-white/50">
                                        {searchQuery ? t('messages.no_friends_found') : t('messages.empty_friends')}
                                    </p>
                                </div>
                            )}
                            {isFetchingMore && (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
                    <GlassButton
                        onClick={handleAddMember}
                        disabled={selectedUsers.length === 0 || isAdding}
                        className="w-full h-14 text-[15px] font-black tracking-wide shadow-[0_8px_30px_rgb(0,0,0,0.4)] active:scale-[0.97]"
                    >
                        {isAdding ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>{t('messages.processing', { defaultValue: 'Đang xử lý...' })}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span>{t('messages.add_member', { defaultValue: 'Thêm thành viên' })}</span>
                            </div>
                        )}
                    </GlassButton>
                </div>
            </div>
        </div>
    )
}
