import React from 'react';

export const BetaDisclaimer: React.FC = () => {
  return (
    <section id="beta" className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-6">
        <div className="bg-yellow-500/10 p-3 rounded-lg hidden sm:block">
          <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Beta Limitation Notice</h3>
          <ul className="space-y-3 text-sm text-slate-300 list-disc pl-4">
             <li>
               <strong>Resolution:</strong> The beta outputs at 25% of the original RAW resolution. This is free for exploration while we optimize the engine.
             </li>
             <li>
               <strong>No LUT Support Yet:</strong> Most LUTs are 8-bit SDR (Rec.709). Applying them would destroy the 10-bit HDR data we work so hard to preserve. We are building custom HDR-grade creative tools for future releases.
             </li>
             <li>
               <strong>Preview Color:</strong> Your web browser cannot display the full Rec.2020 HDR gamut. The preview is an approximation; the final exported HEIC will look significantly more vivid on a supported device.
             </li>
          </ul>
        </div>
      </div>
    </section>
  );
};