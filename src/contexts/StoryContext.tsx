"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { StoryFriend } from "@/apis/story.api"

interface StoryContextData {
    /** Toàn bộ danh sách feed của bạn bè */
    friends: StoryFriend[]
}

interface StoryContextType {
    data: StoryContextData | null
    /** Set list bạn bè trước khi navigate */
    setStoryData: (data: StoryContextData) => void
    /** Lấy data */
    getStoryData: () => StoryContextData | null
}

const StoryContext = createContext<StoryContextType | null>(null)

export function StoryProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<StoryContextData | null>(null)

    const setStoryData = useCallback((newData: StoryContextData) => {
        setData(newData)
    }, [])

    const getStoryData = useCallback(() => {
        return data
    }, [data])

    return (
        <StoryContext.Provider value={{ data, setStoryData, getStoryData }}>
            {children}
        </StoryContext.Provider>
    )
}

export function useStoryContext() {
    const ctx = useContext(StoryContext)
    if (!ctx) return null
    return ctx
}
