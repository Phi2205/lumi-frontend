"use client"

import React, { useState, useEffect } from "react"
import { Modal } from "@/lib/components/modal"
import { GlassButton } from "@/lib/components/glass-button"
import { LocationPicker } from "./LocationPicker"
import { User } from "@/types/user.type"
import { Location } from "@/types/location.type"
import { editProfile } from "@/services/user.service"
import { Loader2, User as UserIcon, Calendar, AlignLeft, Save, MapPin, ChevronRight, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { SkeletonSettingsList, SkeletonButton } from "@/components/skeleton"

interface EditProfileModalProps {
    user: User
    isOpen: boolean
    onClose: () => void
    onSuccess: (updatedUser: User) => void
    initialField?: 'bio' | 'birthday' | 'location' | null
}

export function EditProfileModal({ user, isOpen, onClose, onSuccess, initialField = null }: EditProfileModalProps) {
    const [bio, setBio] = useState(user.bio || "")
    const [birthday, setBirthday] = useState(user.birthday?.split('T')[0] || "")
    const [location, setLocation] = useState<Location | null>(null)
    const [editingField, setEditingField] = useState<'bio' | 'birthday' | 'location' | null>(initialField)
    const [initialData, setInitialData] = useState<{
        bio: string;
        birthday: string;
        location: Location | null;
    } | null>(null)
    const [isSavingBio, setIsSavingBio] = useState(false)
    const [isSavingBirthday, setIsSavingBirthday] = useState(false)
    const [isSavingLocation, setIsSavingLocation] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && user) {
            const fetchedBio = user.bio || ""
            let fetchedBirthday = ""
            const dateStr = user.birthday || (user as any).birthdate
            if (dateStr) {
                fetchedBirthday = dateStr.split('T')[0]
            }

            let fetchedLocation: Location | null = null
            if (user.user_location) {
                const loc = user.user_location
                fetchedLocation = {
                    lat: loc.lat?.toString() || "",
                    lng: loc.lng?.toString() || "",
                    place_name: loc.place_name || "",
                    address: loc.address || "",
                    place_id: loc.place_id?.toString() || ""
                }
            } else if (user.location && typeof user.location === 'object') {
                fetchedLocation = user.location as any
            }

            setBio(fetchedBio)
            setBirthday(fetchedBirthday)
            setLocation(fetchedLocation)
            setInitialData({
                bio: fetchedBio,
                birthday: fetchedBirthday,
                location: fetchedLocation
            })
        }
    }, [isOpen, user])

    const handleSaveField = async (field: 'bio' | 'birthday' | 'location') => {
        setError(null)

        let payload: any = {}
        let setSaving: (val: boolean) => void = () => { }

        if (field === 'bio') {
            payload = { bio: bio || null }
            setSaving = setIsSavingBio
        } else if (field === 'birthday') {
            payload = { birthday: birthday || null }
            setSaving = setIsSavingBirthday
        } else if (field === 'location') {
            payload = location || {
                lat: null,
                lng: null,
                place_name: null,
                address: null,
                place_id: null
            }
            setSaving = setIsSavingLocation
        }

        try {
            setSaving(true)
            const updatedUser = await editProfile(payload)
            onSuccess(updatedUser)

            setInitialData(prev => {
                if (!prev) return null
                return {
                    ...prev,
                    [field]: field === 'location' ? (location || null) : (field === 'bio' ? bio : birthday)
                }
            })
            setEditingField(null)
        } catch (err: any) {
            console.error(`Save ${field} failed:`, err)
            setError(err.response?.data?.message || `Failed to update ${field}. Please try again.`)
        } finally {
            setSaving(false)
        }
    }

    const renderFieldRow = (label: string, value: string, icon: React.ReactNode, field: 'bio' | 'birthday' | 'location') => (
        <div
            onClick={() => setEditingField(field)}
            className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-primary/20 rounded-2xl transition-all cursor-pointer"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary group-hover:bg-brand-primary/20 transition-colors">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-medium text-white truncate max-w-[200px]">{value || `Add ${label}`}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="p-1.5 opacity-0 group-hover:opacity-100 bg-brand-primary/20 rounded-md text-brand-primary transition-all">
                    <Pencil size={14} />
                </div>
                <ChevronRight size={18} className="text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
        </div>
    )

    return (
        <>
            <Modal
                isOpen={isOpen && !editingField}
                onClose={onClose}
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary/20 rounded-lg">
                            <UserIcon className="w-5 h-5 text-brand-primary" />
                        </div>
                        <span>Profile Settings</span>
                    </div>
                }
                maxWidthClassName="max-w-md"
            >
                <div className="relative">
                    <div className="space-y-4">
                        <div className="text-xs font-bold text-white/30 uppercase tracking-widest px-1 pb-1">General Information</div>

                        {renderFieldRow("Bio", bio, <AlignLeft size={18} />, 'bio')}
                        {renderFieldRow("Birthday", birthday, <Calendar size={18} />, 'birthday')}
                        {renderFieldRow("Location", location?.address || "", <MapPin size={18} />, 'location')}

                        <div className="pt-6">
                            <GlassButton
                                type="button"
                                onClick={onClose}
                                className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-2"
                            >
                                Done
                            </GlassButton>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Individual Field Modals */}
            <Modal
                isOpen={editingField === 'bio'}
                onClose={() => setEditingField(null)}
                title="Edit Bio"
                maxWidthClassName="max-w-sm"
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70 ml-1">Your Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={5}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all resize-none"
                        />
                    </div>
                    {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                    <GlassButton
                        onClick={() => handleSaveField('bio')}
                        disabled={isSavingBio || bio === (initialData?.bio || "")}
                        className="w-full bg-linear-to-r from-brand-primary to-brand-primary-dark text-white font-bold h-12"
                    >
                        {isSavingBio ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Bio"}
                    </GlassButton>
                </div>
            </Modal>

            <Modal
                isOpen={editingField === 'birthday'}
                onClose={() => setEditingField(null)}
                title="Edit Birthday"
                maxWidthClassName="max-w-sm"
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70 ml-1">Date of Birth</label>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all [color-scheme:dark]"
                        />
                    </div>
                    {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                    <GlassButton
                        onClick={() => handleSaveField('birthday')}
                        disabled={isSavingBirthday || birthday === (initialData?.birthday || "")}
                        className="w-full bg-linear-to-r from-brand-primary to-brand-primary-dark text-white font-bold h-12"
                    >
                        {isSavingBirthday ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Birthday"}
                    </GlassButton>
                </div>
            </Modal>

            <Modal
                isOpen={editingField === 'location'}
                onClose={() => setEditingField(null)}
                title="Edit Location"
                maxWidthClassName="max-w-md"
            >
                <div className="space-y-6">
                    <LocationPicker
                        key={location?.place_id || 'initial'}
                        onLocationSelect={setLocation}
                        initialAddress={location?.address}
                        initialCoords={location ? { lat: parseFloat(location.lat), lng: parseFloat(location.lng) } : undefined}
                    />
                    {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                    <GlassButton
                        onClick={() => handleSaveField('location')}
                        disabled={isSavingLocation || JSON.stringify(location) === JSON.stringify(initialData?.location || null)}
                        className="w-full bg-linear-to-r from-brand-primary to-brand-primary-dark text-white font-bold h-12"
                    >
                        {isSavingLocation ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Location"}
                    </GlassButton>
                </div>
            </Modal>
        </>
    )
}
