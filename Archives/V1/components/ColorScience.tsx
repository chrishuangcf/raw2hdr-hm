import React from 'react';

export interface ColorScienceProps {
  onLearnMore?: () => void;
}

export const ColorScience: React.FC<ColorScienceProps> = ({ onLearnMore }) => {
  return (
    <section id="science" className="grid md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        <img 
          src="https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2022/08/Color-Gamut-1.jpg" 
          alt="Color Gamut Comparison" 
          className="relative rounded-2xl shadow-2xl border border-slate-700 w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-lg text-xs text-slate-300">
          Visual representation: The colored triangle represents the wide Rec.2020 gamut compared to standard sRGB.
        </div>
      </div>

      <div className="order-1 md:order-2">
        <h2 className="text-3xl font-bold mb-6">Colors That <br/><span className="text-purple-400">Pop Off The Screen</span></h2>
        <p className="text-slate-300 mb-6 leading-relaxed">
          Your RAW data is full of hidden color. Standard JPEGs throw this away. Our engine maps your RAW data directly to the <strong>PQ Rec.2020</strong> color space.
        </p>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
               <span className="text-lg font-bold">1</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Linear Processing</h3>
              <p className="text-sm text-slate-400">We process the RAW data linearly to preserve physical light accuracy before tone mapping.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
               <span className="text-lg font-bold">2</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">10-Bit Precision</h3>
              <p className="text-sm text-slate-400">8-bit has 16 million colors. 10-bit has over 1 billion. This eliminates banding in skies and gradients.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
               <span className="text-lg font-bold">3</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Display Adaptability</h3>
              <p className="text-sm text-slate-400">Export a single HEIC that looks correct on your MacBook, brilliant on your iPhone, and standard on older screens.</p>
            </div>
          </div>
        </div>

        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-900/30"
          >
            Learn More
          </button>
        )}
      </div>
    </section>
  );
};