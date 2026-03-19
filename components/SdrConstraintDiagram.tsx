import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SdrConstraintDiagram: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    transition: { duration: 0.5, delay },
  });

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0 },
    animate: inView ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: 0.4, delay },
  });

  // Fixed-height connector — used between file and OS detection
  const fixedConnector = (delay: number, dark: boolean) => (
    <motion.div {...fadeIn(delay)} className="flex flex-col items-center py-1">
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.35, delay, ease: 'easeIn' }}
        style={{ transformOrigin: 'top' }}
        className={`w-px h-6 ${dark ? 'bg-gray-600' : 'bg-blue-500/40'}`}
      />
      <motion.div {...fadeIn(delay + 0.15)} className={`text-xs ${dark ? 'text-gray-600' : 'text-blue-500/50'}`}>▼</motion.div>
    </motion.div>
  );

  // Flexible connector — used between OS detection and Display output.
  // flex-1 stretches it to consume whatever height difference exists between the two columns,
  // keeping both Display output boxes at the same vertical level.
  const flexConnector = (delay: number, dark: boolean) => (
    <motion.div
      {...fadeIn(delay)}
      className="flex-1 flex flex-col items-center py-2 min-h-8"
    >
      <div className={`flex-1 w-px ${dark ? 'bg-gray-600' : 'bg-blue-500/40'}`} />
      <span className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-blue-500/50'}`}>▼</span>
    </motion.div>
  );

  return (
    <div ref={ref} className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
      <div className="px-6 pt-5 pb-1 border-b border-white/5">
        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">How the OS decides: SDR vs HDR rendering</div>
      </div>

      <div className="p-6 grid sm:grid-cols-2 gap-4">

        {/* ── SDR Column ── */}
        <div className="flex flex-col">
          <div className="text-center mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-gray-800 border border-gray-700 text-gray-400">JPEG · PNG · TIFF — all SDR</span>
          </div>

          {/* Files */}
          <motion.div {...fadeUp(0.1)} className="rounded-xl bg-gray-900 border border-gray-700/60 overflow-hidden">
            {[
              { icon: '📄', name: 'photo.jpg',  tags: ['color_space: sRGB', 'bit_depth: 8'] },
              { icon: '🖼', name: 'photo.png',  tags: ['color_space: sRGB', 'bit_depth: 8–16'] },
              { icon: '🗂', name: 'photo.tiff', tags: ['color_space: sRGB / AdobeRGB', 'bit_depth: 16'] },
            ].map((f, i) => (
              <div key={i} className={`px-4 py-3 space-y-1.5 ${i < 2 ? 'border-b border-gray-800' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{f.icon}</span>
                  <span className="text-xs font-mono text-gray-300">{f.name}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((t, j) => (
                    <span key={j} className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 border border-gray-700 text-gray-400">{t}</span>
                  ))}
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 border border-red-500/30 text-red-400">HDR metadata: none</span>
                </div>
              </div>
            ))}
            <div className="px-4 py-2.5 bg-gray-800/40 border-t border-gray-800">
              <span className="text-[10px] text-amber-400/80 font-mono">⚠ 16-bit precision ≠ HDR — no HLG transfer function</span>
            </div>
          </motion.div>

          {fixedConnector(0.4, true)}

          {/* OS detection */}
          <motion.div {...fadeUp(0.55)} className="p-4 rounded-xl bg-gray-900 border border-gray-700/60 space-y-2">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">OS · CoreImage detection</div>
            <div className="flex items-start gap-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.75, type: 'spring', stiffness: 300 }}
                className="text-red-400 text-sm leading-5 flex-shrink-0"
              >✗</motion.span>
              <div className="space-y-1">
                <div className="text-xs text-gray-400">No HLG transfer function found</div>
                <div className="text-xs text-gray-400">No BT.2100 / Rec.2020 profile</div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-gray-600 pt-1.5 border-t border-gray-800">
              → Render as SDR · cap at 100 nits
            </div>
          </motion.div>

          {flexConnector(0.85, true)}

          {/* Display output */}
          <motion.div {...fadeUp(1.0)} className="p-4 rounded-xl bg-gray-900 border border-gray-700/60 space-y-3">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Display output</div>
            <div className="flex items-end gap-3">
              <div className="flex-1 h-28 bg-gray-800/80 rounded-lg overflow-hidden relative flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={inView ? { height: '28%' } : { height: 0 }}
                  transition={{ duration: 0.7, delay: 1.2, ease: 'easeOut' }}
                  className="w-full bg-gray-500 rounded-t-sm"
                />
                <div className="absolute top-0 left-0 right-0 border-t-2 border-dashed border-red-500/50" />
                <div className="absolute top-1.5 right-1.5 text-[9px] text-red-400 font-mono">hard limit</div>
              </div>
              <div className="text-right space-y-0.5 pb-0.5">
                <div className="text-xl font-bold text-gray-400 leading-none">100</div>
                <div className="text-[10px] text-gray-600 font-mono">nits max</div>
                <div className="mt-2 text-[10px] text-red-400">Clipped highlights</div>
                <div className="text-[10px] text-red-400">Crushed shadows</div>
              </div>
            </div>
            <div className="text-[10px] text-gray-600 text-center font-mono">flat · no headroom · SDR only</div>
          </motion.div>
        </div>

        {/* ── HDR Column ── */}
        <div className="flex flex-col">
          <div className="text-center mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 border border-blue-500/30 text-blue-400">HDR HEIC · BT.2100 HLG</span>
          </div>

          {/* File */}
          <motion.div {...fadeUp(0.2)} className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-sm">✦</span>
              <span className="text-xs font-mono text-gray-300">photo.heic</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-300">color_space: BT.2100 HLG</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-300">bit_depth: 10</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">transfer: HLG ✓</span>
            </div>
          </motion.div>

          {fixedConnector(0.5, false)}

          {/* OS detection */}
          <motion.div {...fadeUp(0.65)} className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 space-y-2">
            <div className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest">OS · CoreImage detection</div>
            <div className="flex items-start gap-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.85, type: 'spring', stiffness: 300 }}
                className="text-emerald-400 text-sm leading-5 flex-shrink-0"
              >✓</motion.span>
              <div className="space-y-1">
                <div className="text-xs text-gray-300">HLG transfer function detected</div>
                <div className="text-xs text-gray-300">BT.2100 · Rec.2020 profile confirmed</div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-blue-400/60 pt-1.5 border-t border-blue-500/10">
              → Enable EDR headroom · unlock HDR rendering
            </div>
          </motion.div>

          {/* Flexible connector — stretches to match SDR column height */}
          {flexConnector(0.95, false)}

          {/* Display output */}
          <motion.div {...fadeUp(1.1)} className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 space-y-3">
            <div className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest">Display output</div>
            <div className="flex items-end gap-3">
              <div className="flex-1 h-28 bg-gray-800/80 rounded-lg overflow-hidden relative flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={inView ? { height: '100%' } : { height: 0 }}
                  transition={{ duration: 0.8, delay: 1.3, ease: 'easeOut' }}
                  className="w-full rounded-t-sm"
                  style={{ background: 'linear-gradient(to top, #1e3a8a 0%, #3b82f6 55%, #93c5fd 80%, #fef08a 100%)' }}
                />
                <div className="absolute top-[72%] left-0 right-0 border-t border-dashed border-gray-500/60" />
                <div className="absolute top-[73%] right-1.5 text-[9px] text-gray-500 font-mono">SDR ref</div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 2, duration: 0.8 }}
                  className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-300/20 pointer-events-none"
                />
              </div>
              <div className="text-right space-y-0.5 pb-0.5">
                <div className="text-xl font-bold text-blue-400 leading-none">1000+</div>
                <div className="text-[10px] text-gray-500 font-mono">nits peak</div>
                <div className="mt-2 text-[10px] text-yellow-400">Glowing highlights</div>
                <div className="text-[10px] text-yellow-400">Deep shadows</div>
              </div>
            </div>
            <div className="text-[10px] text-blue-400/60 text-center font-mono">full HDR · luminance above SDR white</div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default SdrConstraintDiagram;
