"use client"

import React from "react"
import { useUpload } from "@/contexts/UploadContext"
import { UploadCloud, Loader2, XCircle, PlayCircle } from "lucide-react"

export const UploadHeaderIcon: React.FC = () => {
    const { uploads, isStackOpen, setIsStackOpen } = useUpload()

    if (uploads.length === 0) return null

    const activeCount = uploads.filter(u => u.status === "uploading" || u.status === "creating").length
    const hasError = uploads.some(u => u.status === "error")
    const hasInterrupted = uploads.some(u => u.status === "interrupted")

    // Calculate simple average progress for all active uploads
    const activeUploads = uploads.filter(u => u.status === "uploading" || u.status === "creating")
    const avgProgress = activeUploads.length > 0
        ? activeUploads.reduce((sum, u) => sum + u.progress, 0) / activeUploads.length
        : 0

    return (
        <button
            onClick={() => setIsStackOpen(!isStackOpen)}
            className={`relative p-2.5 rounded-full transition-all duration-500 group ${isStackOpen
                ? "bg-brand-primary/10 text-brand-primary"
                : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            title="Upload Progress"
        >
            {/* Light Running Around Effect */}
            {activeCount > 0 && (
                <div className="absolute inset-0">
                    <svg className="w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 40 40">
                        <defs>
                            <linearGradient id="lightBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="transparent" />
                                <stop offset="100%" stopColor="var(--brand-primary)" />
                            </linearGradient>
                        </defs>
                        {/* Static track */}
                        <circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-white/5"
                        />
                        {/* Progress track */}
                        <circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeDasharray={`${2 * Math.PI * 18}`}
                            strokeDashoffset={`${2 * Math.PI * 18 * (1 - avgProgress / 100)}`}
                            className="text-brand-primary/20 transition-all duration-500 -rotate-90 origin-center"
                        />
                        {/* The "Light" streak */}
                        <circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="none"
                            stroke="url(#lightBeam)"
                            strokeWidth="2"
                            strokeDasharray="15 100"
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_3px_var(--brand-primary)]"
                        />
                    </svg>
                </div>
            )}

            <div className="relative z-10 flex items-center justify-center">
                {hasInterrupted ? (
                    <PlayCircle className="w-5 h-5 text-yellow-500 animate-pulse" />
                ) : hasError ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                    <UploadCloud className={`w-5 h-5 transition-transform duration-300 ${activeCount > 0 ? "scale-90" : "group-hover:scale-110"}`} />
                )}
            </div>

            {!isStackOpen && uploads.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-brand-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#121212] shadow-xl z-20">
                    {uploads.length}
                </span>
            )}
        </button>
    )
}
