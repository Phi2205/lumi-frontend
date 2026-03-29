"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, Image as ImageIcon, Video, Clock, Play } from "lucide-react"
import { GlassButton } from "@/lib/components/glass-button"
import { getMediaService } from "@/services/conversation.service"
import { urlImage } from "@/utils/imageUrl"
import { AttachmentUI } from "./ChatWindow"

interface MediaDetailViewProps {
    conversationId: string
    onBack: () => void
    isDarkMode?: boolean
}

export const MediaDetailView = ({ conversationId, onBack, isDarkMode = true }: MediaDetailViewProps) => {
    const [activeTab, setActiveTab] = useState<'media' | 'file'>('media')
    const [mediaItems, setMediaItems] = useState<AttachmentUI[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setIsLoading(true)
                const res = await getMediaService(conversationId, 50)
                console.log("res", res)
                if (res && res.data) {
                    setMediaItems(res.data.items.map((item: any) => ({
                        url: item.url,
                        type: item.file_type
                    })))
                }
            } catch (error) {
                console.error("Failed to fetch media in detail view:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMedia()
    }, [conversationId])

    // Simple grouping by month (mock for now based on current logic)
    const groupedMedia = useMemo(() => {
        // In real app, we would group by created_at from API
        // For now, we just show all
        return mediaItems
    }, [mediaItems])

    useEffect(() => {
        console.log("mediaItems", mediaItems)
    }, [mediaItems])

    return (
        <div className={`absolute inset-0 z-50 flex flex-col ${isDarkMode ? "bg-zinc-950" : "bg-white"}`}>
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-white/10">
                <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold">File phương tiện và file</h3>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5">
                <button
                    onClick={() => setActiveTab('media')}
                    className={`flex-1 py-3 text-sm font-medium transition-all relative ${activeTab === 'media' ? "text-blue-400" : "text-white/50"
                        }`}
                >
                    File phương tiện
                    {activeTab === 'media' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
                </button>
                <button
                    onClick={() => setActiveTab('file')}
                    className={`flex-1 py-3 text-sm font-medium transition-all relative ${activeTab === 'file' ? "text-blue-400" : "text-white/50"
                        }`}
                >
                    File
                    {activeTab === 'file' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 scroll-glass">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : activeTab === 'media' ? (
                    <div className="space-y-6">
                        {/* Note: In a real app, you'd map through months here */}
                        <div>
                            <p className="text-sm font-medium mb-3 opacity-70">Tháng này</p>
                            <div className="grid grid-cols-3 gap-1">
                                {mediaItems.map((item, idx) => (
                                    <div key={idx} className="aspect-square rounded-sm overflow-hidden border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                                        {item.type === 'video' ? (
                                            <div className="w-full h-full relative">
                                                <img
                                                    src={`https://res.cloudinary.com/dibvkarvg/video/upload/so_0/${item.url}.jpg`}
                                                    className="w-full h-full object-cover transition-opacity"
                                                    alt=""
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Play className="w-8 h-8 text-white fill-white/80 drop-shadow-xl group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="absolute bottom-1 right-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">0:00</div>
                                            </div>
                                        ) : (
                                            <img src={urlImage(item.url)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" alt="" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/30">
                        <FileText className="w-12 h-12 mb-2 opacity-20" />
                        <p className="text-sm">Không có file nào</p>
                    </div>
                )}
            </div>
        </div>
    )
}

import { useMemo } from "react"
