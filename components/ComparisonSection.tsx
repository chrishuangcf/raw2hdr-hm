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
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Traditional vs. True Pipeline</h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            Most "HDR" apps destroy data before you ever see it. We preserve it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Traditional Way */}
          <div className="relative group">
            <div className="absolute inset-0 bg-red-900/10 rounded-3xl blur-xl group-hover:bg-red-900/20 transition-all" />
            <div className="relative p-8 rounded-3xl border border-gray-800 bg-gray-900/80 backdrop-blur">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-xs font-bold uppercase tracking-wide">The Old Way</span>
                <h3 className="text-2xl font-bold text-gray-200">Traditional Bracketing</h3>
              </div>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-mono text-gray-400">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-300">Capture 3+ RAWs</h4>
                    <p className="text-sm text-gray-500">Requires a tripod. Ghosting happens if anything moves.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center text-sm font-mono text-red-400">2</div>
                  <div>
                    <h4 className="font-semibold text-red-300">Compress to 8-bit</h4>
                    <p className="text-sm text-gray-500">94% of color data is discarded immediately to fit sRGB.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-mono text-gray-400">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-300">Merge & Output</h4>
                    <p className="text-sm text-gray-500">Result is a standard JPEG/PNG. Highlights clipped, shadows crushed.</p>
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
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-[0_0_10px_rgba(37,99,235,0.5)]">The Revolution</span>
                <h3 className="text-2xl font-bold text-white">raw2hdr Pipeline</h3>
              </div>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-sm font-mono text-blue-300">1</div>
                  <div>
                    <h4 className="font-semibold text-blue-200">Single RAW File</h4>
                    <p className="text-sm text-gray-400">Leverage the 14-bit data already in your sensor. No ghosting.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-sm font-mono text-blue-300">2</div>
                  <div>
                    <h4 className="font-semibold text-blue-200">Direct 10-bit Conversion</h4>
                    <p className="text-sm text-gray-400">Zero compression steps. Preserves 1 billion colors.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-sm font-mono text-blue-300">3</div>
                  <div>
                    <h4 className="font-semibold text-blue-200">Native HDR Output</h4>
                    <p className="text-sm text-gray-400">Displays on iPhone X+ with true light emission and depth.</p>
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