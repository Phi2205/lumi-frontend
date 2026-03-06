"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsPlayerProps {
    src: string;            // URL .m3u8
    autoPlay?: boolean;
    controls?: boolean;
    className?: string;
}

export default function HlsPlayer({
    src,
    autoPlay = false,
    controls = true,
    className = "",
}: HlsPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    console.log("src", src)
    useEffect(() => {
        if (!videoRef.current || !src) return;

        const video = videoRef.current;
        let hls: Hls | null = null;

        // Nếu browser hỗ trợ hls.js
        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });

            hls.loadSource(src);
            hls.attachMedia(video);
        }
        // Safari native HLS
        else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            autoPlay={autoPlay}
            controls={controls}
            className={className}
            style={{ width: "100%" }}
        />
    );
}