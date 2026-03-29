import Hls from "hls.js";

interface PreviewController {
  stop: () => void;
}

export function playHlsPreview(
  videoEl: HTMLVideoElement | null,
  publicId: string,
  previewDuration = 4 // seconds
): PreviewController {
  if (!videoEl) {
    return { stop: () => { } };
  }

  const streamUrl =
    `https://res.cloudinary.com/dibvkarvg/video/upload/sp_auto/${publicId}.m3u8`;

  let hls: Hls | null = null;
  let stopTimer: number | null = null;

  // iOS Safari
  if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
    videoEl.src = streamUrl;
  }
  // Chrome / Desktop
  else if (Hls.isSupported()) {
    hls = new Hls({
      startPosition: 0,
      lowLatencyMode: true,
      maxBufferLength: 5,
    });

    hls.loadSource(streamUrl);
    hls.attachMedia(videoEl);
  }

  videoEl.muted = true;
  videoEl.playsInline = true;
  videoEl.loop = false;

  videoEl.play().catch(() => { });

  // ⏱ auto stop preview
  stopTimer = window.setTimeout(() => {
    stop();
  }, previewDuration * 1000);

  function stop() {
    if (stopTimer) {
      clearTimeout(stopTimer);
      stopTimer = null;
    }

    if (!videoEl) return;

    videoEl.pause();
    videoEl.currentTime = 0;

    if (hls) {
      hls.destroy();
      hls = null;
    }

    videoEl.removeAttribute("src");
    videoEl.load();
  }

  return { stop };
}

export function playHlsVideo(
  videoEl: HTMLVideoElement | null,
  publicId: string
): () => void {
  if (!videoEl) return () => { };

  const streamUrl =
    `https://res.cloudinary.com/dibvkarvg/video/upload/sp_auto/${publicId}.m3u8`;

  let hls: Hls | null = null;

  // iOS Safari (HLS native)
  if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
    videoEl.src = streamUrl;
  }
  // Chrome / Android / Desktop
  else if (Hls.isSupported()) {
    hls = new Hls({
      startPosition: 0,
      lowLatencyMode: true,
    });

    hls.loadSource(streamUrl);
    hls.attachMedia(videoEl);
  } else {
    // Fallback cuối cùng (hiếm)
    videoEl.src =
      `https://res.cloudinary.com/dibvkarvg/video/upload/${publicId}.mp4`;
  }

  // videoEl.muted = true; // Cho phép có tiếng
  videoEl.playsInline = true;

  videoEl
    .play()
    .catch(() => {
      /* ignore autoplay block */
    });

  // cleanup function (rất quan trọng)
  return () => {
    if (hls) {
      hls.destroy();
      hls = null;
    }
    videoEl.pause();
    videoEl.removeAttribute("src");
    videoEl.load();
  };
}