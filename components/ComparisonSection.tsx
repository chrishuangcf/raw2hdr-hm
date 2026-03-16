import React from 'react';
import { GitBranch } from 'lucide-react';

const ComparisonSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono uppercase tracking-widest">
            <GitBranch className="w-3 h-3" /> 08. The Pipeline
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Traditional vs. raw2hdr Pipeline</h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            Most "HDR" apps destroy sensor data before you ever edit it. raw2hdr processes directly from RAW using Apple's native engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Traditional Way */}
          <div className="relative group">
            <div className="absolute inset-0 bg-red-900/10 rounded-3xl blur-xl group-hover:bg-red-900/20 transition-all" />
            <div className="relative p-8 rounded-3xl border border-gray-800 bg-gray-900/80 backdrop-blur">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-xs font-bold uppercase tracking-wide">The Old Way</span>
                <h3 className="text-2xl font-bold text-gray-200">In-Camera / Desktop</h3>
              </div>

              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-mono text-gray-400">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-300">Capture 3+ Bracketed RAWs</h4>
                    <p className="text-sm text-gray-500">Requires a tripod. Even 1/1000s between frames causes ghosting on any moving subject.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center text-sm font-mono text-red-400">2</div>
                  <div>
                    <h4 className="font-semibold text-red-300">Tone-map and export to JPEG</h4>
                    <p className="text-sm text-gray-500">In-camera HDR mode still outputs 8-bit JPEG. 94% of colour precision is discarded. Highlights look flat — not glowing.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-mono text-gray-400">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-300">Result: SDR in disguise</h4>
                    <p className="text-sm text-gray-500">The output is still an SDR file — sRGB colour, 8-bit depth. Highlights clipped, shadows crushed. No HDR display benefit.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* raw2hdr Way */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-900/20 rounded-3xl blur-xl group-hover:bg-blue-600/20 transition-all" />
            <div className="relative p-8 rounded-3xl border border-blue-900/50 bg-gray-900/90 backdrop-blur ring-1 ring-blue-500/30">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-[0_0_10px_rgba(37,99,235,0.5)]">raw2hdr</span>
                <h3 className="text-2xl font-bold text-white">CIRAWFilter → HLG Pipeline</h3>
              </div>

              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-sm font-mono text-blue-300">1</div>
                  <div>
                    <h4 className="font-semibold text-blue-200">Single RAW — no bracketing</h4>
                    <p className="text-sm text-gray-400">Apple's CIRAWFilter decodes your 12–14 bit sensor data natively. Fujifilm, Sony, Canon, Panasonic, Leica, and Olympus all supported.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-sm font-mono text-blue-300">2</div>
                  <div>
                    <h4 className="font-semibold text-blue-200">16-bit linear → Rec.2020</h4>
                    <p className="text-sm text-gray-400">sRGB → linear RGB → XYZ → Rec.2020 colour transform. All editor adjustments (exposure, NR, LUTs) applied before any data loss.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-sm font-mono text-blue-300">3</div>
                  <div>
                    <h4 className="font-semibold text-blue-200">BT.2100 HLG HEIC output</h4>
                    <p className="text-sm text-gray-400">10-bit HEIC with HLG transfer function. Highlights glow on iPhone OLED. Looks like a normal photo on every other screen. Share directly.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
