"use client"

import { SendIcon, Phone, Video, MoreHorizontal, Image as ImageIcon, X, AlertCircle } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState, memo, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { uploadService } from "@/services/upload.service"
import { GlassButton } from "@/lib/components/glass-button"
import { GlassInput } from "@/lib/components/glass-input"
import { GlassCard } from "@/lib/components/glass-card"
import { Participant } from "@/apis/conversation.api"
import { ConversationUI, ParticipantUI } from "./ConversationList"
import { playHlsPreview, playHlsVideo } from "@/lib/hls"
import { StoryAvatar } from "@/components/ui/avatar"
import { formatTime, formatPresence } from "@/utils/format"
import { ConversationInfo } from "./ConversationInfo"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import { urlImage } from "@/utils/imageUrl"

const VideoMessage = memo(({ publicId }: { publicId: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const modalCleanupRef = useRef<(() => void) | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current && !isOpen) {
      cleanupRef.current = playHlsVideo(videoRef.current, publicId);
    }
  };

  const handleMouseLeave = () => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
    // Dừng video preview ở ngoài
    handleMouseLeave();
  };

  useEffect(() => {
    if (isOpen && modalVideoRef.current) {
      modalCleanupRef.current = playHlsVideo(modalVideoRef.current, publicId);
    }
    return () => {
      if (modalCleanupRef.current) {
        modalCleanupRef.current();
        modalCleanupRef.current = null;
      }
    };
  }, [isOpen, publicId]);

  return (
    <>
      <video
        ref={videoRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleOpenModal}
        className="w-auto h-[350px] object-cover rounded-xl cursor-pointer"
        playsInline
        poster={`https://res.cloudinary.com/dibvkarvg/video/upload/so_0/${publicId}.jpg`}
      />

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all z-50"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          <video
            ref={modalVideoRef}
            controls
            autoPlay
            className="h-[90vh] w-auto max-w-[95vw] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </>
  );
});

export interface AttachmentUI {
  url: string;
  type: string;
}

export interface MessageUI {
  id: string
  sender: string
  senderAvatar: string
  content: string
  timestamp: string
  isOwn: boolean
  isRead?: boolean
  attachments?: AttachmentUI[]
}

interface ChatWindowProps {
  conversationId?: string
  conversationName: string
  conversationAvatar: string
  messages: MessageUI[]
  onSendMessage?: (content?: string, attachments?: AttachmentUI[]) => void
  isDarkMode?: boolean
  participants: ParticipantUI[]
  currentUserId?: string
  onMessageViewed?: (messageId: string) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
  isOnline?: boolean
  lastOnline?: string
  conversation?: ConversationUI
  // New props for jump mode
  targetMessageId?: string | null
  onLoadMoreAbove?: () => void
  hasMoreAbove?: boolean
  isLoadingMoreAbove?: boolean
  onLoadMoreBelow?: () => void
  hasMoreBelow?: boolean
  isLoadingMoreBelow?: boolean
  onCloseJumpMode?: () => void
  onJumpToMessage?: (messageId: string) => void
  onRefresh?: (users: any[]) => void
  onRemoveParticipant?: (userId: string) => void
}

const listUserSeenMessage = (participants: ParticipantUI[], messageId: string, currentUserId: string | undefined) => {
  const listUserSeen = participants.filter(p => p.id !== currentUserId && p.lastSeenMessageId && parseInt(p.lastSeenMessageId) >= parseInt(messageId))
  return listUserSeen
}

export const MessageItem = memo(({ message, isDarkMode, participants, currentUserId, onMessageViewed, showAuto, isHighlighted }: { message: MessageUI, isDarkMode: boolean, participants: ParticipantUI[], currentUserId?: string, onMessageViewed?: (id: string) => void, showAuto: boolean, isHighlighted?: boolean }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div id={`msg-${message.id}`} className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : "flex-row"} animate-in fade-in duration-400 ${isHighlighted ? "relative" : ""}`}>
      {isHighlighted && (
        <div className="absolute inset-0 bg-brand-primary/10 rounded-2xl -z-10 animate-pulse" />
      )}

      {!message.isOwn && (
        <Avatar
          className="h-9 w-9 flex-shrink-0 border mt-6"
          style={{
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
          }}
        >
          <AvatarImage src={message.senderAvatar || "/avatar-default.jpg"} alt={message.sender} />
          <AvatarFallback className="bg-zinc-800 text-white text-xs">{message.sender[0]}</AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col gap-1 max-w-[80%] ${message.isOwn ? "items-end" : "items-start"}`}>
        <span
          className="text-[10px] px-2 mb-0.5 uppercase tracking-wider font-semibold opacity-60"
          style={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'
          }}
        >
          {message.timestamp}
        </span>
        {/* Media Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {message.attachments.map((att, idx) => (
              <div
                key={idx}
                onClick={() => setShowDetails(!showDetails)}
                className="rounded-2xl overflow-hidden border border-white/10 shadow-sm active:scale-[0.98] transition-all cursor-pointer bg-black/10"
              >
                {att.type === 'image' || att.type === 'img' ? (
                  <img
                    src={urlImage(att.url)}
                    alt="attachment"
                    className="w-full max-h-[400px] object-cover"
                  />
                ) : att.type === 'video' ? (
                  <VideoMessage
                    publicId={att.url}
                  />
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* Text Content */}
        {message.content && (
          <div
            onClick={() => setShowDetails(!showDetails)}
            className={`rounded-2xl px-4 py-2.5 text-[14px] cursor-pointer active:scale-[0.98] select-none shadow-sm transition-all ${message.isOwn
              ? 'bg-brand-primary text-white border border-white/10'
              : isDarkMode
                ? 'bg-zinc-800/80 text-white border border-white/5 font-normal'
                : 'bg-white/90 text-gray-900 border border-gray-200 font-normal'
              }`}
          >
            <p>{message.content}</p>
          </div>
        )}
        <div
          className={`grid transition-all duration-300 ease-in-out ${message.isOwn && (showAuto || showDetails)
            ? "grid-rows-[1fr] opacity-100 mt-1.5"
            : "grid-rows-[0fr] opacity-0 mt-0"
            }`}
        >
          <div className="overflow-hidden">
            <div className="flex items-center justify-end px-1 pb-1">
              {(() => {
                const readBy = listUserSeenMessage(participants, message.id, currentUserId);
                if (readBy.length > 0) {
                  return (
                    <div className="flex -space-x-1.5">
                      {readBy.map((p) => (
                        <Avatar
                          key={p.id}
                          className="h-4 w-4 ring-1 ring-white/20 border-none transition-all hover:scale-110 active:scale-95"
                          title={p.name}
                        >
                          <AvatarImage src={p.avatar_url || "/avatar-default.jpg"} />
                          <AvatarFallback className="text-[6px] bg-zinc-800 text-white">
                            {p.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  );
                }
                return (
                  <svg
                    className="w-3.5 h-3.5 text-zinc-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";

export const ChatWindow = memo(({
  conversation,
  conversationId,
  conversationName,
  conversationAvatar,
  participants,
  currentUserId,
  messages,
  onSendMessage,
  onMessageViewed,
  onLoadMore,
  hasMore,
  isLoadingMore,
  isDarkMode = true,
  isOnline = false,
  lastOnline = "",
  // Jump mode props
  targetMessageId,
  onLoadMoreAbove,
  hasMoreAbove,
  isLoadingMoreAbove,
  onLoadMoreBelow,
  hasMoreBelow,
  isLoadingMoreBelow,
  onCloseJumpMode,
  onJumpToMessage,
  onRefresh,
  onRemoveParticipant
}: ChatWindowProps) => {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [atBottom, setAtBottom] = useState(true)
  const [sendError, setSendError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const initialJumpDone = useRef<string | null>(null)
  const lastScrollHeight = useRef<number>(0)
  const isAdjustingScroll = useRef<boolean>(false)

  // Biến đếm để chỉ cho phép hiển thị 1 lần (tin nhắn mới nhất có người xem)
  let autoShowCount = 1;

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...filesArray])
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (inputValue.trim() || selectedFiles.length > 0) {
      let finalContent = inputValue.trim()
      let attachments: AttachmentUI[] = []

      if (selectedFiles.length > 0) {
        setIsUploading(true)
        try {
          const uploadRes = await uploadService(selectedFiles)
          if (uploadRes && uploadRes.data) {
            attachments = uploadRes.data.map(item => ({
              url: item.public_id,
              type: item.type // 'image' or 'video'
            }))
          }
          console.log("Attachments:", attachments)
        } catch (error) {
          console.error("Upload failed", error)
          setSendError(t('messages.upload_failed', { defaultValue: 'Tải tệp lên thất bại. Vui lòng thử lại.' }))
          setIsUploading(false)
          return // Stop sending if upload fails
        } finally {
          setIsUploading(false)
        }
      }

      try {
        if (onSendMessage) {
          onSendMessage(finalContent, attachments)
        }
        setInputValue("")
        setSelectedFiles([])

        // Tắt JumpMode khi gửi tin nhắn mới
        if (targetMessageId && onCloseJumpMode) {
          onCloseJumpMode();
        }

        // Cuộn xuống đáy ngay lập tức
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
          setAtBottom(true);
        }
      } catch (error) {
        console.error("Send failed", error)
        setSendError(t('messages.send_failed', { defaultValue: 'Gửi tin nhắn thất bại. Vui lòng kiểm tra kết nối.' }))
      }
    }
  }

  useEffect(() => {
    if (sendError) {
      const timer = setTimeout(() => {
        setSendError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [sendError])

  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isAtTop = Math.abs(scrollTop) + clientHeight >= scrollHeight - 80
    const isAtBottom = Math.abs(scrollTop) <= 80

    setAtBottom(isAtBottom)

    if (targetMessageId) {
      // Jump mode: bi-directional
      if (isAtTop && onLoadMoreAbove && hasMoreAbove && !isLoadingMoreAbove) {
        console.log("Load lên trên")
        onLoadMoreAbove()
      } else if (isAtBottom && onLoadMoreBelow && hasMoreBelow && !isLoadingMoreBelow) {
        console.log("Load xuống dưới")
        onLoadMoreBelow()
      }
    } else {
      // Normal mode: only scroll up for more (older)
      if (isAtTop && onLoadMore && hasMore && !isLoadingMore) {
        onLoadMore()
      }
    }
  }

  const lastFirstMessageId = useRef<string | null>(null);

  useEffect(() => {
    if (targetMessageId) {
      if (initialJumpDone.current !== targetMessageId) {
        const el = document.getElementById(`msg-${targetMessageId}`);
        if (el) {
          if (hasMoreBelow) {
            el.scrollIntoView({ behavior: 'auto', block: 'center' });
          } else {
            // Nếu không còn tin nhắn phía dưới, nhảy thẳng về đáy (hiện tại)
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = 0;
              setAtBottom(true);
            }
          }
          initialJumpDone.current = targetMessageId;
          lastScrollHeight.current = scrollContainerRef.current?.scrollHeight || 0;
          lastFirstMessageId.current = messages[0]?.id || null;
        }
      } else if (scrollContainerRef.current && !isAdjustingScroll.current) {
        const container = scrollContainerRef.current;
        const newHeight = container.scrollHeight;
        const heightDiff = newHeight - lastScrollHeight.current;

        // Kiểm tra xem có phải là nạp tin nhắn MỚI HƠN phía dưới không?
        // (Trong mảng messages, messages[0] là tin nhắn mới nhất)
        const currentFirstId = messages[0]?.id;
        const isBelowLoad = lastFirstMessageId.current && currentFirstId !== lastFirstMessageId.current;

        if (heightDiff > 0 && isBelowLoad) {
          isAdjustingScroll.current = true;
          requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
              // Chỉ bù trừ khi có tin nhắn nạp vào phía ĐÁY (newer messages)
              const targetScroll = scrollContainerRef.current.scrollTop - heightDiff;
              scrollContainerRef.current.scrollTop = targetScroll;
            }
            isAdjustingScroll.current = false;
          });
        }
        lastScrollHeight.current = newHeight;
        lastFirstMessageId.current = currentFirstId || null;
      }
    } else {
      initialJumpDone.current = null;
      lastScrollHeight.current = scrollContainerRef.current?.scrollHeight || 0;
      lastFirstMessageId.current = messages[0]?.id || null;
    }
  }, [targetMessageId, messages, hasMoreBelow]);

  // Auto scroll to bottom when new messages arrival (Normal Mode)
  useEffect(() => {
    if (!targetMessageId && atBottom && scrollContainerRef.current) {
      // Trong flex-col-reverse, 0 là đáy (mới nhất)
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [messages, targetMessageId, atBottom]);

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex flex-col h-full flex-1 min-w-0">
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-4 py-4 sm:px-6 border-b backdrop-blur-md relative z-10 transform translate-z-0"
          style={isDarkMode ? {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          } : {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="flex items-center gap-3 ml-12 lg:ml-0">
            <StoryAvatar
              src={(!conversation || conversation.avatar === "") ? (conversation?.type === 'group' ? "/avatar-group-default.jpg" : "/avatar-default.jpg") : conversationAvatar}
              alt={conversationName}
              isOnline={isOnline}
              className="h-10 w-10"
            />
            <div>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{conversationName}</p>
              <p className={`text-xs ${isDarkMode ? 'text-white/70' : 'text-gray-600'} font-semibold`}>
                {isOnline ? t('messages.active_now') : (lastOnline ? `${formatPresence(lastOnline)}` : t('messages.offline'))}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">

            <GlassButton
              variant="ghost"
              size="sm"
              blur={18}
              refraction={0.1}
              depth={2}
              className="h-10 w-10 p-0"
            >
              <Phone className="h-4 w-4 text-cyan-300" />
            </GlassButton>
            <GlassButton
              variant="ghost"
              size="sm"
              blur={18}
              refraction={0.1}
              depth={2}
              className="h-10 w-10 p-0"
            >
              <Video className="h-4 w-4 text-cyan-300" />
            </GlassButton>
            <GlassButton
              variant="ghost"
              size="sm"
              blur={18}
              refraction={0.1}
              depth={2}
              className={`h-10 w-10 p-0 transition-all ${showInfo ? 'bg-white/20' : ''}`}
              onClick={() => setShowInfo(!showInfo)}
            >
              <MoreHorizontal className="h-4 w-4 text-cyan-300" />
            </GlassButton>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col-reverse gap-4 relative z-10 scroll-glass"
          style={{ overflowAnchor: 'none' }}
        >

          {messages.map((message, index) => {
            const seenByCount = listUserSeenMessage(participants, message.id, currentUserId).length;
            let canShow = false;

            if (index === 0 && message.isOwn && seenByCount === 0) {
              canShow = true;
            }
            else if (message.isOwn && seenByCount > 0 && autoShowCount > 0) {
              canShow = true;
              autoShowCount--;
            }

            return (
              <MessageItem
                key={message.id}
                message={message}
                participants={participants}
                currentUserId={currentUserId}
                isDarkMode={isDarkMode}
                onMessageViewed={onMessageViewed}
                showAuto={canShow}
                isHighlighted={message.id === targetMessageId}
              />
            );
          })}
          {(isLoadingMore || isLoadingMoreAbove) && (
            <div className="flex justify-center p-4">
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {isLoadingMoreBelow && (
            <div className="flex justify-center p-4 absolute bottom-[100px] left-1/2 -translate-x-1/2 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 z-50">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2" />
              <span className="text-[10px]">{t('messages.loading_newer')}</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className="px-4 py-4 sm:px-6 border-t backdrop-blur-md relative z-10 transform translate-z-0"
          style={isDarkMode ? {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          } : {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderColor: 'rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* File Previews */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="relative group/img h-16 w-16">
                  {file.type.startsWith('video/') ? (
                    <div className="h-full w-full bg-zinc-800 rounded-lg border border-white/20 flex items-center justify-center overflow-hidden">
                      <Video className="h-6 w-6 text-white/40" />
                    </div>
                  ) : (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="h-full w-full object-cover rounded-lg border border-white/20"
                    />
                  )}
                  <button
                    onClick={() => handleRemoveFile(idx)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-lg scale-0 group-hover/img:scale-100 transition-transform"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {sendError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-3"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs backdrop-blur-md">
                  <AlertCircle className="h-4 w-4" />
                  <span className="flex-1">{sendError}</span>
                  <button onClick={() => setSendError(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 items-end">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleSelectFiles}
            />
            <GlassButton
              variant="ghost"
              size="sm"
              blur={18}
              className="h-12 w-12 p-0 flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <ImageIcon className="h-5 w-5 text-cyan-300" />
            </GlassButton>
            <div className="flex-1 flex items-center bg-black/20 backdrop-blur-md rounded-2xl px-4 py-1 border border-white/10 focus-within:border-brand-primary/50 transition-[border-color] duration-200 min-w-0 transform translate-z-0"
              style={!isDarkMode ? {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'rgba(0, 0, 0, 0.1)'
              } : undefined}
            >
              <input
                placeholder={isUploading ? t('messages.uploading_files') : t('messages.message_placeholder')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isUploading && handleSend()}
                disabled={isUploading}
                className="w-full py-2.5 text-[14px] bg-transparent border-none outline-none focus:outline-none transition-all"
                style={{
                  color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(20, 20, 20)'
                }}
              />
            </div>
            <GlassButton
              blur={22}
              refraction={0.15}
              depth={3}
              onClick={handleSend}
              disabled={(!inputValue.trim() && selectedFiles.length === 0) || isUploading}
              className="h-12 w-12 p-0 flex-shrink-0"
            >
              {isUploading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Info Sidebar */}
      <div
        className={`fixed inset-0 lg:relative lg:inset-auto z-[100] lg:z-20 transition-all duration-300 ease-in-out
          ${showInfo
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 pointer-events-none lg:pointer-events-auto'
          } ${showInfo ? 'w-full lg:w-[350px]' : 'w-0'}`}
      >
        <div className="w-full h-full lg:w-[350px] overflow-hidden shadow-2xl lg:shadow-none">
          <ConversationInfo
            conversationId={conversationId}
            conversationName={conversationName}
            conversationAvatar={conversationAvatar}
            participants={participants}
            messages={messages}
            isDarkMode={isDarkMode}
            isOnline={isOnline}
            onClose={() => setShowInfo(false)}
            currentUserId={currentUserId}
            conversation={conversation}
            onJumpToMessage={onJumpToMessage}
            targetMessageId={targetMessageId}
            onRefresh={onRefresh}
            onRemoveParticipant={onRemoveParticipant}
          />
        </div>
      </div>
    </div>
  )
});

ChatWindow.displayName = "ChatWindow";
