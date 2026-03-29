"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import axios from "axios"
import { signatureUploadApi } from "@/apis/upload.api"
import { creatReelApi } from "@/apis/reel.api"
import { uploadDb, StoredUpload } from "@/lib/upload-db"

export interface UploadItem {
    id: string
    fileName: string
    progress: number
    status: "uploading" | "creating" | "success" | "error" | "interrupted"
    error?: string
}

interface UploadContextType {
    uploads: UploadItem[]
    addUpload: (file: File, caption: string, musicName: string, duration: number) => Promise<void>
    resumeUpload: (id: string) => Promise<void>
    removeUpload: (id: string) => void
    isStackOpen: boolean
    setIsStackOpen: (open: boolean) => void
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [uploads, setUploads] = useState<UploadItem[]>([])
    const [isStackOpen, setIsStackOpen] = useState(false)
    const activeUploadsRef = useRef<{ [key: string]: boolean }>({})

    // Initialize: Load pending uploads from IndexedDB
    useEffect(() => {
        const loadPending = async () => {
            try {
                const pending = await uploadDb.getAll()
                if (pending.length > 0) {
                    setUploads(pending.map(p => ({
                        id: p.id,
                        fileName: p.file.name,
                        progress: p.progress,
                        status: "interrupted"
                    })))
                    setIsStackOpen(true)
                }
            } catch (err) {
                console.error("Failed to load pending uploads:", err)
            }
        }
        loadPending()
    }, [])

    const removeUpload = useCallback(async (id: string) => {
        activeUploadsRef.current[id] = false
        setUploads((prev) => prev.filter((u) => u.id !== id))
        await uploadDb.remove(id)
    }, [])

    const updateUploadState = useCallback((id: string, updates: Partial<UploadItem>) => {
        setUploads((prev) =>
            prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
        )
    }, [])

    const processUpload = async (id: string, file: File, caption: string, musicName: string, duration: number, startByte = 0) => {
        activeUploadsRef.current[id] = true

        try {
            const CHUNK_SIZE = 10 * 1024 * 1024 // 10MB
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
            const startChunk = Math.floor(startByte / CHUNK_SIZE)

            const sigRes = await signatureUploadApi("reels", "lumi_reels")
            if (!sigRes.data.success) throw new Error("Failed to get signature")

            const { signature, timestamp, api_key, cloud_name } = sigRes.data.data
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload_chunked`

            let lastResponseData: any = null

            for (let i = startChunk; i < totalChunks; i++) {
                if (!activeUploadsRef.current[id]) return // Cancel if removed

                const start = i * CHUNK_SIZE
                const end = Math.min(start + CHUNK_SIZE, file.size)
                const chunk = file.slice(start, end)

                const formData = new FormData()
                formData.append("file", chunk, file.name)
                formData.append("api_key", api_key)
                formData.append("timestamp", timestamp)
                formData.append("signature", signature)
                formData.append("folder", "reels")
                formData.append("resource_type", "video")

                const response = await axios.post(cloudinaryUrl, formData, {
                    headers: {
                        "X-Unique-Upload-Id": id,
                        "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const chunkProgress = progressEvent.loaded / progressEvent.total
                            const overallProgress = ((start + chunkProgress * (end - start)) / file.size) * 100
                            updateUploadState(id, { progress: overallProgress, status: "uploading" })
                        }
                    },
                })

                lastResponseData = response.data

                // Save progress to DB after each chunk
                await uploadDb.save({
                    id, file, caption, musicName, duration,
                    progress: (end / file.size) * 100,
                    status: "uploading",
                    lastByte: end
                })
            }

            if (!lastResponseData) throw new Error("Upload failed")

            updateUploadState(id, { status: "creating", progress: 99 })
            await creatReelApi({
                video_url: lastResponseData.secure_url,
                thumbnail_url: lastResponseData.thumbnail_url || lastResponseData.secure_url.replace(/\.[^/.]+$/, ".jpg"),
                public_id: lastResponseData.public_id,
                caption,
                music_name: musicName || "Original Audio",
                duration
            })

            updateUploadState(id, { status: "success", progress: 100 })
            await uploadDb.remove(id)
            setTimeout(() => removeUpload(id), 15000)

        } catch (error: any) {
            console.error("Upload process error:", error)
            updateUploadState(id, { status: "error", error: error.message })
        }
    }

    const addUpload = useCallback(async (file: File, caption: string, musicName: string, duration: number) => {
        const id = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

        setUploads(prev => [...prev, { id, fileName: file.name, progress: 0, status: "uploading" }])
        setIsStackOpen(true)

        await uploadDb.save({
            id, file, caption, musicName, duration, progress: 0, status: "uploading", lastByte: 0
        })

        processUpload(id, file, caption, musicName, duration)
    }, [])

    const resumeUpload = useCallback(async (id: string) => {
        const pending = await uploadDb.getAll()
        const upload = pending.find(u => u.id === id)

        if (upload) {
            updateUploadState(id, { status: "uploading" })
            processUpload(id, upload.file, upload.caption, upload.musicName, upload.duration, upload.lastByte)
        }
    }, [updateUploadState])

    return (
        <UploadContext.Provider value={{ uploads, addUpload, resumeUpload, removeUpload, isStackOpen, setIsStackOpen }}>
            {children}
        </UploadContext.Provider>
    )
}

export const useUpload = () => {
    const context = useContext(UploadContext)
    if (context === undefined) {
        throw new Error("useUpload must be used within an UploadProvider")
    }
    return context
}
