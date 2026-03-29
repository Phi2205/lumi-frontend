"use client"

import React, { useState, useEffect } from "react"
import { useUpload } from "@/contexts/UploadContext"
import { CheckCircle2, XCircle, Loader2, X, UploadCloud, ChevronDown, PlayCircle } from "lucide-react"
import { Notification } from "@/lib/components/notification"

export const UploadStack: React.FC = () => {
    const { uploads, removeUpload, isStackOpen, setIsStackOpen, resumeUpload } = useUpload()
    const [showSuccess, setShowSuccess] = useState(false)
    const [lastFinishedId, setLastFinishedId] = useState<string | null>(null)

    // Detect completion to show absolute notification
    useEffect(() => {
        const successfulUpload = uploads.find(u => u.status === "success")
        if (successfulUpload && successfulUpload.id !== lastFinishedId) {
            setShowSuccess(true)
            setLastFinishedId(successfulUpload.id)
        }
    }, [uploads, lastFinishedId])

    if (uploads.length === 0) return null

    const activeCount = uploads.filter(u => u.status === "uploading" || u.status === "creating").length
    const hasError = uploads.some(u => u.status === "error")

    return (
        <>
            {/* Progress Panel */}
            {isStackOpen && (
                <div className="fixed top-20 right-6 z-[999] w-80 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="text-sm font-bold text-white/90">Upload Activity</h3>
                        <button
                            onClick={() => setIsStackOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronDown className="w-4 h-4 text-white/40" />
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                        {uploads.map((upload) => (
                            <div
                                key={upload.id}
                                className="group/item relative"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${upload.status === "success" ? "bg-green-500/10" :
                                        upload.status === "error" || upload.status === "interrupted" ? "bg-red-500/10" :
                                            "bg-brand-primary/10"
                                        }`}>
                                        {upload.status === "uploading" || upload.status === "creating" ? (
                                            <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                                        ) : upload.status === "success" ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : upload.status === "interrupted" ? (
                                            <PlayCircle className="w-5 h-5 text-yellow-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="text-xs font-semibold text-white truncate max-w-[150px]">
                                                {upload.fileName}
                                            </h4>
                                            {upload.status === "interrupted" && (
                                                <button
                                                    onClick={() => resumeUpload(upload.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary text-white text-[10px] font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.4)] animate-pulse"
                                                >
                                                    <PlayCircle className="w-3 h-3" />
                                                    RESUME
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-white/40 mt-0.5">
                                            {upload.status === "uploading" ? "Uploading video..." :
                                                upload.status === "creating" ? "Finalizing reel..." :
                                                    upload.status === "success" ? "Posted successfully!" :
                                                        upload.status === "interrupted" ? "Refresh interrupted" :
                                                            upload.error || "Failed to upload"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeUpload(upload.id)}
                                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors group/close"
                                    >
                                        <X className="w-3.5 h-3.5 text-white/20 group-hover/close:text-red-500" />
                                    </button>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                        <span>Progress</span>
                                        <span className={upload.status === "success" ? "text-green-500" : ""}>
                                            {Math.round(upload.progress)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ease-out ${upload.status === "error" ? "bg-red-500" :
                                                upload.status === "success" ? "bg-green-500" :
                                                    upload.status === "interrupted" ? "bg-yellow-500/50" :
                                                        "bg-brand-primary shadow-[0_0_8px_rgba(var(--brand-primary-rgb),0.5)]"
                                                }`}
                                            style={{ width: `${upload.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Global Success Notification */}
            <Notification
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                type="success"
                title="Upload Complete"
                message="Your reel has been shared successfully!"
                duration={4000}
            />
        </>
    )
}
