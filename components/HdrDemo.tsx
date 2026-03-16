import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import { ComparisonMode } from '../types';

const HdrDemo: React.FC = () => {
  const [mode, setMode] = useState<ComparisonMode>(ComparisonMode.SDR);

  // Generate mock histogram data
  const data = useMemo(() => {
    const points = [];
    const pointsCount = 60;
    
    for (let i = 0; i < pointsCount; i++) {
      const x = i;
      let sdrValue = 0;
      let hdrValue = 0;

      // Bell curve base
      const center = 20;
      const width = 10;
      const baseSignal = 100 * Math.exp(-Math.pow(x - center, 2) / (2 * Math.pow(width, 2)));

      // SDR Logic: Compress high values, clip at "White" (approx index 40)
      if (i > 35) {
        // Hard clip simulation for SDR
        sdrValue = Math.max(0, baseSignal * (1 - (i - 35) / 5)); 
        if (i >= 40) sdrValue = 0; // Pure clipping
        // Spike at clip point
        if (i === 39) sdrValue = 80; 
      } else {
        sdrValue = baseSignal;
      }

      // HDR Logic: Extend range naturally
      // Simulate "Headroom" with a second smaller hump in highlights or just smooth extension
      const highlightDetail = 40 * Math.exp(-Math.pow(x - 45, 2) / (2 * Math.pow(8, 2)));
      hdrValue = baseSignal + highlightDetail;

      // Add "Shadow" detail in HDR not present in SDR
      if (i < 10) {
          hdrValue += 20 * Math.exp(-Math.pow(x - 5, 2) / 10);
          sdrValue = Math.max(0, sdrValue - 10); // Crushed shadows
      }

      points.push({
        bin: i,
        sdr: sdrValue,
        hdr: hdrValue,
      });
    }
    return points;
  }, []);

  const isHdr = mode === ComparisonMode.HDR;

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 md:p-8 my-12 shadow-2xl relative z-10">

      <div className="flex justify-center space-x-4 mb-8 relative z-50">
        <button
          type="button"
          onClick={() => setMode(ComparisonMode.SDR)}
          className={`px-6 py-2 rounded-full font-semibold transition-all cursor-pointer ${
            !isHdr 
              ? 'bg-gray-700 text-white ring-2 ring-gray-500 shadow-lg' 
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Standard (SDR)
        </button>
        <button
          type="button"
          onClick={() => setMode(ComparisonMode.HDR)}
          className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            isHdr 
              ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          10-bit HDR
        </button>
      </div>

      <div className="h-64 md:h-80 w-full relative z-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSdr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHdr" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.8}/> {/* Shadow */}
                <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.8}/> {/* Midtone */}
                <stop offset="100%" stopColor="#fef08a" stopOpacity={0.9}/> {/* Highlight glow */}
              </linearGradient>
            </defs>
            <XAxis dataKey="bin" hide />
            <YAxis hide domain={[0, 150]} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                itemStyle={{ color: '#e5e7eb' }}
                labelStyle={{ display: 'none' }}
                formatter={(value: number) => [Math.round(value), 'Luminance Data']}
            />
            
            <Area
              type="monotone"
              dataKey={isHdr ? "hdr" : "sdr"}
              stroke={isHdr ? "#60a5fa" : "#9ca3af"}
              fillOpacity={1}
              fill={isHdr ? "url(#colorHdr)" : "url(#colorSdr)"}
              animationDuration={1000}
            />

            {/* Reference Line for SDR White Point */}
            <ReferenceLine x={40} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'SDR White Limit', fill: '#ef4444', fontSize: 12 }} />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Annotation Overlay */}
        <div className="absolute top-4 right-10 text-right pointer-events-none">
          {isHdr ? (
             <div className="text-yellow-200 animate-pulse">
               <p className="font-bold">Extended Dynamic Range</p>
               <p className="text-xs opacity-80">Data beyond standard white point</p>
             </div>
          ) : (
             <div className="text-gray-400">
               <p className="font-bold">Clipped Highlights</p>
               <p className="text-xs opacity-80">Detail lost at white limit</p>
             </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-center relative z-20">
        <div className={`p-4 rounded-lg border transition-all duration-500 ${!isHdr ? 'border-gray-600 bg-gray-800' : 'border-gray-800 opacity-50'}`}>
          <div className="font-bold text-lg mb-1">8-bit SDR</div>
          <div className="text-gray-400">16 Million Colors</div>
          <div className="text-red-400 text-xs mt-2">Clipped Highlights</div>
        </div>
        <div className={`p-4 rounded-lg border transition-all duration-500 ${isHdr ? 'border-blue-500 bg-blue-900/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-gray-800 opacity-50'}`}>
          <div className="font-bold text-lg mb-1 text-blue-400">10-bit HDR</div>
          <div className="text-gray-300">1 Billion+ Colors</div>
          <div className="text-yellow-400 text-xs mt-2">Glowing Highlights</div>
        </div>
      </div>
    </div>
  );
};

export default HdrDemo;