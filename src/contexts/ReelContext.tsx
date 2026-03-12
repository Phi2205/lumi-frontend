"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { Reel } from "@/apis/reel.api"

interface ReelContextData {
    /** Danh sách reels đã load */
    reels: Reel[]
    /** Cursor để load trang tiếp */
    cursor?: string
    /** Còn data không */
    hasMore: boolean
    /** userId đang xem (nếu có) */
    userId?: string
}

interface ReelContextType {
    data: ReelContextData | null
    /** Set data trước khi navigate sang /reels */
    setReelData: (data: ReelContextData) => void
    /** Lấy data ra 1 lần rồi xóa (tránh stale data) */
    consumeReelData: () => ReelContextData | null
}

const ReelContext = createContext<ReelContextType | null>(null)

export function ReelProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<ReelContextData | null>(null)

    const setReelData = useCallback((newData: ReelContextData) => {
        setData(newData)
    }, [])

    const consumeReelData = useCallback(() => {
        const current = data
        setData(null)
        return current
    }, [data])

    return (
        <ReelContext.Provider value={{ data, setReelData, consumeReelData }}>
            {children}
        </ReelContext.Provider>
    )
}

export function useReelContext() {
    const ctx = useContext(ReelContext)
    if (!ctx) throw new Error("useReelContext must be used within ReelProvider")
    return ctx
}
