"use client"

import { useState } from "react"
import { HomeLayout } from "@/components/HomeLayout"
import { GlassCard, GlassInput, GlassButton } from "@/lib/components"
import { Lock, ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"
import { changePassword } from "@/services/auth.service"
import { Notification, NotificationType } from "@/lib/components/notification"
import "@/lib/i18n"

export default function ChangePasswordPage() {
    const { t } = useTranslation()
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Visibility states
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Validation states
    const [error, setError] = useState<string | null>(null)
    const [notification, setNotification] = useState<{
        isOpen: boolean;
        type: NotificationType;
        message: string;
    }>({
        isOpen: false,
        type: 'info',
        message: ''
    })

    const validate = () => {
        if (newPassword.length < 6) {
            setError(t('settings.min_password_length'))
            return false
        }
        if (newPassword !== confirmPassword) {
            setError(t('settings.passwords_not_match'))
            return false
        }
        setError(null)
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        setIsLoading(true)
        try {
            await changePassword({ oldPassword, newPassword })
            setNotification({
                isOpen: true,
                type: 'success',
                message: t('settings.change_password_success')
            })
            // Clear fields
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (err: any) {
            console.error("Change password error:", err)
            setNotification({
                isOpen: true,
                type: 'error',
                message: err?.response?.data?.message || t('settings.change_password_error')
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <HomeLayout>
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{t('settings.change_password')}</h1>
                    <p className="text-white/50 text-sm mt-2">Đảm bảo tài khoản của bạn được bảo mật bằng mật khẩu mạnh.</p>
                </div>

                <GlassCard className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <GlassInput
                                    label={t('settings.current_password')}
                                    type={showOldPassword ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="pl-10 pr-10"
                                />
                                <Lock className="absolute left-3 top-10 h-5 w-5 text-white/40" />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-10 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            <div className="relative">
                                <GlassInput
                                    label={t('settings.new_password')}
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value)
                                        if (error) setError(null)
                                    }}
                                    placeholder="••••••••"
                                    required
                                    className="pl-10 pr-10"
                                />
                                <ShieldCheck className="absolute left-3 top-10 h-5 w-5 text-white/40" />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-10 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            <div className="relative">
                                <GlassInput
                                    label={t('settings.confirm_password')}
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                        if (error) setError(null)
                                    }}
                                    placeholder="••••••••"
                                    required
                                    className="pl-10 pr-10"
                                />
                                <ShieldCheck className="absolute left-3 top-10 h-5 w-5 text-white/40" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-10 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="pt-4">
                            <GlassButton
                                type="submit"
                                variant="primary"
                                className="w-full py-4 text-lg font-semibold shadow-xl shadow-blue-500/20"
                                disabled={isLoading || !oldPassword || !newPassword || !confirmPassword}
                            >
                                {isLoading ? t('settings.updating') : t('settings.change_password')}
                            </GlassButton>
                        </div>
                    </form>
                </GlassCard>

                {/* Password Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                            <p className="text-white text-sm font-medium">Bảo mật hơn</p>
                            <p className="text-white/40 text-xs mt-1">Sử dụng ít nhất 8 ký tự, bao gồm cả chữ và số.</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                            <p className="text-white text-sm font-medium">Duy nhất</p>
                            <p className="text-white/40 text-xs mt-1">Nên sử dụng mật khẩu khác với các trang web khác.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Notification
                isOpen={notification.isOpen}
                onClose={() => setNotification({ ...notification, isOpen: false })}
                type={notification.type}
                message={notification.message}
            />
        </HomeLayout>
    )
}
