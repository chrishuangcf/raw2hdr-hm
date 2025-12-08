import React from 'react';

export const DownloadSection: React.FC = () => {
  return (
    <footer id="download" className="bg-slate-950 border-t border-slate-900 py-16 text-center relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">
          Ready to see the light?
        </h2>
        <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
          Download the beta today. Bring every photo to life with the light, color, and clarity your camera always captured.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a 
            href="raw2hdr.zip" 
            download
            className="group relative inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform duration-200 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            <span>Download Beta for Mac</span>
            <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
        <p className="mt-6 text-xs text-slate-500">
          Requires macOS 13.0 or later. Apple Silicon recommended for real-time preview.
        </p>
      </div>
    </footer>
  );
};