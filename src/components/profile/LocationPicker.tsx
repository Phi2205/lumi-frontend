"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { Search, Loader2, Navigation, MapPin, X } from "lucide-react"
import { Location } from "@/types/location.type"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

// Import leaflet component dynamically to avoid SSR issues
const Map = dynamic(() => import("@/components/map"), {
    ssr: false,
    loading: () => <div className="h-[280px] w-full bg-white/5 animate-pulse flex items-center justify-center rounded-2xl border border-white/10">Loading map...</div>
})

interface NominatimResult {
    place_id: number
    licence: string
    osm_type: string
    osm_id: number
    boundingbox: string[]
    lat: string
    lon: string
    display_name: string
    class: string
    type: string
    importance: number
    icon?: string
    address: Record<string, string>
}

interface LocationPickerProps {
    onLocationSelect: (location: Location) => void
    initialAddress?: string
    initialCoords?: { lat: number; lng: number }
}

export function LocationPicker({
    onLocationSelect,
    initialAddress,
    initialCoords = { lat: 21.0285, lng: 105.8520 } // default Hanoi
}: LocationPickerProps) {
    const [query, setQuery] = useState(initialAddress || "")
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [center, setCenter] = useState<[number, number]>([initialCoords.lat, initialCoords.lng])
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(initialAddress ? [initialCoords.lat, initialCoords.lng] : null)
    const [showMap, setShowMap] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Handle clicks outside the dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Search for places using Nominatim (OpenStreetMap)
    const searchPlaces = async (text: string) => {
        if (text.length < 3) {
            setSuggestions([])
            return
        }

        setIsSearching(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&addressdetails=1&limit=5`
            )
            const data = await response.json()
            setSuggestions(data)
            setShowSuggestions(true)
        } catch (error) {
            console.error("Search failed:", error)
        } finally {
            setIsSearching(false)
        }
    }

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query && query !== initialAddress) {
                searchPlaces(query)
            }
        }, 800)
        return () => clearTimeout(timer)
    }, [query])

    const handleSelectSuggestion = (result: NominatimResult) => {
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        const coords: [number, number] = [lat, lng]

        const location: Location = {
            lat: result.lat,
            lng: result.lon,
            place_name: result.display_name.split(",")[0],
            address: result.display_name,
            place_id: result.place_id.toString()
        }

        setQuery(location.address)
        setCenter(coords)
        setMarkerPosition(coords)
        setShowSuggestions(false)
        onLocationSelect(location)
    }

    const handleMapClick = useCallback((lat: number, lng: number) => {
        const coords: [number, number] = [lat, lng]
        setMarkerPosition(coords)
        setCenter(coords)

        // Reverse geocode to get address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`)
            .then(res => res.json())
            .then((res: NominatimResult) => {
                const location: Location = {
                    lat: lat.toString(),
                    lng: lng.toString(),
                    place_name: res.display_name.split(",")[0] || "Pinned Location",
                    address: res.display_name,
                    place_id: res.place_id.toString()
                }
                setQuery(location.address)
                onLocationSelect(location)
            })
            .catch(err => console.error("Reverse geocode failed:", err))
    }, [onLocationSelect])

    return (
        <div className="space-y-4">
            <div className="space-y-2 relative" ref={dropdownRef}>
                <div className="flex items-center justify-between px-1">
                    <label className="text-sm font-medium text-white/70">Location</label>
                    <button
                        type="button"
                        onClick={() => setShowMap(!showMap)}
                        className="text-[11px] font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors flex items-center gap-1 uppercase tracking-wider"
                    >
                        <Navigation size={10} />
                        {showMap ? "Hide Map" : "Pin on Map"}
                    </button>
                </div>

                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-brand-primary transition-colors z-10">
                        {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a city, street, or venue..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all font-medium text-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 3 && setShowSuggestions(true)}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => { setQuery(""); setSuggestions([]); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                        {suggestions.map((result) => (
                            <button
                                key={result.place_id}
                                type="button"
                                className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-start gap-3 transition-colors group"
                                onClick={() => handleSelectSuggestion(result)}
                            >
                                <MapPin size={16} className="text-white/40 group-hover:text-brand-primary mt-0.5 shrink-0" />
                                <div className="space-y-0.5">
                                    <p className="text-[13px] font-medium text-white leading-tight">
                                        {result.display_name.split(",")[0]}
                                    </p>
                                    <p className="text-[11px] text-white/40 truncate w-[300px]">
                                        {result.display_name.split(",").slice(1).join(",").trim()}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {showMap && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    <Map
                        center={center}
                        markerPosition={markerPosition || undefined}
                        onClick={handleMapClick}
                    />
                    <p className="text-[10px] text-white/30 mt-3 px-1 text-center italic tracking-wide">
                        Tip: Click anywhere to adjust your exact location
                    </p>
                </div>
            )}
        </div>
    )
}
