"use client"

import { useDarkMode } from "@/hooks/useDarkMode"
import { useBackgroundImage } from "@/hooks/useBackgroundImage"
import { BackgroundRenderer } from "@/components/BackgroundRenderer"

export function PersistentBackground() {
    const { isDarkMode } = useDarkMode()
    const { imageLoaded, imageError } = useBackgroundImage("/bg12.jpg", isDarkMode)

    return (
        <BackgroundRenderer
            isDarkMode={isDarkMode}
            imageLoaded={imageLoaded}
            imageError={imageError}
        />
    )
}
