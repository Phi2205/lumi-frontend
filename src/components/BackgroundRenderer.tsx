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
  return (
    <>
      {/* Pure Black Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ 
          background: '#000000'
        }}
      />
      
      {/* Subtle noise texture for depth */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.02] pointer-events-none"
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'4\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px'
        }}
      />
    </>
  )
}
