"use client"

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from "react"

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

interface MapProps {
    center: [number, number]
    markerPosition?: [number, number]
    onClick?: (lat: number, lng: number) => void
    zoom?: number
}

// Component to handle map center updates
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap()
    map.setView(center, zoom)
    return null
}

// Component to handle map click events
function MapEvents({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onClick?.(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

export default function Map({ center, markerPosition, onClick, zoom = 15 }: MapProps) {
    return (
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[280px] w-full relative z-0">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: "100%", width: "100%", background: "#111" }}
                zoomControl={false} // Custom UI
            >
                <ChangeView center={center} zoom={zoom} />

                {/* Dark Mode Tiles from CartoDB */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {markerPosition && <Marker position={markerPosition} />}

                {onClick && <MapEvents onClick={onClick} />}
            </MapContainer>
        </div>
    )
}