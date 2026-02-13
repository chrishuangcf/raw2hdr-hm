import React from 'react';

const features = [
  {
    title: "Linear RAW → Rec.2020",
    description: "Our engine unlocks hidden detail using cinema-grade color science, converting linear data to the wide PQ Rec.2020 gamut.",
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    title: "10-bit HEIC Export",
    description: "Generate files that iPhone and modern XDR displays understand natively. No banding, just smooth gradients.",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Smart Nit Control",
    description: "Target 1600 nits for iPhone 16 Pro, or push to 2000 nits for maximum headroom. You control the brightness ceiling.",
    icon: (
      <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    title: "Non-Destructive Tools",
    description: "Essential controls like Exposure, White Balance, and Highlight Control designed specifically for the HDR pipeline.",
    icon: (
      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    )
  }
];

export const FeatureGrid: React.FC = () => {
  return (
    <section id="features">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Tools. <span className="text-cyan-400">Professional Results.</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          We handle the complex color science. You handle the art. 
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};