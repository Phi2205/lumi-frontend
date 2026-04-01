"use client"

import { GlassButton } from "@/lib/components/glass-button"
import { GlassCard } from "@/lib/components/glass-card"
import { X, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    isDarkMode?: boolean
    isLoading?: boolean
    danger?: boolean
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    cancelText,
    isDarkMode = true,
    isLoading = false,
    danger = true
}: ConfirmModalProps) => {
    const { t } = useTranslation()

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md"
                    >
                        <GlassCard
                            className={`p-6 border-white/20 relative overflow-hidden`}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 opacity-60" />
                            </button>

                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className={`p-4 rounded-full ${danger ? 'bg-red-500/20 text-red-400' : 'bg-brand-primary/20 text-brand-primary'} animate-bounce-subtle`}>
                                    <AlertTriangle className="w-8 h-8" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold">{title}</h2>
                                    <p className="text-sm opacity-60 px-4 leading-relaxed line-clamp-3">
                                        {description}
                                    </p>
                                </div>

                                <div className="flex gap-3 w-full pt-4">
                                    <GlassButton
                                        variant="ghost"
                                        className="flex-1 h-11"
                                        onClick={onClose}
                                        disabled={isLoading}
                                    >
                                        {cancelText || t('common.cancel', { defaultValue: 'Hủy' })}
                                    </GlassButton>
                                    <GlassButton
                                        blur={20}
                                        refraction={0.1}
                                        depth={3}
                                        className={`flex-1 h-11 ${danger ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : ''}`}
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            confirmText || t('common.confirm', { defaultValue: 'Xác nhận' })
                                        )}
                                    </GlassButton>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
