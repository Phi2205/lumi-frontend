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
import { SearchPanel } from "@/components/SearchPanel"

function ProfilePageContent() {
    const [activeTab, setActiveTab] = useState("home")
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const { isDarkMode, handleDarkModeToggle } = useDarkMode()
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

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
            <Header
                isDarkMode={isDarkMode}
                onDarkModeToggle={handleDarkModeToggle}
                onSearchToggle={toggleSearch}
            />
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isSearchOpen={isSearchOpen}
                onSearchToggle={toggleSearch}
            />

            <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <main className={cn(
                "pt-20 pb-20 md:pb-4 relative z-10 lg:mr-80 transition-all duration-300",
                isSearchOpen ? "md:ml-20" : "md:ml-64"
            )}>
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

import { Suspense } from "react"

export default function MyProfilePage() {
    return (
        <Suspense fallback={null}>
            <ProfilePageContent />
        </Suspense>
    )
}

