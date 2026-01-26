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
      <>
        {/* Base gradient layer */}
        <div 
          className="fixed inset-0 -z-10 transition-all duration-1000 ease-out"
          style={{ 
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(3, 0, 20, 0.8) 0%, #030014 50%, #020010 100%)'
          }}
        />
        
        {/* Accent gradient overlay */}
        <div 
          className="fixed inset-0 -z-10 opacity-40 transition-opacity duration-1000"
          style={{ 
            background: 'radial-gradient(ellipse 60% 40% at 20% 30%, rgba(182, 196, 162, 0.15) 0%, transparent 70%), radial-gradient(ellipse 50% 30% at 80% 70%, rgba(182, 196, 162, 0.08) 0%, transparent 60%)'
          }}
        />
        
        {/* Depth layer - Subtle vignette */}
        <div 
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{ 
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.3) 100%)'
          }}
        />
        
        {/* Subtle noise texture */}
        <div 
          className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'4\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px'
          }}
        />
      </>
    )
  } else {
    return (
      <>
        {/* Gradient Fallback */}
        <div 
          className="fixed inset-0 -z-10"
          style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
            backgroundColor: '#030014'
          }}
        />

        {/* Blurred Placeholder */}
        {!imageLoaded && !imageError && (
          <div 
            className="fixed inset-0 bg-cover bg-no-repeat bg-center -z-10 transition-opacity duration-500"
            style={{ 
              backgroundImage: `url(${imagePath})`,
              filter: 'blur(20px) brightness(0.3)',
              transform: 'scale(1.1)',
            }}
          />
        )}

        {/* Full Background Image */}
        <div 
          className={`fixed inset-0 bg-cover bg-no-repeat bg-center -z-10 transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${imagePath})`
          }}
        />
      </>
    )
  }
}
