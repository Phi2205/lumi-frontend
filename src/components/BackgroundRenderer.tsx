"use client"

interface BackgroundRendererProps {
  isDarkMode: boolean
  imageLoaded: boolean
  imageError: boolean
  imagePath?: string
}

export function BackgroundRenderer({ 
  isDarkMode, 
  imageLoaded, 
  imageError,
  imagePath = "/bg12.jpg"
}: BackgroundRendererProps) {
  if (isDarkMode) {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none bg-[#020010] transform-gpu">
        {/* Combined Optimized Layer */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: `
              radial-gradient(ellipse 60% 40% at 20% 30%, rgba(182, 196, 162, 0.05) 0%, transparent 70%), 
              radial-gradient(ellipse 50% 30% at 80% 70%, rgba(182, 196, 162, 0.03) 0%, transparent 60%),
              radial-gradient(ellipse 80% 50% at 50% 0%, rgba(3, 0, 20, 0.8) 0%, #030014 50%, transparent 100%),
              radial-gradient(ellipse 100% 100% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.3) 100%)
            `,
          }}
        />
        
        {/* Very subtle static noise - Using a simpler CSS pattern instead of a heavy SVG filter */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>
    )
  } else {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        {/* Gradient Fallback */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
            backgroundColor: '#030014',
            willChange: 'transform'
          }}
        />

        {/* Blurred Placeholder */}
        {!imageLoaded && !imageError && (
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat bg-center transition-opacity duration-500"
            style={{ 
              backgroundImage: `url(${imagePath})`,
              filter: 'blur(20px) brightness(0.3)',
              transform: 'scale(1.1)',
              willChange: 'opacity, transform'
            }}
          />
        )}

        {/* Full Background Image - Optimized with static blur for performance */}
        <div 
          className={`absolute inset-0 bg-cover bg-no-repeat bg-center transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${imagePath})`,
            // filter: 'blur(8px) brightness(1.1)', // Static blur reduces GPU load for glass on top
            // transform: 'scale(1.08)', // Compensate for edge blur
            willChange: 'opacity'
          }}
        />
      </div>
    )
  }
}
