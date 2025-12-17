import React, { useRef, useEffect, useState } from 'react';
import { ColorMode } from '../types';

interface BitDepthSimulatorProps {
  mode: ColorMode;
}

export const BitDepthSimulator: React.FC<BitDepthSimulatorProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  // Constants
  const SDR_STEPS = 256; // 8-bit
  const HDR_STEPS = 1024; // 10-bit (Simulated)
  
  // To make the effect visible on standard monitors, we artificially limit the "SDR" 
  // to a lower count (e.g., 32) when 'zoomed' to simulate the banding effect 
  // that happens when stretching histograms, or we just draw the actual distinct rectangles.
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match container
    const { width } = containerRef.current.getBoundingClientRect();
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Create Gradient
    const isSDR = mode === ColorMode.SDR;
    
    // For demonstration on an 8-bit screen, we must exaggerate the SDR banding
    // effectively visualizing what happens when you stretch contrast.
    // Real 8-bit: 256 steps. Real 10-bit: 1024 steps.
    // If zoom is > 1, we are "stretching" a portion of the luminance range.
    
    const steps = isSDR ? (SDR_STEPS / (zoom * 4)) : HDR_STEPS; 
    
    // Visual Hack: To show banding on this user's likely 8-bit monitor,
    // SDR mode draws distinct rectangles. HDR mode uses the canvas linear gradient
    // which browsers usually dither to look smooth.
    
    if (isSDR) {
      const stepWidth = width / steps;
      for (let i = 0; i < steps; i++) {
        const intensity = Math.floor((i / steps) * 255);
        ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
        // Add a tiny gap to emphasize the discrete nature in educational context? 
        // No, standard banding doesn't have gaps, just hard edges.
        ctx.fillRect(i * stepWidth, 0, stepWidth + 1, height);
      }
    } else {
      // Smooth gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(1, '#ffffff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    // Draw Overlay Text
    ctx.fillStyle = isSDR ? '#fbbf24' : '#38bdf8';
    ctx.font = 'bold 16px Inter';
    ctx.fillText(isSDR ? `8-Bit (Rec.709) - ~${Math.floor(steps)} steps visible` : '10-Bit (HDR) - Smooth Transition', 20, 30);
    
  }, [mode, zoom]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div ref={containerRef} className="relative rounded-lg overflow-hidden border-2 border-gray-700 shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-[200px]" />
        
        {/* Comparison Split Line (optional visual flair) */}
        <div className={`absolute top-0 bottom-0 left-1/2 w-0.5 border-l border-dashed border-white/30 opacity-50 pointer-events-none`}></div>
      </div>
      
      <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
        <div className="text-sm text-gray-400">
          <span className="font-bold text-white">Visual Simulation:</span> 
          {mode === ColorMode.SDR 
            ? " Discrete steps create 'banding' artifacts when gradients are stretched." 
            : " 4x more data points allow for smooth gradients without visible steps."}
        </div>
        
        {mode === ColorMode.SDR && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Exaggerate Banding:</label>
            <input 
              type="range" 
              min="1" 
              max="8" 
              step="0.5"
              value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-32 accent-sdr-accent cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};