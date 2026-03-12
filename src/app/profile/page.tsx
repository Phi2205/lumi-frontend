"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { cn } from "@/lib/utils"
import { getMe } from "@/services/auth.service"
import { User } from "@/types/user.type"
import { ProfileContent } from "@/components/profile/ProfileContent"
import { useDarkMode } from "@/hooks/useDarkMode"
import { useBackgroundImage } from "@/hooks/useBackgroundImage"
import { BackgroundRenderer } from "@/components/BackgroundRenderer"

export default function MyProfilePage() {
    const [activeTab, setActiveTab] = useState("home")
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const { isDarkMode, handleDarkModeToggle } = useDarkMode()
    const { imageLoaded, imageError } = useBackgroundImage("/bg12.jpg", isDarkMode)

    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                setIsInitialLoading(true);
                const response = await getMe();
                setUserProfile(response.data);
            } catch (error) {
                console.error("Fetch profile failed:", error);
            } finally {
                setIsInitialLoading(false);
            }
        }
        fetchMyProfile()
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden">
            <BackgroundRenderer
                isDarkMode={isDarkMode}
                imageLoaded={imageLoaded}
                imageError={imageError}
            />

            <Header isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="md:ml-64 lg:mr-80 pt-20 pb-20 md:pb-4 relative z-10">
                <ProfileContent
                    userProfile={userProfile}
                    isInitialLoading={isInitialLoading}
                    isOwnProfile={true}
                    onProfileUpdate={(updated) => setUserProfile(updated)}
                />
            </main>
            <RightSidebar />
        </div>
    )
}
