import React from 'react';
import { motion } from 'framer-motion';

const BitDepthVisualizer: React.FC<{ bits: 8 | 10 }> = ({ bits }) => {
  const steps = bits === 8 ? 256 : 1024;
  const displaySteps = 80;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
        <span className={bits === 8 ? 'text-gray-500' : 'text-blue-400'}>{bits}-Bit Precision</span>
        <span className="text-gray-600">{steps} Total Steps</span>
      </div>
      
      <div className="h-24 w-full bg-black/40 rounded-xl border border-white/5 flex items-end p-3 gap-[1px] overflow-hidden relative">
        {/* Grid lines for reference */}
        <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-10">
          <div className="w-full h-px bg-white" />
          <div className="w-full h-px bg-white" />
          <div className="w-full h-px bg-white" />
        </div>

        {Array.from({ length: displaySteps }).map((_, i) => {
          // For 8-bit, we "step" the values every 4 bars to show lower resolution
          const value = bits === 8 ? Math.floor(i / 5) * 5 : i;
          const heightPercent = (value / displaySteps) * 100;
          
          return (
            <motion.div
              key={i}
              className="flex-1"
              initial={{ height: 0 }}
              whileInView={{ height: `${heightPercent}%` }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20,
                delay: i * 0.005 
              }}
              style={{ 
                backgroundColor: bits === 8 ? '#4b5563' : '#3b82f6',
                opacity: 0.3 + (heightPercent / 100) * 0.7
              }}
            />
          );
        })}
      </div>
      
      <div className="flex justify-between text-[8px] font-mono text-gray-600 uppercase">
        <span>{bits === 8 ? 'Coarse Gradients' : 'Fine Gradients'}</span>
        <span>{bits === 8 ? 'Visible Banding' : 'Seamless Transition'}</span>
      </div>
    </div>
  );
};

export default BitDepthVisualizer;
