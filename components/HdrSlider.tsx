import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

const HdrSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const onMouseUp = () => setIsDragging(false);
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchend', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
    }

    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isDragging, handleMove]);

  const handleInteractionStart = (clientX: number) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-16 px-4">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
          Experience the HDR Difference
        </h3>
        <p className="text-gray-400">
          Drag the slider to reveal the hidden details and luminance.
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl border border-gray-800 group touch-none bg-black"
        onMouseDown={(e) => handleInteractionStart(e.clientX)}
        onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
      >
        {/* SDR Image (Background) - Simulated as flatter/dimmer via opacity and contrast */}
        <img 
            src="https://picsum.photos/id/10/1920/1200" 
            alt="Standard SDR"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ 
                filter: 'contrast(0.7) brightness(0.8)',
                opacity: 0.6 // Significant transparency to darken against black bg
            }}
        />
        
        {/* Label for SDR */}
         <div className="absolute top-6 right-6 bg-black/60 backdrop-blur text-white/80 text-xs font-bold px-3 py-1 rounded-full z-10 uppercase tracking-wider pointer-events-none">
            Standard (SDR)
         </div>

        {/* HDR Image (Overlay) - Simulated as bright/vivid */}
        {/* We use a div wrapper with clipping for the image to ensure correct positioning */}
        <div 
            className="absolute inset-0 w-full h-full"
            style={{ 
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
            }}
        >
            <img 
                src="https://picsum.photos/id/10/1920/1200" 
                alt="10-bit HDR"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ 
                    filter: 'contrast(1.1) saturate(1.15) brightness(1.1)' 
                }}
            />
            
            {/* Synthetic Bloom/Glow for HDR feel - Clipped with the image */}
            <div className="absolute inset-0 mix-blend-screen pointer-events-none opacity-40">
                {/* General subtle atmospheric glow */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-blue-900/10 to-white/10"></div>
            </div>

             {/* Label for HDR - Positioned on the left side (visible when slider is to the right) */}
            <div className="absolute top-6 left-6 bg-blue-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-[0_0_15px_rgba(37,99,235,0.6)] uppercase tracking-wider pointer-events-none">
                10-bit HDR
            </div>
        </div>

        {/* Slider Handle Line */}
        <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            style={{ left: `${sliderPosition}%` }}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600 transition-transform transform hover:scale-110 active:scale-95">
                <ChevronsLeftRight size={20} strokeWidth={2.5} />
            </div>
        </div>

      </div>
      
      <div className="mt-4 flex justify-between text-sm text-gray-500 font-mono px-2 uppercase tracking-wide">
         <span className={`transition-colors duration-300 ${sliderPosition > 10 ? 'text-blue-400' : ''}`}>High Dynamic Range</span>
         <span className={`transition-colors duration-300 ${sliderPosition < 90 ? 'text-gray-400' : ''}`}>Standard Range</span>
      </div>
    </div>
  );
};

export default HdrSlider;