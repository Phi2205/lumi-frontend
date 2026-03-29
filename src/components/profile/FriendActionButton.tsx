"use client"

import React, { useState, useRef, useEffect } from "react"
import { GlassButton } from "@/lib/components"
import { UserMinus, UserCheck, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FriendActionButtonProps {
    status: string | undefined
    name: string
    onUnfriend: () => void
    onAddFriend: () => void
    onCancelRequest: () => void
    onAcceptRequest: () => void
    isLoading: boolean
    className?: string
}

export function FriendActionButton({
    status,
    name,
    onUnfriend,
    onAddFriend,
    onCancelRequest,
    onAcceptRequest,
    isLoading,
    className
}: FriendActionButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (status === 'none' || status === 'rejected' || !status) {
        return (
            <GlassButton
                onClick={onAddFriend}
                disabled={isLoading}
                className={cn("bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap", className)}
            >
                {isLoading ? 'Processing...' : 'Add Friend'}
            </GlassButton>
        )
    }

    if (status === 'pending') {
        return (
            <GlassButton
                onClick={onCancelRequest}
                disabled={isLoading}
                className={cn("bg-white/10 hover:bg-white/20 whitespace-nowrap", className)}
            >
                {isLoading ? 'Processing...' : 'Request Sent'}
            </GlassButton>
        )
    }

    if (status === 'received_pending') {
        return (
            <div className="flex gap-2">
                <GlassButton
                    onClick={onAcceptRequest}
                    disabled={isLoading}
                    className={cn("bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap", className)}
                >
                    {isLoading ? 'Processing...' : 'Accept'}
                </GlassButton>
            </div>
        )
    }

    // Friend or Accepted status
    return (
        <div className={cn("relative", isOpen && "z-50")} ref={dropdownRef}>
            <GlassButton
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className={cn(
                    "bg-white/10 hover:bg-white/20 whitespace-nowrap flex items-center gap-2 pr-3",
                    isOpen && "bg-white/20",
                    className
                )}
            >
                <UserCheck className="w-4 h-4" />
                <span>Friends</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
            </GlassButton>

            {isOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-52 bg-black/80 border border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-200 ring-1 ring-white/5">
                    <div className="p-1">
                        <GlassButton
                            onClick={() => {
                                setIsOpen(false)
                                onUnfriend()
                            }}
                            className="w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/15 rounded-xl border-none transition-all group"
                        >
                            <UserMinus className="w-4 h-4 transition-transform group-hover:scale-110" />
                            <span className="font-medium text-red-500">Unfriend {name}</span>
                        </GlassButton>
                    </div>
                </div>
            )}
        </div>
    )
}
