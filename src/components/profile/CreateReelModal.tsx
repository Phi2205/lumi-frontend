"use client"

import React, { useState, useRef, useEffect } from "react"
import { Modal } from "@/lib/components/modal"
import { GlassButton, GlassInput } from "@/lib/components"
import { Plus, Video, Music, Type, X, UploadCloud, CheckCircle2 } from "lucide-react"
import { useUpload } from "@/contexts/UploadContext"

interface CreateReelModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export const CreateReelModal: React.FC<CreateReelModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { addUpload } = useUpload()
    const [file, setFile] = useState<File | null>(null)
    const [videoPreview, setVideoPreview] = useState<string | null>(null)
    const [caption, setCaption] = useState("")
    const [musicName, setMusicName] = useState("")
    const [duration, setDuration] = useState(0)
    const videoRef = useRef<HTMLVideoElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (!selectedFile.type.startsWith("video/")) {
                console.error("Please select a video file")
                return
            }
            setFile(selectedFile)
            const url = URL.createObjectURL(selectedFile)
            setVideoPreview(url)
        }
    }

    const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        setDuration(Math.round(e.currentTarget.duration))
    }

    const clearSelection = () => {
        setFile(null)
        setVideoPreview(null)
        setCaption("")
        setMusicName("")
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleUpload = () => {
        if (!file) return

        // Start upload in background
        addUpload(file, caption, musicName, duration)

        // Close modal immediately
        onSuccess?.()
        onClose()
        clearSelection()
    }

    useEffect(() => {
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview)
        }
    }, [videoPreview])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Reel"
            maxWidthClassName="max-w-[700px]"
        >
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Side: Video Preview/Picker */}
                <div className="w-full md:w-[300px] aspect-[9/16] relative group">
                    {!videoPreview ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-full border-2 border-dashed border-white/10 rounded-2xl bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.08] transition-all group"
                        >
                            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Video className="w-8 h-8 text-brand-primary" />
                            </div>
                            <span className="text-white font-semibold">Select Video</span>
                            <span className="text-white/40 text-xs mt-2">MP4 or WebM (Large files supported)</span>
                        </div>
                    ) : (
                        <div className="w-full h-full relative rounded-2xl overflow-hidden bg-black shadow-2xl">
                            <video
                                ref={videoRef}
                                src={videoPreview}
                                className="w-full h-full object-cover"
                                onLoadedMetadata={handleVideoMetadata}
                                controls
                            />
                            <button
                                onClick={clearSelection}
                                className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Right Side: Inputs */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/60 flex items-center gap-2">
                                <Type className="w-4 h-4" /> Caption
                            </label>
                            <textarea
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all resize-none"
                                placeholder="What's your reel about?"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/60 flex items-center gap-2">
                                <Music className="w-4 h-4" /> Music Name
                            </label>
                            <GlassInput
                                placeholder="e.g. Blinding Lights - The Weeknd"
                                value={musicName}
                                onChange={(e) => setMusicName(e.target.value)}
                                className="bg-white/5"
                            />
                        </div>
                    </div>

                    <div className="mt-auto space-y-4">
                        <div className="flex gap-3">
                            <GlassButton
                                onClick={onClose}
                                className="flex-1 bg-white/5 hover:bg-white/10"
                            >
                                Cancel
                            </GlassButton>
                            <GlassButton
                                onClick={handleUpload}
                                disabled={!file}
                                className="flex-2 bg-linear-to-r from-brand-primary to-brand-primary-dark shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40"
                            >
                                <span className="flex items-center gap-2">
                                    <UploadCloud className="w-4 h-4" />
                                    Share Now
                                </span>
                            </GlassButton>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
