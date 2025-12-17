import React, { useState } from 'react';
import { ColorMode } from './types';
import { BitDepthSimulator } from './components/BitDepthSimulator';
import { HistogramChart } from './components/HistogramChart';
import { TransferCurve } from './components/TransferCurve';
import { InfoCard } from './components/InfoCard';
import { SECTIONS } from './constants';
import { Monitor, Sun, BarChart2, MousePointerClick } from 'lucide-react';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ColorMode>(ColorMode.SDR);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30">
      
      {/* Header / Hero */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="text-sky-400" size={24} />
            <h1 className="text-xl font-bold tracking-tight">HDR<span className="text-slate-500">vs</span>SDR <span className="text-xs font-normal text-slate-400 px-2 border-l border-slate-700">Histogram Perspective</span></h1>
          </div>
          
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveMode(ColorMode.SDR)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeMode === ColorMode.SDR 
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SDR (8-Bit)
            </button>
            <button
              onClick={() => setActiveMode(ColorMode.HDR)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeMode === ColorMode.HDR 
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HDR (10-Bit)
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">

        {/* SECTION 1: INTRODUCTION */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400 mb-6">
              Why 2 Bits Matter
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Standard Dynamic Range (SDR) images, like standard JPEGs, use an <strong>8-bit</strong> system. 
              High Dynamic Range (HDR), particularly in HEIC formats, utilizes a <strong>10-bit</strong> system.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              While "2 bits" sounds small, it's exponential. 
              8-bit offers <span className="text-amber-400 font-bold">256</span> shades per color. 
              10-bit offers <span className="text-sky-400 font-bold">1,024</span> shades per color.
              This difference defines the "headroom" available for light and color.
            </p>
          </div>
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
             <div className="flex gap-8 items-end h-40 mb-4">
                <div className="w-20 bg-amber-500/20 border border-amber-500 h-[25%] relative group">
                  <span className="absolute -top-8 left-0 right-0 text-amber-500 font-bold">2⁸</span>
                  <span className="absolute bottom-2 left-0 right-0 text-xs text-amber-300">256 Levels</span>
                </div>
                <div className="w-20 bg-sky-500/20 border border-sky-500 h-full relative group shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                  <span className="absolute -top-8 left-0 right-0 text-sky-400 font-bold">2¹⁰</span>
                  <span className="absolute bottom-2 left-0 right-0 text-xs text-sky-300">1024 Levels</span>
                </div>
             </div>
             <p className="text-sm text-slate-400">Exponential increase in color data</p>
          </div>
        </section>

        {/* SECTION 2: BIT DEPTH & BANDING */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Sun className="text-sky-400" />
            <h2 className="text-2xl font-bold">The Gradient Test: Banding vs. Smoothness</h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <BitDepthSimulator mode={activeMode} />
            </div>
            <div className="space-y-4">
              <InfoCard title="What is Color Banding?">
                <p>
                  In 8-bit SDR (Rec.709), you only have 256 steps to go from black to white.
                  When displaying a smooth sky or a dark shadow, these steps become visible as "bands".
                </p>
                <p className="mt-2">
                  10-bit HDR provides 4x the steps (1024). This fills the gaps, creating a 
                  butter-smooth transition impossible in standard 8-bit formats.
                </p>
              </InfoCard>
              
              <div className="p-4 bg-sky-900/20 border border-sky-800 rounded-lg flex gap-3 items-start">
                <MousePointerClick className="text-sky-400 shrink-0 mt-1" size={20} />
                <p className="text-sm text-sky-200">
                  Toggle the switch in the top right to see how the gradient quality changes between SDR and HDR modes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE HISTOGRAM */}
        <section className="space-y-8">
           <div className="flex items-center gap-3">
            <BarChart2 className="text-sky-400" />
            <h2 className="text-2xl font-bold">The Histogram Perspective</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <HistogramChart mode={activeMode} />
            </div>
            <InfoCard title="Reading the Data">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-amber-400">SDR Histogram:</strong> Looks "comb-like" or blocky. The data is quantized into coarse bins. Stretching contrast destroys detail rapidly.
                </li>
                <li>
                  <strong className="text-sky-400">HDR Histogram:</strong> A continuous, high-resolution curve. The "Headroom" allows data to exist far beyond the standard white point (Rec.709 clamp).
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-400 italic">
                Notice how the HDR histogram feels "analog" compared to the digital steps of the SDR one.
              </p>
            </InfoCard>
          </div>
        </section>

        {/* SECTION 4: TRANSFER FUNCTIONS */}
        <section className="space-y-8 pb-20">
          <div className="flex items-center gap-3">
             <div className="bg-sky-500/20 p-2 rounded-lg">
               <h2 className="text-2xl font-bold text-sky-100">PQ vs. Gamma</h2>
             </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <TransferCurve />
            <div className="space-y-6">
              <InfoCard title="Why Rec.709 doesn't work for HDR">
                <p>
                  Standard video uses a <strong>Gamma Curve</strong> (Rec.709). It's a relative curve. 
                  "100% white" is just the maximum brightness of your screen (whether it's 100 nits or 300 nits).
                </p>
                <p>
                  HDR uses the <strong>PQ (Perceptual Quantizer)</strong> curve. It is <em>absolute</em>.
                  A signal value corresponds to a specific brightness level in Nits (cd/m²).
                </p>
              </InfoCard>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-amber-400 font-bold mb-2">SDR (Rec.709)</h4>
                    <p className="text-xs text-slate-400">Limited range. Highlights clip immediately at the "100%" mark, losing detail in bright skies or reflections.</p>
                 </div>
                 <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-sky-400 font-bold mb-2">HDR (PQ)</h4>
                    <p className="text-xs text-slate-400">Massive headroom. The curve extends way beyond 100 nits, allowing realistic specular highlights (sun glints, fire) without clipping.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default App;