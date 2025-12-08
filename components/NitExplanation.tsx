import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  { brightness: 0, sdr: 0, hdr: 0 },
  { brightness: 20, sdr: 10, hdr: 5 },
  { brightness: 40, sdr: 40, hdr: 15 },
  { brightness: 60, sdr: 80, hdr: 30 },
  { brightness: 80, sdr: 20, hdr: 40 }, // SDR peaks and clips
  { brightness: 100, sdr: 0, hdr: 60 },
  { brightness: 120, sdr: 0, hdr: 50 },
  { brightness: 140, sdr: 0, hdr: 20 },
  { brightness: 160, sdr: 0, hdr: 5 },
  { brightness: 180, sdr: 0, hdr: 0 },
];

export const NitExplanation: React.FC = () => {
  return (
    <section className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">SDR vs HDR: <br/><span className="text-cyan-400">See the Difference</span></h2>
          <div className="space-y-6 text-slate-300">
            <p>
              When you export an HDR image at <strong>1600 or 2000 nits</strong>, you give the image "headroom". 
              The very bright parts get extra space at the top so they don't clip white.
            </p>
            
            <div className="bg-slate-950/50 p-6 rounded-xl border-l-4 border-cyan-500">
              <h4 className="font-semibold text-white mb-2">The Histogram Shift</h4>
              <p className="text-sm text-slate-400">
                Reserving space for highlights moves your histogram left. The image might look darker on SDR screens, 
                but on an HDR display, those highlights explode with real light.
              </p>
            </div>

            <ul className="space-y-3">
               <li className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                 <span className="text-sm"><strong>SDR (Standard):</strong> Limited brightness, highlights clip early.</span>
               </li>
               <li className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                 <span className="text-sm"><strong>HDR (High Dynamic Range):</strong> Massive headroom for sun, reflections, and fire.</span>
               </li>
            </ul>
          </div>
        </div>

        <div className="h-[300px] w-full bg-slate-950/50 rounded-xl p-4 border border-slate-800">
          <div className="text-xs text-slate-500 mb-2 font-mono flex justify-between">
            <span>SHADOWS</span>
            <span>HIGHLIGHTS (NITS)</span>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSdr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHdr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ display: 'none' }}
              />
              <Area 
                type="monotone" 
                dataKey="sdr" 
                stroke="#94a3b8" 
                fillOpacity={1} 
                fill="url(#colorSdr)" 
                name="SDR Range"
                animationDuration={2000}
              />
              <Area 
                type="monotone" 
                dataKey="hdr" 
                stroke="#22d3ee" 
                fillOpacity={1} 
                fill="url(#colorHdr)" 
                name="HDR Headroom"
                animationDuration={2000}
                animationBegin={500}
              />
              <ReferenceLine x={4} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'top', value: 'SDR CLIP', fill: '#64748b', fontSize: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};