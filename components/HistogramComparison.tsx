import React from 'react';
import { motion } from 'framer-motion';

const HistogramComparison: React.FC = () => {
  return (
    <div className="relative w-full aspect-video bg-zinc-900 rounded-3xl border border-white/10 p-8 flex flex-col justify-end overflow-hidden">
      <div className="relative h-full w-full flex items-end">
        {/* SDR Histogram (Compressed) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M 0,100 Q 20,80 40,85 T 80,90 L 100,100 L 0,100"
            fill="rgba(156, 163, 175, 0.2)"
            stroke="rgba(156, 163, 175, 0.5)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
        </svg>

        {/* HDR Histogram (Expanded) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M 0,100 Q 10,95 30,70 T 60,40 T 90,10 L 100,100 L 0,100"
            fill="rgba(59, 130, 246, 0.2)"
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          {/* Highlight Glow */}
          <defs>
            <linearGradient id="hdrGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <rect x="80" y="0" width="20" height="100" fill="url(#hdrGlow)" className="opacity-30" />
        </svg>
      </div>

      <div className="mt-6 flex justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest border-t border-white/10 pt-4 relative">
        <div className="flex flex-col items-start">
          <span>Shadows</span>
          <span className="text-[8px] opacity-50">0-10 nits</span>
        </div>
        <div className="flex flex-col items-center">
          <span>Midtones</span>
          <span className="text-[8px] opacity-50">10-100 nits</span>
        </div>
        {/* SDR Cliff Marker */}
        <div className="absolute top-0 left-[80%] -translate-x-1/2 flex flex-col items-center">
          <div className="w-px h-2 bg-red-500/50" />
          <span className="text-[7px] text-red-500/70 mt-1">SDR CLIFF</span>
        </div>
        <div className="flex flex-col items-end text-blue-400">
          <span>Highlights</span>
          <span className="text-[8px] opacity-50">100-1000+ nits</span>
        </div>
      </div>
    </div>
  );
};

export default HistogramComparison;
