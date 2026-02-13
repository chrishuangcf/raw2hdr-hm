import React, { useState, useRef } from 'react';

export const HeroSection: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 text-center z-10 relative">
        <div className="inline-block px-4 py-1.5 mb-6 border border-cyan-500/30 rounded-full bg-cyan-950/30 backdrop-blur-sm">
          <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Beta Available Now</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Turn RAW Photos Into <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Stunning HDR Magic</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Unlock the hidden potential of your RAW files. Create 10-bit HEIC images with up to 2000 nits of dynamic range for iPhone and XDR displays.
        </p>

        {/* Interactive Comparison Slider */}
        <div className="max-w-5xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl shadow-cyan-900/20 border border-slate-800 group select-none">
          <div 
            ref={containerRef}
            className="relative h-[400px] md:h-[600px] w-full cursor-col-resize"
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
          >
             {/* "Before" SDR Image - Simulated with filters for visual effect */}
            <div className="absolute inset-0 w-full h-full bg-slate-900">
               <img 
                src="https://picsum.photos/id/10/1920/1200" 
                alt="SDR Flat" 
                className="w-full h-full object-cover filter grayscale-[30%] contrast-[0.8] brightness-[0.7]"
              />
              <div className="absolute top-6 left-6 bg-black/50 backdrop-blur px-3 py-1 rounded text-sm font-semibold text-white/70">
                Linear RAW (SDR)
              </div>
            </div>

            {/* "After" HDR Image - Clipped */}
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img 
                src="https://picsum.photos/id/10/1920/1200" 
                alt="HDR Vivid" 
                className="w-full h-full object-cover filter contrast-[1.1] saturate-[1.2] brightness-[1.1]"
              />
               <div className="absolute top-6 left-6 bg-cyan-600/80 backdrop-blur px-3 py-1 rounded text-sm font-bold text-white shadow-lg shadow-cyan-500/20">
                HDR Magic (2000 nits)
              </div>
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-[0_0_20px_rgba(255,255,255,0.5)] z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform">
                <svg className="w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Drag to compare
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};