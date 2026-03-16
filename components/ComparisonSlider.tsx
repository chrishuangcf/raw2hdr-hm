import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ComparisonSliderProps {
  leftImage: string;
  rightImage: string;
  leftLabel?: string;
  rightLabel?: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ 
  leftImage, 
  rightImage, 
  leftLabel = "SDR", 
  rightLabel = "HDR" 
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-ew-resize border border-white/10 select-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Right Image (HDR) */}
      <div className="absolute inset-0">
        <img 
          src={rightImage} 
          alt="HDR" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/80 backdrop-blur-md rounded-full text-[10px] font-mono text-white uppercase tracking-widest">
          {rightLabel}
        </div>
      </div>

      {/* Left Image (SDR) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img 
          src={leftImage} 
          alt="SDR" 
          className="absolute inset-0 h-full object-cover max-w-none"
          style={{ width: containerWidth }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 px-3 py-1 bg-zinc-900/80 backdrop-blur-md rounded-full text-[10px] font-mono text-white uppercase tracking-widest">
          {leftLabel}
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-0.5 h-3 bg-zinc-400" />
            <div className="w-0.5 h-3 bg-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSlider;
