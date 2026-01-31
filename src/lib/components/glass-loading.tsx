import React from 'react';

interface LoadingProps {
  text?: string
  blur?: number
  refraction?: number
  depth?: number
}

export const Loading = ({ 
  text = "Loading...",
  blur = 20,
  refraction = 0.12,
  depth = 5
}: LoadingProps) => {
  // Clamp values to valid ranges
  const clampedBlur = Math.max(0, Math.min(100, blur))
  const clampedRefraction = Math.max(0, Math.min(1, refraction))
  const clampedDepth = Math.max(0, Math.min(10, depth))
  return (
    <div className="min-h-screen flex items-center justify-center">
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div 
        className="relative w-[280px] p-12 px-8 rounded-3xl"
        style={{
          backdropFilter: `blur(${clampedBlur}px)`,
          WebkitBackdropFilter: `blur(${clampedBlur}px)`,
          backgroundColor: `rgba(255, 255, 255, ${clampedRefraction})`,
          boxShadow: `0 ${Math.ceil(clampedDepth * 3)}px ${Math.ceil(clampedDepth * 6)}px rgba(0, 0, 0, ${0.15 + clampedDepth * 0.05})`,
          animation: 'fadeIn 0.5s ease'
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="loadingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.12)'}} />
              <stop offset="50%" style={{stopColor: 'rgba(255,255,255,0.06)'}} />
              <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.03)'}} />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" rx="24" fill="url(#loadingGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>

        <div className="relative z-1">
          {/* Spinner */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            {/* Outer ring */}
            <div 
              className="absolute inset-0 rounded-full border-[3px] border-white/10 border-t-white/80"
              style={{
                animation: 'spin 1s linear infinite'
              }}
            />
            
            {/* Middle ring */}
            <div 
              className="absolute inset-[10px] rounded-full border-[3px] border-white/10 border-r-white/60"
              style={{
                animation: 'spin 1.5s linear infinite reverse'
              }}
            />

            {/* Inner circle */}
            <div 
              className="absolute inset-6 rounded-full bg-white/15 border border-white/20 flex items-center justify-center"
              style={{
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <svg width={20} height={20} fill="rgba(255,255,255,0.8)" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Loading text */}
          <div className="text-base font-semibold text-white text-center mb-3">
            {text}
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 justify-center mb-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-white/60"
                style={{
                  animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`
                }}
              />
            ))}
          </div>

          {/* Status message */}
          <div className="text-[13px] text-white/70 text-center leading-normal">
            Please wait while we process your request
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-1 bg-white/10 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-white/40 via-white/80 to-white/40 rounded-sm w-full"
              style={{
                animation: 'shimmer 2s ease-in-out infinite'
              }}
            >
              <style>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

