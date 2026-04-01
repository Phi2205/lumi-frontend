"use client"

import { useState, useMemo, useEffect } from "react"
import {
    User,
    BellOff,
    Search,
    ChevronDown,
    ChevronUp,
    Pin,
    Palette,
    Smile,
    Type,
    Image as ImageIcon,
    FileText,
    Shield,
    Trash2,
    Eye,
    UserMinus,
    Slash,
    AlertCircle,
    Clock,
    Lock,
    ArrowLeft,
    UserPlus
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { StoryAvatar } from "@/components/ui/avatar"
import { GlassButton } from "@/lib/components/glass-button"
import { MessageUI, AttachmentUI } from "./ChatWindow"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

import { useRouter } from "next/navigation"

import { getMediaService, searchMessageService, checkOwnerService, removeParticipantService } from "@/services/conversation.service"
import { messageSearch } from "@/apis/conversation.api"
import { useDebounce } from "@/hooks/useDebounce"
import { urlImage } from "@/utils/imageUrl"
import { MediaDetailView } from "./MediaDetailView"
import { AddMemberModal } from "./AddMemberModal"
import { ConfirmModal } from "@/components/ui/ConfirmModal"

import { ConversationUI, ParticipantUI } from "./ConversationList"

interface ConversationInfoProps {
    conversation?: ConversationUI
    conversationId?: string
    conversationName: string
    conversationAvatar: string
    participants: ParticipantUI[]
    messages: MessageUI[]
    isDarkMode?: boolean
    isOnline?: boolean
    onClose?: () => void
    currentUserId?: string
    onJumpToMessage?: (messageId: string) => void
    targetMessageId?: string | null
    onRefresh?: (users: any[]) => void
    onRemoveParticipant?: (userId: string) => void
}

const InfoSection = ({
    title,
    children,
    isOpen,
    onToggle,
    isDarkMode
}: {
    title: string,
    children: React.ReactNode,
    isOpen: boolean,
    onToggle: () => void,
    isDarkMode: boolean
}) => {
    return (
        <div className="border-t border-white/5">
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
            >
                <span className="text-sm font-semibold">{title}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
            </button>
            {isOpen && <div className="pb-2">{children}</div>}
        </div>
    )
}

const InfoItem = ({
    icon: Icon,
    label,
    subLabel,
    onClick,
    isDarkMode,
    danger
}: {
    icon: any,
    label: string,
    subLabel?: string,
    onClick?: () => void,
    isDarkMode: boolean,
    danger?: boolean
}) => {
    return (
        <button
            onClick={onClick}
            disabled={!onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${danger ? "text-red-400" : isDarkMode ? "text-white" : "text-gray-900"
                } ${!onClick ? "opacity-30 cursor-not-allowed" : "hover:bg-white/5 cursor-pointer"}`}
        >
            <div className={`p-2 rounded-full ${isDarkMode ? "bg-white/10" : "bg-gray-100"}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{label}</p>
                {subLabel && <p className="text-[11px] opacity-50 truncate">{subLabel}</p>}
            </div>
        </button>
    )
}

export const ConversationInfo = ({
    conversation,
    conversationId,
    conversationName,
    conversationAvatar,
    participants,
    messages,
    isDarkMode = true,
    isOnline = false,
    onClose,
    currentUserId,
    onJumpToMessage,
    targetMessageId,
    onRefresh,
    onRemoveParticipant
}: ConversationInfoProps) => {
    const { t } = useTranslation()
    const router = useRouter()
    const [sections, setSections] = useState({
        chatInfo: true,
        customization: false,
        members: true,
        media: true,
        privacy: false
    })

    const [allMedia, setAllMedia] = useState<AttachmentUI[]>([])
    const [isLoadingMedia, setIsLoadingMedia] = useState(false)
    const [showMediaDetail, setShowMediaDetail] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<messageSearch[]>([])
    const [isSearchingLoading, setIsSearchingLoading] = useState(false)
    const [searchPage, setSearchPage] = useState(1)
    const [hasMoreSearch, setHasMoreSearch] = useState(false)
    const [isSearchingMore, setIsSearchingMore] = useState(false)
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [removingUserId, setRemovingUserId] = useState<string | null>(null)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [userToRemove, setUserToRemove] = useState<ParticipantUI | null>(null)
    const debouncedSearchQuery = useDebounce(searchQuery, 500)

    useEffect(() => {
        const fetchOwnerStatus = async () => {
            if (conversation?.type === 'group' && conversationId) {
                try {
                    const res = await checkOwnerService(conversationId)
                    if (res && res.success && typeof res.data.isOwner === 'boolean') {
                        setIsOwner(res.data.isOwner)
                    }
                } catch (error) {
                    console.error("Failed to check owner:", error)
                    setIsOwner(false)
                }
            } else {
                setIsOwner(false)
            }
        }
        fetchOwnerStatus()
    }, [conversationId, conversation?.type])

    useEffect(() => {
        const handleInitialSearch = async () => {
            if (!debouncedSearchQuery.trim() || !conversationId) {
                setSearchResults([])
                setSearchPage(1)
                setHasMoreSearch(false)
                return
            }

            setIsSearchingLoading(true)
            setSearchPage(1)
            try {
                const data = await searchMessageService(conversationId, debouncedSearchQuery, "1", "20")
                if (data && data.success) {
                    setSearchResults(data.data.items || [])
                    setHasMoreSearch(data.data.pagination?.hasNextPage || false)
                }
            } catch (error) {
                console.error("Search error:", error)
            } finally {
                setIsSearchingLoading(false)
            }
        }

        handleInitialSearch()
    }, [debouncedSearchQuery, conversationId])

    const loadMoreSearch = async () => {
        if (!conversationId || isSearchingMore || !hasMoreSearch || !debouncedSearchQuery) return;

        setIsSearchingMore(true);
        const nextPage = searchPage + 1;
        try {
            const data = await searchMessageService(conversationId, debouncedSearchQuery, nextPage.toString(), "20");
            if (data && data.success) {
                setSearchResults(prev => [...prev, ...(data.data.items || [])]);
                setSearchPage(nextPage);
                setHasMoreSearch(data.data.pagination?.hasNextPage || false);
            }
        } catch (error) {
            console.error("Load more search error:", error);
        } finally {
            setIsSearchingMore(false);
        }
    };

    const handleSearchScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // Kiểm tra xem đã cuộn gần tới đáy chưa (còn cách đáy 20px)
        if (scrollHeight - scrollTop - clientHeight < 20) {
            loadMoreSearch();
        }
    };

    const handleRemoveMember = (participant: ParticipantUI, e: React.MouseEvent) => {
        e.stopPropagation()
        setUserToRemove(participant)
        setIsConfirmModalOpen(true)
    }

    const onConfirmRemove = async () => {
        if (!conversationId || !userToRemove) return

        setRemovingUserId(userToRemove.id)
        setIsConfirmModalOpen(false) // Close modal immediately
        try {
            await removeParticipantService(conversationId, userToRemove.id)
            onRemoveParticipant?.(userToRemove.id)
        } catch (error) {
            console.error("Failed to remove member:", error)
        } finally {
            setRemovingUserId(null)
            setUserToRemove(null)
        }
    }

    const handleProfileClick = () => {
        const otherParticipant = participants.find(p => p.id !== currentUserId);
        if (otherParticipant?.username) {
            router.push(`/users/${otherParticipant.username}`);
        } else if (otherParticipant?.id) {
            router.push(`/users/${otherParticipant.id}`);
        }
    }

    const toggleSection = (section: keyof typeof sections) => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    const handleMediaClick = async () => {
        setShowMediaDetail(true)
        // Dữ liệu sẽ được MediaDetailView tự gọi khi component đó mount
    }

    const mediaFiles = useMemo(() => {
        const files: AttachmentUI[] = []
        messages.forEach(msg => {
            if (msg.attachments) {
                msg.attachments.forEach(att => {
                    if (att.type === 'image' || att.type === 'img' || att.type === 'video') {
                        files.push(att)
                    }
                })
            }
        })
        return files
    }, [messages])

    const documentFiles = useMemo(() => {
        const files: AttachmentUI[] = []
        messages.forEach(msg => {
            if (msg.attachments) {
                msg.attachments.forEach(att => {
                    if (att.type !== 'image' && att.type !== 'img' && att.type !== 'video') {
                        files.push(att)
                    }
                })
            }
        })
        return files
    }, [messages])

    return (
        <div className={`w-full h-full flex flex-col overflow-y-auto ${isDarkMode
            ? "bg-black/10 backdrop-blur-sm text-white border-l border-white/10"
            : "bg-white/30 backdrop-blur-sm text-gray-900 border-l border-black/5"
            } relative shadow-2xl`}>
            {/* Search Overlay */}
            {isSearching && (
                <div className={`absolute inset-0 z-20 flex flex-col ${isDarkMode ? "bg-[#121212]" : "bg-white"}`}>
                    <div className="p-4 border-b border-white/10 flex items-center gap-2">
                        <button onClick={() => {
                            setIsSearching(false)
                            setSearchQuery("")
                            setSearchResults([])
                        }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                            <input
                                autoFocus
                                type="text"
                                placeholder={t('messages.search_messages')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all ${!isDarkMode && "bg-black/5 text-gray-900 border-black/10"}`}
                            />
                        </div>
                    </div>

                    <div
                        onScroll={handleSearchScroll}
                        className="flex-1 overflow-y-auto p-4 custom-scrollbar scroll-glass"
                    >
                        {isSearchingLoading ? (
                            <div className="flex flex-col items-center justify-center h-40 opacity-50">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary mb-2"></div>
                                <span className="text-sm">{t('messages.searching')}</span>
                            </div>
                        ) : searchQuery && searchResults.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 opacity-50">
                                <Search className="w-10 h-10 mb-2" />
                                <span className="text-sm text-center">{t('messages.no_results_for')}<br /><span className="font-semibold">"{searchQuery}"</span></span>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-3">
                                {searchResults.map((msg) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => {
                                            if (msg.id === targetMessageId) {
                                                // Nếu đã là target rồi thì chỉ cần scroll đến
                                                const el = document.getElementById(`msg-${msg.id}`);
                                                if (el) {
                                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }
                                            } else {
                                                // Nếu là tin nhắn khác thì nhảy chế độ jump sang tin nhắn đó
                                                onJumpToMessage?.(msg.id);
                                            }

                                            // Đóng sidebar nếu đang ở chế độ mobile
                                            if (window.innerWidth < 1024) {
                                                onClose?.();
                                            }
                                        }}
                                        className={`p-3 rounded-2xl transition-all cursor-pointer group border ${isDarkMode
                                            ? "hover:bg-white/5 border-transparent hover:border-white/10"
                                            : "hover:bg-black/5 border-transparent hover:border-black/5"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <Avatar className="h-6 w-6 border border-white/10">
                                                <AvatarImage src={msg.sender.avatar_url || "/avatar-default.jpg"} />
                                                <AvatarFallback className="text-[10px]">{msg.sender.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold truncate">{msg.sender.name}</span>
                                                    <span className="text-[10px] opacity-40">{new Date(msg.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`text-xs leading-relaxed opacity-70 line-clamp-3 ml-8 ${!isDarkMode && "text-gray-700"}`}>
                                            {msg.content}
                                        </p>
                                    </div>
                                ))}
                                {isSearchingMore && (
                                    <div className="flex justify-center p-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-primary"></div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 opacity-30 text-center px-8">
                                <Search className="w-12 h-12 mb-4" />
                                <p className="text-sm">{t('messages.enter_search_desc')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Mobile Header / Back Button */}
            <div className="lg:hidden flex items-center p-4 border-b border-white/5">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="ml-2 font-semibold text-sm">{t('messages.information')}</span>
            </div>
            {/* Header Profile */}
            <div className="flex flex-col items-center pt-8 pb-6 px-4">
                <StoryAvatar
                    src={conversationAvatar || (conversation?.type === 'group' ? "/avatar-group-default.jpg" : "/avatar-default.jpg")}
                    alt={conversationName}
                    isOnline={isOnline}
                    className="h-20 w-20 mb-3"
                />
                <h2 className="text-lg font-bold text-center">{conversationName}</h2>
                <p className="text-xs opacity-60 mb-4">{isOnline ? t('messages.active_now') : t('messages.offline')}</p>

                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium mb-6 backdrop-blur-md border ${isDarkMode ? "bg-white/10 border-white/5" : "bg-black/5 border-black/5"
                    }`}>
                    <Lock className="w-3 h-3" />
                    <span>{t('messages.end_to_end_encrypted')}</span>
                </div>

                <div className="flex justify-center gap-8 w-full mb-4">
                    {conversation?.type !== 'group' && (
                        <div
                            onClick={handleProfileClick}
                            className="flex flex-col items-center gap-1.5 cursor-pointer group"
                        >
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${isDarkMode ? "bg-white/10 group-hover:bg-white/20 border-white/10 shadow-lg shadow-black/20" : "bg-white/50 group-hover:bg-white/80 border-black/5 shadow-sm"
                                }`}>
                                <User className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-medium">{t('messages.profile')}</span>
                        </div>
                    )}
                    <div className="flex flex-col items-center gap-1.5 opacity-30 cursor-not-allowed">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center backdrop-blur-md border ${isDarkMode ? "bg-white/10 border-white/10" : "bg-gray-200 border-black/5"
                            }`}>
                            <BellOff className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-medium">{t('messages.mute_notifications')}</span>
                    </div>
                    <div
                        onClick={() => setIsSearching(true)}
                        className="flex flex-col items-center gap-1.5 cursor-pointer group"
                    >
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${isDarkMode ? "bg-white/10 group-hover:bg-white/20 border-white/10 shadow-lg shadow-black/20" : "bg-white/50 group-hover:bg-white/80 border-black/5 shadow-sm"
                            }`}>
                            <Search className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-medium">{t('messages.search')}</span>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="flex-1">
                <InfoSection
                    title={t('messages.about_chat')}
                    isOpen={sections.chatInfo}
                    onToggle={() => toggleSection('chatInfo')}
                    isDarkMode={isDarkMode}
                >
                    <InfoItem icon={Pin} label={t('messages.view_pinned')} isDarkMode={isDarkMode} />
                </InfoSection>

                {conversation?.type === 'group' && (
                    <InfoSection
                        title={t('messages.group_members')}
                        isOpen={sections.members}
                        onToggle={() => toggleSection('members')}
                        isDarkMode={isDarkMode}
                    >
                        <div className="px-2 space-y-1">
                            {isOwner && (
                                <div
                                    onClick={() => setIsAddMemberModalOpen(true)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all hover:bg-white/5 cursor-pointer group w-full text-left`}
                                >
                                    <div className="h-8 w-8 rounded-full border border-dashed border-white/30 flex items-center justify-center group-hover:border-white">
                                        <UserPlus className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                                    </div>
                                    <span className={`text-sm font-medium ${isDarkMode ? "text-white/80 group-hover:text-white" : "text-gray-700"}`}>
                                        {t('messages.add_member', { defaultValue: 'Thêm thành viên' })}
                                    </span>
                                </div>
                            )}

                            {participants.map((p) => (
                                <div
                                    key={p.id}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all hover:bg-white/5 cursor-pointer group w-full text-left`}
                                    onClick={() => {
                                        if (p.username) router.push(`/users/${p.username}`)
                                        else router.push(`/users/${p.id}`)
                                    }}
                                >
                                    <Avatar className="h-8 w-8 border border-white/10">
                                        <AvatarImage src={p.avatar_url || "/avatar-default.jpg"} />
                                        <AvatarFallback className="text-[10px] bg-zinc-800 text-white">
                                            {p.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm font-medium truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>{p.name}</p>
                                            {p.id === currentUserId && (
                                                <span className="text-[10px] font-medium bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded">{t('messages.you')}</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] opacity-50 truncate">@{p.username || p.id.slice(0, 8)}</p>
                                    </div>
                                    {p.isOnline && (
                                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                                    )}

                                    {isOwner && p.id !== currentUserId && (
                                        <button
                                            onClick={(e) => handleRemoveMember(p, e)}
                                            disabled={removingUserId === p.id}
                                            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all text-red-400 hover:text-red-500 disabled:opacity-50"
                                        >
                                            {removingUserId === p.id ? (
                                                <div className="h-3.5 w-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </InfoSection>
                )}

                <InfoSection
                    title={t('messages.customize_chat')}
                    isOpen={sections.customization}
                    onToggle={() => toggleSection('customization')}
                    isDarkMode={isDarkMode}
                >
                    <InfoItem icon={Palette} label={t('messages.change_theme')} isDarkMode={isDarkMode} />
                    <InfoItem icon={Smile} label={t('messages.change_emoji')} isDarkMode={isDarkMode} />
                    <InfoItem icon={Type} label={t('messages.edit_nicknames')} isDarkMode={isDarkMode} />
                </InfoSection>

                <InfoSection
                    title={t('messages.media_files')}
                    isOpen={sections.media}
                    onToggle={() => toggleSection('media')}
                    isDarkMode={isDarkMode}
                >
                    <InfoItem
                        icon={ImageIcon}
                        label={t('messages.media')}
                        isDarkMode={isDarkMode}
                        onClick={handleMediaClick}
                    />
                    <InfoItem
                        icon={FileText}
                        label={t('messages.files')}
                        subLabel={documentFiles.length > 0 ? t('messages.files_count', { count: documentFiles.length }) : t('messages.no_files')}
                        isDarkMode={isDarkMode}
                    />
                </InfoSection>

                <InfoSection
                    title={t('messages.privacy_support')}
                    isOpen={sections.privacy}
                    onToggle={() => toggleSection('privacy')}
                    isDarkMode={isDarkMode}
                >
                    <InfoItem icon={BellOff} label={t('messages.mute_notifications')} isDarkMode={isDarkMode} />
                    <InfoItem icon={Shield} label={t('messages.messaging_permissions')} isDarkMode={isDarkMode} />
                    <InfoItem icon={Clock} label={t('messages.disappearing_messages')} isDarkMode={isDarkMode} />
                    <InfoItem icon={Eye} label={t('messages.read_receipts')} subLabel={t('messages.on')} isDarkMode={isDarkMode} />
                    <InfoItem icon={Lock} label={t('messages.verify_encryption')} isDarkMode={isDarkMode} />
                    <InfoItem icon={UserMinus} label={t('messages.restrict')} isDarkMode={isDarkMode} />
                    <InfoItem icon={Slash} label={t('messages.block')} isDarkMode={isDarkMode} />
                    <InfoItem icon={AlertCircle} label={t('messages.report')} subLabel={t('messages.report_desc')} danger isDarkMode={isDarkMode} />
                </InfoSection>
            </div>

            {/* Full-screen Media Detail View overlay */}
            {showMediaDetail && conversationId && (
                <MediaDetailView
                    conversationId={conversationId}
                    onBack={() => setShowMediaDetail(false)}
                    isDarkMode={isDarkMode}
                />
            )}

            {conversationId && (
                <AddMemberModal
                    isOpen={isAddMemberModalOpen}
                    onClose={() => setIsAddMemberModalOpen(false)}
                    conversationId={conversationId}
                    existingParticipants={participants}
                    onAdded={(newUsers) => {
                        onRefresh?.(newUsers)
                    }}
                    isDarkMode={isDarkMode}
                />
            )}

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={onConfirmRemove}
                title={t('messages.remove_member_title', { defaultValue: "Xóa thành viên" })}
                description={t('messages.remove_member_confirm', {
                    defaultValue: `Bạn có chắc chắn muốn xóa ${userToRemove?.name} khỏi nhóm không?`
                })}
                danger
                isLoading={removingUserId !== null}
            />
        </div>
    )
}
