"use client"

import { HomeLayout } from "@/components/HomeLayout"
import { useDarkMode } from "@/hooks/useDarkMode"
import { SwitchMode } from "@/components/SwitchMode"
import { GlassCard, GlassSelect } from "@/lib/components"
import { Moon, Sun, Languages, Lock } from "lucide-react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n" // Ensure i18n is initialized

export default function SettingsPage() {
    const { isDarkMode, handleDarkModeToggle } = useDarkMode()
    const { t, i18n } = useTranslation()

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
        localStorage.setItem('language', lng)
    }

    return (
        <HomeLayout>
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{t('settings.title')}</h1>
                </div>

                {/* Appearance Section */}
                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">{t('settings.appearance')}</h2>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-blue-500/20' : 'bg-yellow-500/10'}`}>
                                {isDarkMode ? (
                                    <Moon className="w-6 h-6 text-blue-400" />
                                ) : (
                                    <Sun className="w-6 h-6 text-yellow-400" />
                                )}
                            </div>
                            <div>
                                <p className="text-white font-medium">{t('settings.dark_mode')}</p>
                                <p className="text-white/40 text-[11px] sm:text-xs">{t('settings.dark_mode_desc')}</p>
                            </div>
                        </div>
                        <SwitchMode isDarkMode={isDarkMode} onToggle={handleDarkModeToggle} />
                    </div>
                </GlassCard>

                {/* Language Section */}
                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">{t('settings.language')}</h2>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/10">
                                <Languages className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">{t('settings.app_language')}</p>
                                <p className="text-white/40 text-[11px] sm:text-xs">{t('settings.choose_language')}</p>
                            </div>
                        </div>

                        <GlassSelect
                            value={i18n.language}
                            onChange={(code: string) => changeLanguage(code)}
                            options={[
                                { value: "en", label: "English (EN)" },
                                { value: "vi", label: "Tiếng Việt (VI)" }
                            ]}
                        />
                    </div>
                </GlassCard>

                {/* Security Section */}
                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Bảo mật</h2>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => window.location.href = '/settings/change-password'}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-500/10">
                                <Lock className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">{t('settings.change_password')}</p>
                                <p className="text-white/40 text-[11px] sm:text-xs">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </HomeLayout>
    )
}

