import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Cpu, Layers, Sliders, Zap, Eye,
  Camera, FileImage, Settings, Monitor, Code, GitBranch, Film, Database,
  Gauge, Sparkles, Triangle, ChevronDown,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, AreaChart, Area, LineChart, Line, ReferenceLine, ReferenceDot,
} from 'recharts';

interface SectionProps {
  id: string;
  number: string;
  icon: React.ReactNode;
  accentColor: string;
  gradientFrom: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, number, icon, accentColor, gradientFrom, title, subtitle, children }) => (
  <div id={id} className="border-t border-gray-800/60 pt-14 pb-6">
    <div className="flex items-start gap-4 mb-8">
      <div className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${accentColor} shadow-lg`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{number}</div>
        <h2 className={`text-2xl md:text-3xl font-bold leading-tight bg-gradient-to-r ${gradientFrom} to-white bg-clip-text text-transparent`}>
          {title}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>
      </div>
    </div>
    <div className="space-y-5 text-gray-300 leading-relaxed">
      {children}
    </div>
  </div>
);

const Callout: React.FC<{ children: React.ReactNode; variant?: 'info' | 'note' | 'tech' }> = ({ children, variant = 'info' }) => {
  const styles: Record<string, string> = {
    info: 'bg-blue-500/10 border-blue-500/25 text-blue-200',
    note: 'bg-amber-500/10 border-amber-500/25 text-amber-200',
    tech: 'bg-zinc-800/60 border-zinc-700/60 text-gray-300 font-mono text-sm',
  };
  return (
    <div className={`rounded-xl border px-5 py-4 leading-relaxed ${styles[variant]}`}>
      {children}
    </div>
  );
};

const MetricCard: React.FC<{ value: string; label: string; sub?: string; color: string }> = ({ value, label, sub, color }) => (
  <div className={`rounded-2xl border p-5 space-y-1 ${color}`}>
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className="text-sm font-medium text-gray-300">{label}</div>
    {sub && <div className="text-xs text-gray-500">{sub}</div>}
  </div>
);

const PipelineStep: React.FC<{ step: string; desc: string; accent: string; last?: boolean }> = ({ step, desc, accent, last }) => (
  <div className="flex items-start gap-3">
    <div className="flex flex-col items-center">
      <div className={`w-7 h-7 rounded-full border-2 ${accent} flex items-center justify-center flex-shrink-0`}>
        <div className={`w-2.5 h-2.5 rounded-full ${accent.replace('border', 'bg')}`} />
      </div>
      {!last && <div className="w-px flex-1 bg-gray-700/50 mt-1 mb-1 min-h-[20px]" />}
    </div>
    <div className="pb-4">
      <div className="text-sm font-bold text-white font-mono">{step}</div>
      <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</div>
    </div>
  </div>
);

const DetailsPanel: React.FC<{ title: string; children: React.ReactNode; accent?: string }> = ({ title, children, accent = 'border-white/10' }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border ${accent} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors gap-3"
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-4 border-t border-white/5 space-y-3 text-sm text-gray-400 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

const MeteringChart: React.FC = () => {
  const evCurve = Array.from({ length: 45 }, (_, i) => {
    const y = 0.02 + i * (0.88 / 44);
    const ev = Math.log2(0.18 / y);
    return { y: parseFloat(y.toFixed(3)), ev: parseFloat(ev.toFixed(2)) };
  });

  const weights = [
    { channel: 'Red', fill: '#f87171' },
    { channel: 'Green', fill: '#4ade80' },
    { channel: 'Blue', fill: '#60a5fa' },
  ];

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">

        {/* EV compensation curve */}
        <div className="p-5 space-y-3">
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">EV Compensation — Center Luminance Analysis</div>
            <div className="text-xs text-gray-600 mt-0.5">How much the pipeline brightens or darkens based on measured center Y</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={evCurve} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="y" tick={{ fill: '#71717a', fontSize: 10 }} tickFormatter={(v: number) => v.toFixed(2)} label={{ value: 'Center Y (luminance)', position: 'insideBottom', offset: -4, fill: '#52525b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} tickFormatter={(v: number) => `${v > 0 ? '+' : ''}${v} EV`} domain={[-3, 3]} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, color: '#e4e4e7', fontSize: 12 }}
                formatter={(v: number) => [`${v > 0 ? '+' : ''}${v} EV`, 'Compensation']}
                labelFormatter={(l: number) => `Center Y = ${l}`}
              />
              <ReferenceLine y={0} stroke="#6366f1" strokeDasharray="4 2" strokeWidth={1.5} />
              <ReferenceDot x={0.18} y={0} r={5} fill="#22c55e" stroke="#16a34a" label={{ value: '18% gray', position: 'top', fill: '#22c55e', fontSize: 10 }} />
              <Line type="monotone" dataKey="ev" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-gray-400"><div className="w-4 h-0.5 bg-orange-500" /> EV compensation curve</div>
            <div className="flex items-center gap-1.5 text-gray-400"><div className="w-3 h-3 rounded-full bg-emerald-500" /> 18% gray (EV = 0)</div>
          </div>
        </div>

        {/* Perceptual luminance weights */}
        <div className="p-5 space-y-3">
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Perceptual Channel Sensitivity</div>
            <div className="text-xs text-gray-600 mt-0.5">How the three colour channels contribute to perceived luminance</div>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { label: 'Green', bar: 'w-[72%]', color: 'bg-green-500', note: 'Dominant — matches peak human photopic sensitivity' },
              { label: 'Red', bar: 'w-[21%]', color: 'bg-red-400', note: 'Secondary contribution' },
              { label: 'Blue', bar: 'w-[7%]', color: 'bg-blue-400', note: 'Minimal — least sensitive wavelength range' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300 font-medium">{item.label}</span>
                  <span className="text-gray-600 text-[10px]">{item.note}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.bar} ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 leading-relaxed">
            Green dominates perceived brightness — this is why green-channel quality matters most for luminance accuracy.
          </div>
        </div>

      </div>
    </div>
  );
};

const LutCacheChart: React.FC = () => {
  const data = [
    { name: 'No Cache (60 LUTs)', seconds: 198 },
    { name: 'With Linear Cache', seconds: 21 },
  ];
  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-white">LUT Thumbnail Generation Time</div>
          <div className="text-xs text-gray-500">60 LUT previews for a single RAW file</div>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">9x faster</div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} />
          <YAxis tick={{ fill: '#71717a', fontSize: 11 }} tickFormatter={(v: number) => `${v}s`} />
          <Tooltip
            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, color: '#e4e4e7' }}
            formatter={(v: number) => [`${v}s`, 'Total time']}
          />
          <Bar dataKey="seconds" radius={[6, 6, 0, 0]}>
            <Cell fill="#ef4444" />
            <Cell fill="#22c55e" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-6 text-xs">
        <div className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 rounded-sm bg-red-500" /> ~3.3 min without cache</div>
        <div className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 rounded-sm bg-emerald-500" /> ~21 sec with single decode</div>
      </div>
    </div>
  );
};

const HlgSignalChart: React.FC = () => {
  const data = Array.from({ length: 30 }, (_, i) => {
    const x = i / 29;
    const isHDR = x > 0.75;
    return {
      x: Math.round(x * 100),
      sdr: isHDR ? 0 : parseFloat(x.toFixed(3)),
      hdr: isHDR ? parseFloat(x.toFixed(3)) : 0,
    };
  });
  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
      <div>
        <div className="text-sm font-bold text-white">HLG Signal Space Allocation</div>
        <div className="text-xs text-gray-500">~75% SDR-equivalent content — ~25% HDR headroom above white</div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="x" tick={{ fill: '#71717a', fontSize: 10 }} tickFormatter={(v: number) => `${v}%`} />
          <YAxis tick={{ fill: '#71717a', fontSize: 10 }} hide />
          <Area type="monotone" dataKey="sdr" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} name="SDR Content" />
          <Area type="monotone" dataKey="hdr" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} name="HDR Headroom" />
          <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, color: '#e4e4e7' }} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-6 text-xs">
        <div className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 rounded-sm bg-indigo-500/50 border border-indigo-500" /> SDR Content (0-75%)</div>
        <div className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 rounded-sm bg-emerald-500/50 border border-emerald-500" /> HDR Headroom (75-100%)</div>
      </div>
    </div>
  );
};

const ColorSpaceBar: React.FC = () => {
  const spaces = [
    { name: 'sRGB', pct: 35.9, color: 'bg-red-500' },
    { name: 'Display P3', pct: 45.5, color: 'bg-emerald-500' },
    { name: 'Rec.2020', pct: 75.8, color: 'bg-blue-500' },
    { name: 'Human Eye (CIE 1931)', pct: 100, color: 'bg-violet-400' },
  ];
  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-5">
      <div>
        <div className="text-sm font-bold text-white">Gamut Coverage vs. Human Vision</div>
        <div className="text-xs text-gray-500">Percentage of CIE 1931 visible spectrum covered</div>
      </div>
      {spaces.map((s) => (
        <div key={s.name} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">{s.name}</span>
            <span className="text-gray-500 font-mono">{s.pct}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const TiffVsHeicChart: React.FC = () => (
  <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-5">
    <div>
      <div className="text-sm font-bold text-white">The Bit-Depth Paradox</div>
      <div className="text-xs text-gray-500 mt-0.5">More steps ≠ wider range — what the steps cover is what matters</div>
    </div>

    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-300 font-medium">16-bit TIFF (sRGB)</span>
        <span className="font-mono text-gray-500">65,536 steps</span>
      </div>
      <div className="relative h-9 rounded-lg overflow-hidden bg-gray-800/60">
        <div className="absolute inset-0 bg-indigo-500/40 border border-indigo-500/30" />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-indigo-200 font-mono tracking-wide">
          ALL 65,536 steps crammed within SDR window — ceiling: display white
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-red-400">
        <span>✗</span><span>Nothing above SDR white is representable — the luminance ceiling is structural, not a precision limitation</span>
      </div>
    </div>

    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-300 font-medium">10-bit HEIC (HLG BT.2100)</span>
        <span className="font-mono text-gray-500">1,024 steps</span>
      </div>
      <div className="relative h-9 rounded-lg overflow-hidden bg-gray-800/60 flex">
        <div className="h-full bg-indigo-500/40 border-r-2 border-dashed border-indigo-400/60 flex items-center justify-center" style={{ width: '75%' }}>
          <span className="text-[10px] text-indigo-200 font-mono">SDR content · 75%</span>
        </div>
        <div className="h-full bg-emerald-500/50 border border-emerald-500/30 flex items-center justify-center" style={{ width: '25%' }}>
          <span className="text-[10px] text-emerald-200 font-mono">HDR ↑</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
        <span>✓</span><span>25% of the signal range encodes genuine HDR headroom above reference white — EDR rendering activated at the OS level</span>
      </div>
    </div>

    <div className="pt-2 border-t border-zinc-800 text-xs text-gray-500 leading-relaxed">
      A 10-bit HEIC displays a wider luminance range than a 16-bit TIFF on every HDR screen. Bit depth governs gradient smoothness. The transfer function governs the luminance ceiling. The two are orthogonal.
    </div>
  </div>
);

const FormatComparisonTable: React.FC = () => (
  <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
    <div className="px-5 py-3 border-b border-zinc-800 text-xs font-mono text-gray-500 uppercase tracking-widest">
      Format Comparison — Why Bit Depth Alone Cannot Unlock HDR
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left px-4 py-2.5 text-gray-500 font-normal">Format</th>
            <th className="text-left px-4 py-2.5 text-gray-500 font-normal">Bit depth</th>
            <th className="text-left px-4 py-2.5 text-gray-500 font-normal">Transfer function</th>
            <th className="text-left px-4 py-2.5 text-gray-500 font-normal">OS reads as</th>
            <th className="text-left px-4 py-2.5 text-gray-500 font-normal">On HDR display</th>
          </tr>
        </thead>
        <tbody>
          {([
            { fmt: 'JPEG', bits: '8-bit', tf: 'sRGB gamma', os: 'SDR', hdr: '✗ Clipped at encode', pass: false },
            { fmt: 'PNG', bits: '8 or 16-bit', tf: 'sRGB gamma', os: 'SDR', hdr: '✗ SDR ceiling', pass: false },
            { fmt: 'TIFF', bits: '16-bit', tf: 'sRGB / AdobeRGB (ICC)', os: 'SDR', hdr: '✗ SDR ceiling', pass: false },
            { fmt: 'PSD', bits: '16 or 32-bit', tf: 'sRGB / ProPhoto (ICC)', os: 'SDR', hdr: '✗ SDR ceiling', pass: false },
            { fmt: 'DNG', bits: '16-bit', tf: 'Linear / sRGB (ICC)', os: 'SDR', hdr: '✗ No HDR decode path', pass: false },
            { fmt: 'HEIC + HLG', bits: '10-bit', tf: 'HLG BT.2100 (NCLX)', os: 'HDR', hdr: '✓ Full EDR activated', pass: true },
          ] as { fmt: string; bits: string; tf: string; os: string; hdr: string; pass: boolean }[]).map((r, i) => (
            <tr key={i} className={`border-b border-zinc-800/50 ${r.pass ? 'bg-emerald-500/5' : i % 2 === 0 ? 'bg-black/10' : ''}`}>
              <td className={`px-4 py-2.5 font-bold ${r.pass ? 'text-emerald-300' : 'text-white'}`}>{r.fmt}</td>
              <td className="px-4 py-2.5 text-gray-400 font-mono">{r.bits}</td>
              <td className="px-4 py-2.5 text-blue-300 font-mono">{r.tf}</td>
              <td className={`px-4 py-2.5 font-medium ${r.pass ? 'text-emerald-400' : 'text-gray-400'}`}>{r.os}</td>
              <td className={`px-4 py-2.5 font-mono ${r.pass ? 'text-emerald-400' : 'text-red-400'}`}>{r.hdr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="px-5 py-3 bg-emerald-500/5 border-t border-emerald-500/10">
      <p className="text-xs text-emerald-400">HEIC is the only format where all three requirements align: HDR transfer function + OS-level decode support + hardware-backed EDR rendering on Apple displays.</p>
    </div>
  </div>
);

const TechnicalDeepDive: React.FC<{ onClose?: () => void }> = () => {
  const navigate = useNavigate();
  const tocItems = [
    { id: 'demosaic', label: '01. RAW Demosaic' },
    { id: 'pipeline', label: '02. Color Pipeline' },
    { id: 'metering', label: '03. Exposure Metering' },
    { id: 'lut-engine', label: '04. 3D LUT Engine' },
    { id: 'hdr-lut', label: '05. HDR LUT Problem' },
    { id: 'gainmap', label: '06. Gain Map vs Raw-Native' },
    { id: 'tiff', label: '07. Why TIFF & DNG Fall Short' },
    { id: 'hlg', label: '08. HLG Encoding' },
    { id: 'canvas', label: '09. HDR Canvas Problem' },
    { id: 'filmicfx', label: '10. Filmic F/X & Frames' },
    { id: 'cache', label: '11. LUT Cache' },
    { id: 'logprofile', label: '12. Log Profile System' },
    { id: 'lens', label: '13. Lens Correction' },
    { id: 'arch', label: '14. Architectural Overview' },
    { id: 'references', label: '15. References' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="sticky top-0 bg-gray-950/95 backdrop-blur border-b border-gray-900 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Cpu className="w-4 h-4" />
            <span className="hidden sm:inline">Technical Deep Dive</span>
          </div>
          <div className="w-20 text-right text-xs text-gray-600 font-mono">15 chapters</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 lg:flex gap-12">
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-20 space-y-0.5">
            <div className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">Chapters</div>
            {tocItems.map(item => (
              <button key={item.id} onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })} className="block w-full text-left text-xs text-gray-500 hover:text-white transition-colors py-1 px-2 rounded hover:bg-white/5">
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono uppercase tracking-widest mb-6">
              <Code className="w-3 h-3" /> Technical Deep Dive
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">How raw2hdr Works</h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              A chapter-by-chapter breakdown of the engineering decisions, novel approaches, and architectural constraints behind raw2hdr. Written for engineers and technically curious photographers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {['Pipeline architecture', 'Color science', 'HDR encoding', 'Performance design'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-400">{tag}</span>
              ))}
            </div>
          </div>

          {/* ─── 01 ─── */}
          <Section id="demosaic" number="01" icon={<Camera className="w-5 h-5 text-indigo-400" />}
            accentColor="bg-indigo-500/10" gradientFrom="from-indigo-300"
            title="RAW Demosaic — Manufacturer-Agnostic Baseline" subtitle="Decode neutral, decode linear, decode once">
            <p>Most RAW processors tie demosaicing to manufacturer profiles — Canon Picture Style, Fujifilm Film Simulation, Nikon Picture Control. This makes a single downstream pipeline that works for all cameras impossible.</p>
            <p>raw2hdr uses Apple native <code className="bg-white/5 px-1 rounded text-sm">CIRAWFilter</code> as the sole demosaic path. Physical corrections only: Bayer/X-Trans demosaic, colour matrix, D65 white balance. <strong className="text-white">No Film Simulation. No tone curve. No creative profile.</strong></p>
            <Callout variant="info">
              <strong>Result:</strong> A Fujifilm GFX 100S, Panasonic S5 II, Leica M11, Sony A7R V — all emerge from decode as the same thing: a floating-point linear RGB buffer in sRGB primaries. Different scene values, identical encoding contract. One pipeline serves all.
            </Callout>

            <DetailsPanel title="What is a RAW file, really?" accent="border-indigo-500/20">
              <p>A RAW file is not an image. It is a grid of single-channel sensor readings — one brightness measurement per photosite — interleaved in a colour filter pattern. Most sensors use the Bayer RGGB pattern, where each 2×2 block contains one red, one blue, and two green photosites. Fujifilm's X-Trans sensors use a larger 6×6 repeating pattern with a different colour distribution.</p>
              <p>Converting that grid into a viewable RGB image requires <strong className="text-white">demosaicing</strong>: estimating the missing two colour values at each pixel by examining its spatial neighbourhood, applying the camera's colour matrix to transform from sensor-native colour to a standard colour space, and white-balancing to a reference illuminant. This is a computationally intensive interpolation problem, not a simple pixel-copy operation.</p>
              <p>The output of a properly neutral demosaic is a <strong className="text-white">scene-referred linear RGB buffer</strong> — a physically accurate representation of scene luminance where doubling the pixel value means doubling the light. This is the mathematically pristine starting point from which all subsequent colour transforms can be applied correctly.</p>
            </DetailsPanel>

            <DetailsPanel title="The combinatorial maintenance problem" accent="border-indigo-500/20">
              <p>Professional RAW software — Lightroom, Capture One, DxO — ties decoding tightly to <strong className="text-white">manufacturer-provided camera profiles</strong>: per-camera colour matrices tuned under controlled illuminants, tone curves calibrated against the camera's own JPEG engine, ICC profiles encoding the camera's gamut, and the proprietary colour science that drives each brand's creative rendering.</p>
              <p>The consequence is that the same RAW file produces subtly different results in each tool, because each applies a different interpretation of the manufacturer's colour science. There is no "ground truth" rendering — only different flavours of the manufacturer's intent.</p>
              <p>More importantly: this profile-per-camera approach makes it impossible to write a single downstream pipeline that works correctly for all cameras. A pipeline calibrated for Fujifilm's colour science will be wrong for Leica, and vice versa. LUTs designed for Fujifilm footage cannot be applied to Leica RAW files without manual recalibration for each camera-LUT combination. For an application supporting seven manufacturers and 60+ LUTs, this is a combinatorial maintenance problem that does not scale.</p>
              <p>The raw2hdr approach sidesteps this entirely: the decoder outputs to a single, precisely defined colour space — linear scene-referred RGB in the sRGB primaries, stored as 16-bit half-float values. It performs the neutral physical decode and stops there. Every camera is now the same thing downstream.</p>
            </DetailsPanel>

            <DetailsPanel title="The trade-off — what manufacturer-agnostic decode costs you" accent="border-orange-500/20">
              <p>Neutral decode is powerful because it removes all creative interpretation at the decode stage. That same choice means the camera's characteristic look is not preserved by default — the neutral linear output needs colour grading to have personality.</p>
              <div className="mt-3 rounded-xl overflow-hidden border border-zinc-700">
                <div className="grid grid-cols-2 divide-x divide-zinc-700">
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">What raw2hdr removes</div>
                    {[
                      'Fujifilm Film Simulations (Velvia, Classic Chrome, Eterna…)',
                      'Canon Picture Style colour rendering',
                      'Sony Creative Style tone curves',
                      'Nikon Picture Control microcontrast sharpening',
                      'Leica JPEG colour signature at decode',
                      'Any per-camera JPEG colour bias',
                    ].map((item, i) => (
                      <div key={i} className="flex gap-2 text-xs text-gray-400">
                        <span className="text-red-500 mt-0.5 flex-shrink-0">−</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">What raw2hdr provides instead</div>
                    {[
                      'Neutral linear baseline — identical contract across all manufacturers',
                      'Log formats synthesized mathematically, not derived from JPEG',
                      'Every LUT in the library applies correctly to every camera',
                      'HDR pipeline that never needs per-camera recalibration',
                      'Highlights preserved in linear light from the very first step',
                      'Colour accuracy from Apple-calibrated matrices, not a JPEG engine',
                    ].map((item, i) => (
                      <div key={i} className="flex gap-2 text-xs text-gray-400">
                        <span className="text-emerald-400 mt-0.5 flex-shrink-0">+</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-3">Photographers who specifically want their camera's native colour rendering — particularly Fujifilm shooters attached to Film Simulations — are not raw2hdr's primary audience. The application is built for photographers who want HDR output with full creative control through the LUT and grade system.</p>
            </DetailsPanel>

            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-800 text-xs font-mono text-gray-500 uppercase tracking-widest">All Log Formats Synthesized from the Same Linear Baseline</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left px-4 py-2.5 text-gray-500 font-normal">Manufacturer</th>
                      <th className="text-left px-4 py-2.5 text-gray-500 font-normal">Log Format</th>
                      <th className="text-left px-4 py-2.5 text-gray-500 font-normal">Colour Gamut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Fujifilm', 'F-Log2', 'F-Gamut'],
                      ['Panasonic', 'V-Log', 'V-Gamut'],
                      ['Sony', 'S-Log3', 'S-Gamut3.Cine'],
                      ['Nikon', 'N-Log', 'N-Gamut'],
                      ['Canon', 'C-Log3', 'Cinema Gamut'],
                      ['Leica', 'L-Log', 'L-Gamut'],
                      ['Xiaomi', 'Mi-Log', 'ACES-derived'],
                    ].map(([mfr, log, gamut], i) => (
                      <tr key={i} className={`border-b border-zinc-800/50 ${i % 2 === 0 ? 'bg-black/10' : ''}`}>
                        <td className="px-4 py-2 text-white font-medium">{mfr}</td>
                        <td className="px-4 py-2 text-blue-300 font-mono">{log}</td>
                        <td className="px-4 py-2 text-gray-400">{gamut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 bg-emerald-500/5 border-t border-emerald-500/10">
                <p className="text-xs text-emerald-400">All formats above are synthesized from neutral linear decode. Any LUT can be applied to any RAW.</p>
              </div>
            </div>
          </Section>

          {/* ─── 02 ─── */}
          <Section id="pipeline" number="02" icon={<Sliders className="w-5 h-5 text-blue-400" />}
            accentColor="bg-blue-500/10" gradientFrom="from-blue-300"
            title="The Unified Color Pipeline" subtitle="Order matters — each stage position reflects a physical constraint">
            <p>Once the neutral linear buffer exists, the pipeline applies a deterministic sequence of transforms. The stage ordering reflects physics and mathematical correctness, not convention.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Lens correction first', desc: 'Vignetting and distortion are phenomena in linear-light space. Correcting in linear is physically exact; correcting after gamma encoding introduces systematic tonal error.' },
                { title: 'Exposure before gamut convert', desc: 'Gamut conversion matrices assume a specific luminance range. Scaling exposure first ensures the matrix sees the correct input values.' },
                { title: 'Calibration after LUT', desc: 'A LUT output range is only knowable after it runs. Post-LUT calibration corrects for systematic offsets in the LUT output.' },
                { title: 'HLG encode last', desc: 'HLG must be the final colour transform so all subsequent compositing occurs in the display-referred coordinate system.' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
            <Callout variant="tech">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Pipeline identity</div>
              <div className="text-xs leading-loose">RAW → Linear decode → Corrections → Colour grade → HDR encode → HEIC</div>
            </Callout>

            <DetailsPanel title="Why floating-point precision throughout the entire pipeline?" accent="border-blue-500/20">
              <p>Every stage operates in floating-point arithmetic. There is no integer quantization step until the final file encode. This means precision accumulated across 10+ stages of processing is never lost to rounding until the very last moment.</p>
              <p>In a traditional editing pipeline, each save or intermediate step typically involves converting to 8-bit integers, rounding fractional values, and discarding sub-bit information. After several stages — demosaic, exposure, colour convert, LUT, tone-map, composite — the accumulated quantization error can be visible as posterization, banding, or colour shift in smooth gradients.</p>
              <p>By maintaining half-float (16-bit floating point) precision from the RAW decode through lens correction, exposure scaling, gamut conversion, log encoding, LUT lookup, post-LUT calibration, linearization, highlight extension, Rec.2020 conversion, HLG encoding, creative effects, and compositing — the only rounding step is the final conversion to the HEIC container's 10-bit integer representation. One rounding step, not twelve.</p>
            </DetailsPanel>

            <DetailsPanel title="Why lens correction cannot be moved later in the pipeline" accent="border-blue-500/20">
              <p>Lens optical aberrations — barrel distortion, pincushion distortion, vignetting — are physical phenomena that exist in scene-linear luminance space. Vignetting is a multiplicative attenuation of light: the corner of the frame receives fewer photons than the centre because the lens barrel physically blocks off-axis light. The attenuation factor has a fixed multiplier relationship to true scene luminance at every tonal level.</p>
              <p>Correcting vignetting by multiplying by the inverse of the attenuation factor is physically exact <em>only</em> when the signal is in linear light. If the signal has been log-encoded or gamma-encoded, the correction becomes a non-multiplicative operation in the encoded space — producing systematic tonal errors that are different for highlights and shadows.</p>
              <p>Similarly, geometric distortion correction involves remapping pixel positions with bilinear interpolation between neighbours. Averaging two neighbouring linear values produces the physically correct intermediate value. Averaging two log-encoded or gamma-encoded values produces a systematically different result, by an amount that grows with the local gradient. This is why correction must come first — before any non-linear encoding touches the data.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 03 ─── */}
          <Section id="metering" number="03" icon={<Gauge className="w-5 h-5 text-cyan-400" />}
            accentColor="bg-cyan-500/10" gradientFrom="from-cyan-300"
            title="Exposure Metering" subtitle="Center-weighted in software — consistent baseline across all 60+ LUT thumbnails">
            <p>Every LUT preview must share the same exposure baseline. Without this, brightness differences between thumbnails would reflect exposure variation rather than the LUT itself, making comparison unreliable.</p>
            <p>raw2hdr mirrors physical center-weighted metering: a central region of the image is analyzed using perceptual luminance weighting. The result is compared to a photographic neutral midtone reference, yielding the EV compensation applied identically to every LUT preview.</p>
            <MeteringChart />

            <DetailsPanel title="The physical camera metering analogy" accent="border-cyan-500/20">
              <p>Camera metering modes differ in which pixels of the scene they use to estimate the "correct" exposure. Evaluative/matrix metering divides the frame into zones and applies a weighted formula. Spot metering uses only the central 1–5% of the frame. <strong className="text-white">Center-weighted metering</strong> concentrates 60–80% of the calculation on a circular central region, under the assumption that the primary subject is positioned there.</p>
              <p>Center-weighted metering dates to the earliest generation of automatic-exposure SLRs in the 1970s — the Canon AE-1, the Nikon F2S, the Olympus OM-1 — and has remained a standard metering mode in every professional camera since. Its longevity reflects its practical reliability: for the vast majority of photographic compositions, the subject is in or near the centre, and metering that region correctly exposes the subject regardless of what the background or periphery is doing.</p>
              <p>raw2hdr's software metering mirrors this approach exactly. A central region of the image is isolated and the perceptual luminance average is computed, weighting channels according to human visual sensitivity to each colour. That average is compared to a photographic reference point for neutral midtone exposure. The ratio, expressed in exposure value stops, becomes the EV compensation.</p>
              <p>A positive EV result means the centre is underexposed relative to middle grey and the pipeline will brighten. A negative result means the centre is overexposed and the pipeline will pull down. The magnitude is typically in the range of ±1.5 stops for well-lit subjects; extreme high-key or low-key scenes will produce values at the edges of that range.</p>
            </DetailsPanel>

            <Callout variant="note">
              <strong>Why not global average?</strong> A portrait against a bright sky produces an average dominated by sky luminance — the subject ends up dark in every LUT preview. Center-weighted metering assumes the photographer aimed at their subject, which holds for the vast majority of compositions.
            </Callout>

            <DetailsPanel title="Why consistent metering across all 60+ LUT thumbnails matters" accent="border-cyan-500/20">
              <p>The EV value derived from center metering is applied <em>identically</em> to every LUT preview generated for that RAW image. This is what makes the LUT selection grid visually coherent: all 60+ previews are at the same exposure level, so the difference a viewer sees between thumbnails reflects only the LUT's colour science and tonal character — not accidental brightness differences.</p>
              <p>Without this consistent baseline, some LUT previews would be brighter or darker than others for reasons that have nothing to do with the LUT itself. A LUT that naturally produces brighter midtones would be indistinguishable from a LUT that simply received a brighter-metered input. The photographer's ability to compare film simulations on visual merit alone requires that exposure is the controlled variable, not a confounding one.</p>
              <p>For exceptions — wide landscapes where the subject spans the full frame, or deliberately periphery-focused compositions — the manual exposure slider in the editor provides adjustment. But the center-metered default eliminates the need for manual adjustment in the cases that matter most.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 04 ─── */}
          <Section id="lut-engine" number="04" icon={<Layers className="w-5 h-5 text-teal-400" />}
            accentColor="bg-teal-500/10" gradientFrom="from-teal-300"
            title="3D LUT Engine — Cross-Manufacturer Compatibility" subtitle="Synthetic log encoding from neutral linear — any LUT, any camera">
            <p>LUTs are authored for one specific input format. A Fujifilm PROVIA LUT expects F-Log2/F-Gamut signal. Feed it V-Log signal and every output dimension is wrong. This is the traditional reason camera brand and LUT brand must match.</p>
            <p>Because every RAW decodes to the same neutral linear baseline, raw2hdr synthesises the correct log signal for any LUT before applying it — so a Fujifilm LUT receives Fujifilm-equivalent input regardless of which camera the RAW came from.</p>
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Cross-Manufacturer Routing</div>
              <div className="flex flex-col items-center gap-3">
                <div className="px-6 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-mono">Any RAW — Linear sRGB (universal)</div>
                <div className="text-gray-600 text-lg">↓</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  {[
                    ['F-Gamut / F-Log2', 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5'],
                    ['V-Gamut / V-Log', 'text-blue-400 border-blue-500/30 bg-blue-500/5'],
                    ['L-Gamut / L-Log', 'text-red-400 border-red-500/30 bg-red-500/5'],
                    ['sRGB (film stocks)', 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5'],
                  ].map(([label, style], i) => (
                    <div key={i} className={`rounded-xl border p-3 text-center text-xs font-mono ${style}`}>{label}</div>
                  ))}
                </div>
                <div className="text-gray-600 text-lg">↓</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  {['Fujifilm LUTs', 'Panasonic LUTs', 'Leica LUTs', 'Any sRGB LUT'].map((label, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs text-gray-400">{label}</div>
                  ))}
                </div>
              </div>
            </div>

            <DetailsPanel title="How other apps apply LUTs — and why the opacity slider exists" accent="border-red-500/20">
              <p>Most photo apps that offer LUT support apply them to an already-rendered image. The RAW is decoded through the camera's colour science, tone-mapped to an sRGB canvas, then the LUT runs on top of that output. The problem: the LUT was designed to receive log-encoded signal — F-Log2, V-Log, S-Log3 — not a finished sRGB image.</p>

              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4 space-y-2">
                  <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Standard app path</div>
                  <div className="font-mono text-xs space-y-1 text-gray-400">
                    {[
                      { text: 'RAW file', arrow: false, color: '' },
                      { text: '↓', arrow: true },
                      { text: 'Camera colour science + tone curve', arrow: false, color: 'text-orange-400' },
                      { text: '↓', arrow: true },
                      { text: 'sRGB 8-bit rendered image', arrow: false, color: '' },
                      { text: '↓', arrow: true },
                      { text: 'LUT applied as overlay', arrow: false, color: 'text-red-400' },
                      { text: '↓', arrow: true },
                      { text: 'Opacity slider to reduce damage', arrow: false, color: 'text-red-400' },
                    ].map((row, i) => (
                      <div key={i} className={`${row.arrow ? 'text-center text-gray-600' : row.color}`}>{row.text}</div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">raw2hdr path</div>
                  <div className="font-mono text-xs space-y-1 text-gray-400">
                    {[
                      { text: 'RAW file', arrow: false, color: '' },
                      { text: '↓', arrow: true },
                      { text: 'Neutral linear decode', arrow: false, color: '' },
                      { text: '↓', arrow: true },
                      { text: 'Synthesise correct log signal', arrow: false, color: 'text-emerald-400' },
                      { text: '↓', arrow: true },
                      { text: 'LUT receives expected input', arrow: false, color: 'text-emerald-400' },
                      { text: '↓', arrow: true },
                      { text: 'HDR encode', arrow: false, color: '' },
                    ].map((row, i) => (
                      <div key={i} className={`${row.arrow ? 'text-center text-gray-600' : row.color}`}>{row.text}</div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-3"><strong className="text-white">The double colour science problem.</strong> When a LUT runs on an already-rendered sRGB image, two successive non-linear curves operate on the same tonal data. The camera already applied its S-curve — compressing highlights, lifting shadows, adjusting saturation. The LUT then applies its own S-curve on top. Highlights that were near-white in the sRGB image get compressed again and clip. Shadows that were already lifted get further manipulated. Colours drift in two directions at once.</p>

              <div className="mt-3 rounded-xl overflow-hidden border border-zinc-700">
                <div className="grid grid-cols-2 divide-x divide-zinc-700">
                  <div className="p-4 space-y-2.5">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-orange-400 mb-1">LUT as overlay — trade-offs</div>
                    {[
                      { pro: true,  text: 'Works on any image, including JPEG' },
                      { pro: true,  text: 'Fast — no RAW required' },
                      { pro: true,  text: 'Easy to implement in any app' },
                      { pro: false, text: 'LUT receives wrong input signal' },
                      { pro: false, text: 'Camera curve + LUT curve double-stack' },
                      { pro: false, text: 'Highlights clip from two compressions' },
                      { pro: false, text: 'Colour banding on 8-bit quantized data' },
                      { pro: false, text: 'Opacity slider needed to control damage' },
                      { pro: false, text: 'Different cameras produce different results' },
                    ].map((r, i) => (
                      <div key={i} className="flex gap-2 text-xs text-gray-400">
                        <span className={`flex-shrink-0 ${r.pro ? 'text-emerald-400' : 'text-red-400'}`}>{r.pro ? '+' : '−'}</span>
                        <span>{r.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-teal-400 mb-1">Correct log input — trade-offs</div>
                    {[
                      { pro: true,  text: 'LUT receives the signal it was designed for' },
                      { pro: true,  text: 'No double colour science stacking' },
                      { pro: true,  text: 'Consistent results across every camera' },
                      { pro: true,  text: 'Highlights preserved from linear source data' },
                      { pro: true,  text: 'No opacity workaround needed' },
                      { pro: false, text: 'Requires the original RAW file' },
                      { pro: false, text: 'More computationally intensive' },
                    ].map((r, i) => (
                      <div key={i} className="flex gap-2 text-xs text-gray-400">
                        <span className={`flex-shrink-0 ${r.pro ? 'text-emerald-400' : 'text-red-400'}`}>{r.pro ? '+' : '−'}</span>
                        <span>{r.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">The opacity slider is not a creative tool. It exists because the output of applying a LUT to a pre-rendered image is routinely too strong, too saturated, or incorrectly toned — and blending back toward the ungraded image is the only available correction. In raw2hdr there is no opacity slider for LUT strength because the LUT is applied to the correct input; the result is what the LUT was designed to produce at full strength.</p>
            </DetailsPanel>

            <DetailsPanel title="Why wrong input encoding is unrecoverable in 3D colour" accent="border-teal-500/20">
              <p>A 3D LUT is a three-dimensional lookup table — typically a 33×33×33 grid of RGB output values. When a pixel with RGB values (R, G, B) enters the LUT, those three values serve as coordinates that identify a specific position inside the 3D cube. The eight nearest grid vertices are found, and the output is computed by trilinear interpolation between them.</p>
              <p>If the input signal is in the wrong encoding — say V-Log when the LUT expects F-Log2 — every pixel's RGB coordinates are wrong. The LUT is being indexed at the wrong position in three dimensions simultaneously. The output will exist (the LUT always produces a value for any input coordinate), but it will be wrong in every dimension: wrong tonality, wrong contrast, wrong colours. There is no "close enough" in 3D colour science; a wrong input encoding propagates through the entire 3D table in a non-recoverable way.</p>
              <p>This is why a Leica RAW file cannot be meaningfully processed through a Fujifilm LUT in any traditional workflow. The Leica's native log encoding and the Fujifilm LUT's expected input encoding are different at every point in the tonal range. raw2hdr sidesteps this by synthesising the exact expected encoding from the universal linear baseline.</p>
            </DetailsPanel>

            <DetailsPanel title="The empirical calibration methodology" accent="border-teal-500/20">
              <p>The parameters governing each synthetic log encode are determined <em>empirically</em>, not theoretically. The procedure: shoot a controlled scene — grey card, colour checker, neutral-lit subjects — on each target camera at base ISO. Decode the RAW through the universal demosaic to obtain the neutral linear baseline. Apply the synthetic log encode with initial parameters and compare the result to the camera's own straight-out-of-camera JPEG.</p>
              <p>Iteratively adjust the exposure scale, log midpoint placement, tonal contrast factor, and per-channel colour balance gains until the synthetic encode and the SOOC JPEG match as closely as possible across the full tonal range — <em>with no LUT applied</em>. The goal is perceptual alignment of tonality, midtones, and colour balance before any creative rendering.</p>
              <p>Because calibration is done against the SOOC JPEG rather than against theoretical log curves, the synthetic encode absorbs any idiosyncratic offset that the manufacturer baked into their camera's RAW-to-log pipeline. The result is that when a LUT designed for that manufacturer is applied, it performs the same creative transform it was designed to perform — just supplied from a universally-consistent source rather than from a camera-native encoded signal.</p>
              <p>This is why the cross-manufacturer compatibility is genuinely useful, not approximate: the calibration process bridges the gap between the theoretical log curve and the practical camera rendering, ensuring the LUT's intent is faithfully expressed regardless of which camera captured the source RAW.</p>
            </DetailsPanel>

            <DetailsPanel title="How this differs from calibration spiders and ICC colour checker workflows" accent="border-teal-500/20">
              <p>There are three distinct calibration problems in photography. Each answers a different question:</p>

              <div className="mt-3 grid gap-3">
                {([
                  {
                    label: 'Display spider (colorimeter)',
                    q: 'Does my monitor emit the right light?',
                    how: 'Measures actual panel output against known patches. Correction applied as an ICC display profile.',
                    target: 'Physical display output',
                    color: 'border-blue-500/20 bg-blue-500/5',
                    tag: 'text-blue-400',
                  },
                  {
                    label: 'ICC colour checker',
                    q: 'Does my camera capture physically accurate colours?',
                    how: 'Maps camera sensor response to CIE XYZ via a shot colour chart. Saved as a DNG Camera Profile.',
                    target: 'Physical colour truth',
                    color: 'border-violet-500/20 bg-violet-500/5',
                    tag: 'text-violet-400',
                  },
                  {
                    label: 'raw2hdr log calibration',
                    q: 'Does my synthetic log signal match what the LUT expects?',
                    how: "Matches synthesised log encode to the manufacturer's SOOC JPEG across the full tonal range, absorbing firmware-level offsets.",
                    target: 'LUT input fidelity',
                    color: 'border-teal-500/20 bg-teal-500/5',
                    tag: 'text-teal-400',
                  },
                ] as { label: string; q: string; how: string; target: string; color: string; tag: string }[]).map((item, i) => (
                  <div key={i} className={`rounded-xl border p-4 space-y-1.5 ${item.color}`}>
                    <div className={`text-[10px] font-mono uppercase tracking-widest ${item.tag}`}>{item.label}</div>
                    <div className="text-xs font-semibold text-white">{item.q}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{item.how}</div>
                    <div className="text-[10px] text-gray-500">Target: <span className="text-gray-300">{item.target}</span></div>
                  </div>
                ))}
              </div>

              <p className="mt-4"><strong className="text-white">What about cross-camera ICC profiling?</strong> A more sophisticated use of ICC — shoot a Leica with a colour checker, get its ICC profile, then use a Fujifilm ICC profile as a source to build a Fujifilm-to-Leica colour transform. In theory this makes Fujifilm RAW files render with Leica's colour response. This is a real technique and it does achieve physical colour matching.</p>

              <p className="mt-2">But to understand why it still falls short for LUTs, it helps to understand what a colour checker profile physically is — and what it was never measured from.</p>

              <div className="mt-3 rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 space-y-3 text-xs text-gray-400">
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">What a colour checker profile actually measures</div>
                <p>A colour checker has ~24 reflective patches with known spectral values — all mid-tone, all within the camera's linear response range. Shot at one ISO, one white balance, one illuminant. The software builds a linear 3×3 matrix: <span className="text-white">camera RGB → CIE XYZ</span> for those tonal levels, under those conditions.</p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {([
                    { label: 'Tonal range sampled', val: 'Mid-tones only', bad: true },
                    { label: 'Highlights measured', val: 'None — patches top out at ~90% reflectance', bad: true },
                    { label: 'Deep shadows measured', val: 'None — below ~3% reflectance', bad: true },
                    { label: 'Transform type', val: 'Linear 3×3 matrix', bad: false },
                    { label: 'ISO dependency', val: 'Valid at one ISO only', bad: true },
                    { label: 'Illuminant dependency', val: 'Valid under one light only', bad: true },
                  ] as { label: string; val: string; bad: boolean }[]).map((r, i) => (
                    <div key={i} className="rounded-lg bg-black/30 border border-zinc-800 p-2.5 space-y-0.5">
                      <div className="text-[10px] text-gray-500">{r.label}</div>
                      <div className={r.bad ? 'text-red-400' : 'text-gray-300'}>{r.val}</div>
                    </div>
                  ))}
                </div>
                <p>Because the profile is a linear extrapolation from mid-tone patches, applying it to highlights means applying a relationship that was never measured there. The camera's actual behaviour in highlights — where the sensor begins to saturate, how it rolls off, whether colour shifts occur — is invisible to the profile. Same for deep shadows, where noise and dark current dominate.</p>
              </div>

              <p className="mt-3">LUTs encode the full non-linear tonal behaviour — built from real footage across the entire signal range, not a sparse mid-tone sample. Velvia's highlight rolloff and shadow saturation are not derivable from a colour matrix. They were measured and encoded across the whole tonal range deliberately.</p>

              <div className="mt-3 rounded-xl overflow-hidden border border-zinc-700">
                <div className="grid grid-cols-2 divide-x divide-zinc-700">
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-violet-400 mb-1">ICC cross-profile captures</div>
                    {[
                      'Linear colour matrix (sensor → CIE XYZ)',
                      'White point under measured illuminant',
                      'Mid-tone colour accuracy vs physical reference',
                    ].map((s, i) => <div key={i} className="flex gap-2 text-xs text-gray-400"><span className="text-violet-400 flex-shrink-0">·</span><span>{s}</span></div>)}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-red-400 mb-1">ICC cross-profile cannot capture</div>
                    {[
                      'Non-linear highlight rolloff and shadow behaviour',
                      'Tonal contrast shape across the full signal range',
                      'Intentional colour shifts at high and low luminance',
                      'Any behaviour outside the mid-tone patch range',
                    ].map((s, i) => <div key={i} className="flex gap-2 text-xs text-gray-400"><span className="text-red-400 flex-shrink-0">·</span><span>{s}</span></div>)}
                  </div>
                </div>
              </div>

              <p className="mt-3">Cross-profiling a Sony to match Fujifilm colours exactly still leaves the tonal contract wrong. Eterna's desaturated skin tones are not a white point offset. Velvia's saturated greens are not a matrix entry. They are non-linear rendering decisions baked across the entire signal range — and the LUT expects its input to carry that same shape.</p>

              <div className="mt-3 p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
                <p className="text-sm"><strong className="text-white">The goal of raw2hdr's calibration:</strong> ensure the synthesised log signal is indistinguishable — from the LUT's perspective — from what the manufacturer's own pipeline would have produced. Not physical accuracy. Not colour matching. <em>LUT input fidelity</em> — so a Fujifilm PROVIA LUT produces PROVIA-looking results from any camera.</p>
              </div>
            </DetailsPanel>
          </Section>

          {/* ─── 05 ─── */}
          <Section id="hdr-lut" number="05" icon={<Zap className="w-5 h-5 text-yellow-400" />}
            accentColor="bg-yellow-500/10" gradientFrom="from-yellow-300"
            title="The HDR LUT Problem" subtitle="Recovering the highlights that SDR LUTs silently discard">
            <p>All commercially distributed film simulation LUTs produce <strong className="text-white">8-bit SDR output</strong>. Their maximum value is display white — anything brighter is clipped. The scene-linear values above SDR white were never discarded in raw2hdr; they flow through the pipeline in parallel with the log-encoded signal.</p>

            <DetailsPanel title="Reframing: SDR output as scene intent, not display output" accent="border-yellow-500/20">
              <p>raw2hdr resolves the HDR-from-SDR-LUT problem by treating the LUT's SDR output not as a final display-referred result, but as a <strong className="text-white">compressed statement of the photographer's tonal and colour intent</strong> — one that happens to be expressed in a range too narrow to contain all the scene's luminance information.</p>
              <p>The mathematical insight: a pixel at SDR white in the LUT output does not mean "this is the brightest displayable value." It means "this is the boundary of the LUT's range." The scene-linear value at that pixel might have been 1.5× scene white, or 3×, or 8×. The LUT silently clamped those values because it had nowhere to put them.</p>
              <p>But crucially — in this pipeline, the original scene-linear value was never discarded. It was carried through the pipeline in parallel with the log-encoded signal that was fed into the LUT. The scene still knows how bright those pixels actually were. The LUT merely didn't have the dynamic range to express it.</p>
            </DetailsPanel>

            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-4">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Highlight Recovery — 3 Steps</div>
              {[
                { num: '1', step: 'Linearize LUT output', desc: 'Reverse the LUT output gamma to recover linear-light representation across the full tonal range.', color: 'text-blue-400 border-blue-500/30' },
                { num: '2', step: 'Extend highlights with logarithmic rolloff', desc: 'Pixels above SDR white are smoothly compressed — each stop brighter gets a progressively smaller boost, mirroring film shoulder rolloff rather than clipping.', color: 'text-yellow-400 border-yellow-500/30' },
                { num: '3', step: 'Encode to HDR', desc: 'The extended linear range is encoded into the HDR output file. SDR content maps to the lower signal range; recovered highlights occupy the upper headroom.', color: 'text-emerald-400 border-emerald-500/30' },
              ].map((item) => (
                <div key={item.num} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border ${item.color} text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-mono`}>{item.num}</div>
                  <div>
                    <div className={`text-sm font-bold ${item.color.split(' ')[0]}`}>{item.step}</div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <DetailsPanel title="The soft logarithmic highlight extension — how it works" accent="border-yellow-500/20">
              <p>After the 3D LUT produces its SDR-encoded result, the pipeline linearises the LUT output — removing the sRGB gamma encoding to recover linear-light representation of all values below SDR white. This step restores full floating-point precision to the sub-white tonal range, reversing the compression that the LUT's output gamma applied.</p>
              <p>For pixels where the original scene-linear value was above SDR white, the pipeline applies a soft logarithmic extension. Each stop of scene luminance above SDR white receives a progressively smaller boost. This rolloff is not a hard clip and not a linear stretch — it is a smooth compression curve that mirrors the shoulder characteristic of photographic film.</p>
              <p>The visual effect: "bright" reads as genuinely bright; "brilliant specular" reads as something distinctly more intense; but neither ever becomes a harsh edge or an abrupt cutoff. The transition from SDR-range content into the HDR extension region is perceptually seamless, because the logarithmic compression matches how human vision perceives brightness differences at high luminance levels.</p>
            </DetailsPanel>

            <Callout variant="info">
              <strong>On SDR displays:</strong> HLG degrades gracefully. The 25% HDR extension maps to display white and above — SDR displays simply ignore it. The remaining 75% renders as a perfectly-exposed SDR image. No separate SDR export needed.
            </Callout>

            <DetailsPanel title="What recovered highlights look like on real displays" accent="border-yellow-500/20">
              <p>On an HDR display — any current iPhone Pro model, iPad Pro with XDR display, Apple ProDisplay XDR — the recovered highlights render with genuine physical luminance. A blown sky becomes a luminous sky with perceptible gradation. A specular highlight on a surface has presence and intensity that SDR cannot reproduce. The difference is not subtle on a capable display; it is the defining perceptual characteristic of HDR photography.</p>
              <p>On an SDR display, the same HLG HEIC file degrades gracefully. The HDR extension region maps to display white and above, which an SDR display simply ignores. The remaining ~75% of the signal renders identically to a well-exposed SDR image. No adaptation or separate SDR fallback export is needed.</p>
            </DetailsPanel>

          </Section>

          {/* ─── 06 ─── */}
          <Section id="gainmap" number="06" icon={<Triangle className="w-5 h-5 text-orange-400" />}
            accentColor="bg-orange-500/10" gradientFrom="from-orange-300"
            title="SDR + Gain Map vs. Raw-Native HDR" subtitle="Seven fundamental problems with compositing two separately-rendered sources">
            <p>The gain map approach — Apple HEIC gain map, Google Ultra HDR — composites an 8-bit JPEG base with a secondary brightness-boost map. When both layers come from a unified pipeline (as in iPhone Photonic Engine) this works. The problems arise when the layers are rendered independently.</p>
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
              <div className="grid grid-cols-3 bg-zinc-900 px-4 py-3 border-b border-zinc-800 text-xs font-mono uppercase tracking-widest">
                <div className="text-gray-500">Problem</div>
                <div className="text-gray-400">SOOC JPEG + Gain Map</div>
                <div className="text-blue-400">raw2hdr Single-Pass HLG</div>
              </div>
              {[
                ['Colour science', 'Two pipelines: camera creative engine + RAW linear. Highlight colour shaped by manufacturer profile.', 'One pipeline: RAW to HLG. Colour consistent through SDR and HDR range.'],
                ['Compression', 'JPEG DCT noise amplified by gain map multiplier. Smooth sky gradients develop block structure in HDR.', 'Floating-point throughout. No JPEG step in the pipeline.'],
                ['Spatial resolution', 'Gain map stored at 1/4-1/8 scale, upsampled at display. Specular highlights and catchlights blurred.', 'Per-pixel exact at full resolution. No upsampling.'],
                ['NR / sharpening', 'Gain map reintroduces RAW sensor noise onto NR-smoothed JPEG. Pre-sharpened edges amplified at HDR boost.', 'No NR or sharpening in pipeline. Clean linear data throughout.'],
                ['Lens correction', 'JPEG corrected; gain map from uncorrected RAW — spatial fringe at edges and corners.', 'Correction applied once in linear light before HDR extension. No mismatch.'],
                ['Vignetting', 'In-camera vignetting correction on JPEG + uncorrected gain map — corners are over-boosted.', 'Vignetting corrected in linear light, same coordinate space as HDR extension.'],
                ['Grading / LUT', 'Applying a grade invalidates the gain map. Requires full recomputation from RAW.', 'LUT is the first pipeline step. System is always self-consistent.'],
              ].map(([label, a, b], i) => (
                <div key={i} className={`grid grid-cols-3 px-4 py-3 border-b border-zinc-800/50 last:border-0 text-xs ${i % 2 === 0 ? 'bg-black/20' : ''}`}>
                  <div className="text-gray-500 leading-relaxed pr-2">{label}</div>
                  <div className="text-gray-400 leading-relaxed pr-2">{a}</div>
                  <div className="text-blue-300 leading-relaxed">{b}</div>
                </div>
              ))}
            </div>

            <div className="text-xs font-mono text-gray-600 uppercase tracking-widest pt-2">Expand each problem for the full technical explanation</div>

            <DetailsPanel title="Problem 1: Two-pipeline colour science discontinuity" accent="border-orange-500/20">
              <p>The SOOC JPEG carries the camera's entire proprietary rendering stack applied sequentially: sensor linearisation, camera-specific colour matrix (often updated per firmware revision, tuned under controlled illuminants), spatially-adaptive multi-pass noise reduction that smooths chroma noise aggressively while preserving luminance edges, unsharp masking, the manufacturer's proprietary highlight rolloff and shadow tone curves, picture profile encoding (Film Simulation, Picture Style, Picture Control), and finally sRGB gamma.</p>
              <p>Each step modifies the pixel values in ways that have no systematic inverse. The colour matrix transforms the gamut. The NR removes high-frequency texture. The sharpening adds synthetic edge contrast. The tone curves non-linearly reshape the tonal distribution. The picture profile applies a 3D colour transform across the entire signal range.</p>
              <p>The RAW-derived gain map is computed from linear sensor data that passed through <strong className="text-white">none</strong> of this. The gain map represents the physical scene luminance ratio between extended range and SDR white. The SOOC JPEG represents the manufacturer's creative and technical interpretation of that scene. These two representations disagree at every pixel where the camera's tone operator made a decision.</p>
              <p><strong className="text-white">Consider a bright sky:</strong> The camera's highlight tone curve rolls off the sky from clipping, placing it at ~90% of SDR white in the JPEG. The scene-linear value at those same pixels might be 3× scene white. The gain map computes a 1.74-stop boost for those pixels. On an HDR display, the reconstruction produces the right <em>luminance</em>. But the <em>colour</em> of that reconstructed HDR sky is determined by whatever hue the JPEG's colour matrix and picture profile assigned to it — not by the physical spectral content. If the Film Simulation shifted that sky toward cool cyan (as some do), the gain map amplifies that creatively-shifted cyan into the HDR extension region. The sky glows at the correct luminance but in a colour that carries the JPEG's creative interpretation into the HDR domain.</p>
              <p>In raw2hdr, the LUT's colour decision for the sky is made once, in one consistent mathematical framework, and that same decision extends into the HDR range through the same computation. The SDR rendering and the HDR extension are not two separately-computed things that need to match — they are two parts of the same single-pass output.</p>
            </DetailsPanel>

            <DetailsPanel title="Problem 2: JPEG compression artifacts amplified in HDR" accent="border-orange-500/20">
              <p>JPEG encoding divides the image into 8×8 pixel blocks and applies a discrete cosine transform (DCT) to each block independently. The DCT coefficients are then quantised to integer values — the step that causes irreversible information loss. In smooth areas — sky gradients, out-of-focus backgrounds, plain walls, subtle shadow gradients — this quantisation produces two types of artifact: rounding noise within each block from the integer quantisation of DCT coefficients, and block boundary discontinuities where adjacent 8×8 regions have slightly different DC offset values.</p>
              <p>These artifacts are often below the threshold of visibility in the SDR base image. But the gain map <em>multiplies</em> each pixel's luminance. In a sky region where the map instructs a 2× brightness boost for HDR rendering, the multiplicative operation amplifies the JPEG's DCT noise by the same factor. A smooth, continuous blue sky gradient in SDR becomes a bright blue sky with subtle rectangular tiling structure in the HDR reconstruction — precisely the opposite of what high-quality HDR imagery should look like.</p>
              <p>raw2hdr operates on uncompressed floating-point pixel data from RAW decode through to the final HEIC encode. No JPEG compression step occurs anywhere in the pipeline. A smooth gradient in the input produces a numerically smooth gradient in the output.</p>
            </DetailsPanel>

            <DetailsPanel title="Problem 3: Gain map spatial resolution and upsampling" accent="border-orange-500/20">
              <p>Gain maps are stored at sub-resolution — typically one-quarter or one-eighth of the primary image dimensions in each direction — to keep file sizes manageable. The full-resolution HDR map is reconstructed at decode time through bilinear upsampling.</p>
              <p>This means the gain map is inherently a low-spatial-frequency field. It can represent large-area luminance differences — a bright sky region versus a darker foreground, a lamp versus a wall — but it cannot accurately represent high-frequency HDR content at pixel scale:</p>
              <ul className="space-y-1.5 pl-4">
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span><span><strong className="text-white">Specular highlights on surfaces</strong> — sharp, isolated bright clusters of a few pixels</span></li>
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span><span><strong className="text-white">Eye catchlights</strong> — often one or two pixels at 3–5× scene white that define the life in a portrait</span></li>
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span><span><strong className="text-white">Christmas lights, city lights at distance, bokeh highlight cores</strong></span></li>
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span><span><strong className="text-white">Lens flare streaks and sun stars</strong> with fine radial structure</span></li>
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span><span><strong className="text-white">Water surface sparkle</strong> — individual specular reflections at high intensity</span></li>
              </ul>
              <p>For all of these, the upsampled gain map distributes the HDR boost over a softened neighbourhood around the true position. A catchlight that should be a brilliant pinpoint becomes a soft glow centred approximately at the right location. The spatial precision that makes these elements visually compelling — the "micro-contrast" of HDR — is lost to the upsampling blur.</p>
              <p>raw2hdr computes the HDR extension independently for every single pixel based on that pixel's own scene-linear luminance value. There is no spatial averaging, no blur, no upsampling. A two-pixel specular at 5× scene white receives the correct logarithmic extension for those exact two pixels only. The HDR rendering is full-resolution by construction.</p>
            </DetailsPanel>

            <DetailsPanel title="Problem 4: In-camera noise reduction conflicts with the RAW gain map" accent="border-orange-500/20">
              <p>At ISO 1600 and above, in-camera noise reduction becomes visually significant. The SOOC JPEG at high ISO has smooth, processed shadows and midtones where the camera's multi-pass NR has replaced sensor noise with interpolated smooth values — a deliberate and generally desirable aesthetic choice that the camera's engineering team tuned for years.</p>
              <p>The gain map, derived from the unprocessed RAW, contains the original sensor noise. In shadow areas where the gain map value is small (SDR and HDR shadow levels are approximately equal), the RAW noise is encoded as fine spatial variation in the gain map values. When applied to the already-smooth NR'd JPEG shadows, this variation reintroduces luminance texture that is:</p>
              <ul className="space-y-1.5 pl-4">
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span><span>Not resolved photographic detail (the NR removed that)</span></li>
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span><span>Not authentic film grain (it is a gain-map-warped version of the RAW sensor noise pattern)</span></li>
                <li className="flex gap-2"><span className="text-orange-400 mt-0.5">•</span><span>Not spatially coherent with the JPEG's block structure</span></li>
              </ul>
              <p>The result in shadow and lower-midtone regions is a heterogeneous artifact that looks like neither the clean NR'd JPEG nor like intentional grain. It is specifically an artifact of the two-pipeline mismatch.</p>
              <p>raw2hdr's noise characteristics are determined entirely by the native RAW decoder, which applies its own quality-level NR during demosaic. If the user adds film grain via the creative effects system, that grain is a deliberate procedurally-generated texture applied at a known intensity to the final HLG pixel buffer. There is no accidental noise reinjection from pipeline mismatch.</p>
            </DetailsPanel>

            <DetailsPanel title="Problem 5: Creative grading after the fact breaks the gain map" accent="border-orange-500/20">
              <p>If a photographer wants to apply a colour grade — a LUT, an exposure adjustment, a colour curve — to a SOOC JPEG + gain map image:</p>
              <p>First, the grade operates on the 8-bit JPEG base layer — immediately truncating to 8-bit precision for all subsequent operations. Second, the gain map was computed relative to the <strong className="text-white">ungraded</strong> JPEG. Every tone the grading operation moves changes the luminance values in the base image, which means the gain map values no longer correctly represent the ratio between SDR and HDR luminance at those pixels. Third, correcting this requires recomputing the gain map against the graded JPEG, which in turn requires access to both the original RAW and a pipeline capable of aligning all three layers simultaneously.</p>
              <p>No standard consumer or prosumer software handles this three-way recomputation. In practice, the gain map becomes permanently inconsistent with the graded base the moment any non-identity tone operation is applied.</p>
              <p>In raw2hdr, the LUT choice is the first decision in the pipeline. The creative rendering, the HDR extension, and the final encode are all computed together in one unified pass. Changing the LUT re-runs the complete pipeline from linear RAW data. There is no "stale secondary layer" to reconcile because there is no secondary layer.</p>
            </DetailsPanel>

            <DetailsPanel title="Problem 6: In-camera sharpening amplification at edges" accent="border-orange-500/20">
              <p>SOOC JPEGs include sharpening — a spatial high-pass filter that increases local contrast at edges and fine texture. The sharpening is calibrated by the camera manufacturer to look correct at SDR display white.</p>
              <p>When the gain map multiplies an already-sharpened edge by the HDR boost factor, the edge becomes more contrasty than the scene's physical content justifies. Luminance halos around subjects and fine detail are a well-documented HDR rendering artifact, and pre-sharpened source material makes them substantially worse in any gain-map reconstruction. The halos that were invisible at SDR white become bright, visible ringing artifacts when amplified into the HDR extension range.</p>
              <p>raw2hdr's RAW decoder outputs unsharpened linear data. The HDR extension at edges reflects actual scene edge contrast, not enhancement that the camera pre-applied.</p>
            </DetailsPanel>

            <DetailsPanel title="Problem 7: Lens correction spatial misalignment" accent="border-orange-500/20">
              <p>Modern cameras apply lens corrections in-camera before writing the SOOC JPEG. These corrections include geometric distortion correction (straightening barrel or pincushion distortion), vignetting correction (brightening corners), and sometimes chromatic aberration correction. The corrections are applied by the camera's ISP using lens profile data stored in firmware.</p>
              <p>The RAW file stores the <strong className="text-white">uncorrected</strong> sensor data — with barrel distortion pulling edge pixels outward, with vignetting darkening corners, with chromatic fringing at high-contrast edges. When a gain map is computed from this uncorrected RAW data, its pixel positions correspond to the uncorrected sensor geometry.</p>
              <p>When that gain map is applied to the geometrically-corrected SOOC JPEG, the spatial correspondence between gain map pixels and JPEG pixels is systematically wrong. The error is small near the image centre (where distortion displaces pixels by only a few pixels) and grows progressively toward the corners (where barrel distortion can displace pixels by 2–5% of image width). The result is a spatial fringe artifact: at image corners and edges, the HDR boost is applied at the wrong pixel position.</p>
              <p><strong className="text-white">Vignetting compounds the problem:</strong> The SOOC JPEG has had its corners brightened by in-camera vignetting correction. The gain map was computed from the uncorrected RAW where corners are darker. The gain map therefore sees a large luminance difference between RAW corners (dark, uncorrected) and JPEG corners (bright, corrected) and encodes a large positive gain value for those pixels. When applied to the already-brightened JPEG corners, this <em>over-boosts</em> the corners in the HDR reconstruction — creating a brightness inversion at the frame edges where corners become disproportionately bright rather than neutral.</p>
              <p>In raw2hdr, lens correction is applied at the linear-light stage, before log encoding, before LUT application, and before HDR extension. Geometric correction, vignetting correction, and chromatic aberration correction all operate on the same uncompressed floating-point pixel buffer in the same coordinate system. There is no mismatch because correction and HDR extension are computed in the same pipeline, on the same data, at the same resolution.</p>
            </DetailsPanel>

            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-5 space-y-3">
              <div className="text-sm font-bold text-emerald-300">Where SOOC + Gain Map genuinely wins</div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span>
                  <span><strong className="text-white">Camera-native rendering is the artistic target:</strong> If the photographer specifically wants the camera's JPEG colour science and only wants to add HDR highlight recovery on top of it, the gain map correctly extends highlights while preserving the camera's rendering below SDR white. For photographers who love their camera's JPEG look but want HDR capability, this is a valid and coherent workflow.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span>
                  <span><strong className="text-white">RAW file no longer available:</strong> When only the SOOC JPEG exists and HDR reconstruction is still desired, a gain map estimated from luminance analysis of the JPEG itself is the only available path. This is a real use case for archival images and shared JPEGs.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span>
                  <span><strong className="text-white">Cross-platform sharing:</strong> Google Ultra HDR JPEG is specifically designed for broad compatibility across non-Apple hardware that may not support HEIC HDR. For photographers distributing to mixed ecosystems, the format compatibility argument is real.</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 pt-1">raw2hdr makes a different trade-off: full pipeline control, mathematical consistency, and per-pixel spatial precision — in exchange for requiring the original RAW file. Since raw2hdr is a RAW processing application, the RAW is always available.</p>
            </div>
          </Section>

          {/* ─── 07 ─── */}
          <Section id="tiff" number="07" icon={<FileImage className="w-5 h-5 text-amber-400" />}
            accentColor="bg-amber-500/10" gradientFrom="from-amber-300"
            title="Why 16-bit TIFF, PSD, and DNG Don't Solve the HDR Problem" subtitle="Bit depth alone is not enough — the format, the transfer function, and OS support must all align">

            <p>A natural question: if the problem is 8-bit precision, why not use a 16-bit file format? TIFF supports 16-bit per channel. PSD supports 16-bit and 32-bit modes. DNG stores the full-depth sensor data. These formats genuinely carry more data. So where does the dynamic range go?</p>

            <p><strong className="text-white">Bit depth and dynamic range are not the same thing.</strong> Bit depth determines how many tonal steps exist between the darkest and brightest values a format can represent. Dynamic range determines what those darkest and brightest values actually mean on a display. A 16-bit TIFF has 65,536 steps per channel — an enormous amount of tonal precision. But every one of those steps lives within the SDR luminance range: from display black to display reference white. No value in the file means "brighter than white." The extra bits buy extraordinarily smooth gradients within that SDR window, but they do not extend the window itself.</p>

            <p><strong className="text-white">The constraint is the transfer function, not the bit depth.</strong> TIFF and PSD files carry ICC colour profiles describing their colour space — sRGB, Adobe RGB, ProPhoto RGB, Display P3. Every one uses an SDR transfer function. The transfer function tells the display how to map code values to physical luminance. An SDR transfer function maps its maximum code value to SDR reference white — and nothing more. There is no value in the ICC vocabulary that means "render this pixel above reference white at extended luminance."</p>

            <p><strong className="text-white">Even on an XDR or P3 display, SDR files render at SDR brightness.</strong> When iOS or macOS opens a 16-bit TIFF with a Display P3 ICC profile, the OS correctly uses the P3 colour gamut and preserves the 16-bit precision — but renders the content at SDR luminance. The Extended Dynamic Range rendering path is never activated because the file's ICC profile contains no instruction to trigger it. Reference white stays at the SDR brightness level. The display is physically capable of much more, but the file format gave it no instruction to use that capability.</p>

            <p>This is the critical distinction: HEIC with BT.2100 HLG uses a completely different colour space descriptor — not an ICC profile, but an NCLX colour description specifying BT.2020 primaries and the HLG transfer function. When the OS reads this, it recognises the HDR transfer function and activates the EDR rendering path. Now values above HLG reference white are rendered at genuine extended luminance on capable hardware. The display is being told, through the file format itself, to use its full brightness range.</p>

            <p>The paradox is real: a 10-bit HEIC with HLG produces a wider visible dynamic range on an HDR display than a 16-bit TIFF, despite fewer bits of precision. The TIFF has more steps but they are all confined within the SDR brightness window. The HLG HEIC has fewer steps but they span a luminance range that includes genuine highlights above reference white — the region where HDR displays physically emit more light.</p>

            <TiffVsHeicChart />

            <p>The deeper issue is not just display rendering. The formats most people reach for when they want "more quality" — TIFF, PSD, DNG — were designed for SDR delivery or camera archival. None of them carry a transfer function the OS can interpret as HDR:</p>

            <FormatComparisonTable />

            <DetailsPanel title="Why every ICC-based format — 8-bit or 16-bit — outputs SDR" accent="border-red-500/20">
              <p>This is not specific to TIFF. JPEG, PNG, PSD, and DNG all share the same root cause: they describe colour using ICC profiles, and the classic ICC framework was designed for SDR reproduction. Whether the file is 8-bit or 32-bit float makes no difference — ICC profiles define a white point, and every code value in the file is mapped relative to that white point as the ceiling. More bits buys more precision between black and white; it does not raise white.</p>
              <p className="mt-2">A 32-bit linear ProPhoto RGB TIFF has exceptional precision and an extraordinarily wide colour gamut — but its maximum code value still maps to display reference white. The ICC spec has no mechanism in its classic form to say "render this pixel <em>brighter</em> than reference white." The render chain is the same at every bit depth:</p>
              <div className="mt-3 p-4 rounded-xl bg-black/40 border border-zinc-800 font-mono text-xs text-gray-400">
                {([
                  { sym: '', text: 'Any ICC-profiled file opened in macOS Preview / Lightroom / iOS Photos', indent: false },
                  { sym: '↓', text: '', indent: false },
                  { sym: '', text: 'Viewer reads embedded ICC profile (e.g. "Adobe RGB (1998)", "Display P3")', indent: false },
                  { sym: '↓', text: '', indent: false },
                  { sym: '', text: 'ICC color management applies rendering intent', indent: true },
                  { sym: '', text: 'ICC white point mapped to display reference white', indent: true },
                  { sym: '', text: 'Max code value → display white, regardless of scene luminance or bit depth', indent: true },
                  { sym: '↓', text: '', indent: false },
                  { sym: '', text: 'Converted to display color space · rendered at SDR brightness', indent: false },
                  { sym: '↓', text: '', indent: false },
                  { sym: '✗', text: 'Highlight headroom above scene white: invisible on every ICC format', indent: false },
                  { sym: '', text: 'Data is in the file — unread, uncorrupted, unrendered', indent: false },
                ] as { sym: string; text: string; indent: boolean }[]).map(({ sym, text, indent }, i) =>
                  sym === '↓' ? (
                    <div key={i} className="flex gap-3 text-gray-600">
                      <span className="w-4 flex-shrink-0" />
                      <span className="flex-1 text-center">{sym}</span>
                    </div>
                  ) : (
                    <div key={i} className={`flex gap-3 ${sym === '✗' ? 'text-red-400' : ''} ${indent ? 'pl-4' : ''}`}>
                      <span className="w-4 flex-shrink-0 text-center">{sym}</span>
                      <span className="text-left">{text}</span>
                    </div>
                  )
                )}
              </div>
              <p className="mt-3"><strong className="text-white">The ceiling is set by the transfer function, not the number of bits.</strong> Increasing bit depth from 8 to 16 or 32 only subdivides the same SDR luminance window more finely. The ICC extension that <em>does</em> address this — iccMAX — is covered in the panel below. The practical problem with iccMAX is not the spec; it is adoption.</p>
            </DetailsPanel>

            <DetailsPanel title="iccMAX — the ICC answer to HDR, and why it doesn't help" accent="border-orange-500/20">
              <p>The ICC consortium recognised the luminance ceiling problem and published <strong className="text-white">iccMAX (ICC.2:2019)</strong> — an extended profile format that <em>can</em> express values above display reference white, supports float pixel storage, and is technically HDR-capable. So why doesn't the industry use it?</p>
              <p className="mt-2">The problem is entirely on the consumption side. macOS Preview, iOS Photos, Adobe Photoshop, Lightroom, and Capture One all have no iccMAX support — files are either refused outright or silently interpreted as sRGB. A format is only as useful as the viewers that implement it, and iccMAX has essentially zero consumer adoption a decade after publication.</p>
              <p className="mt-2">The industry concluded it was easier to move away from ICC for HDR delivery than to extend it. HEIC uses an NCLX colour descriptor (ITU-R BT.2100) that existing Apple OS decoders already understand. OpenEXR uses a scene-linear convention with no profile at all. iccMAX remains correct on paper and invisible in practice.</p>
            </DetailsPanel>

            <Callout variant="info">
              <strong>What about OpenEXR?</strong> OpenEXR was designed by VFX and cinema production to be scene-referred — values above 1.0 are naturally HDR highlights. Every major CGI film has passed through OpenEXR at some point in its pipeline. But OpenEXR has no support in iOS Photos, Android Gallery, Instagram, or any consumer viewer. It lives in the professional pipeline, not on anyone's phone. The precision is there; the delivery path is not.
            </Callout>

            <p>raw2hdr's output format is the intersection of three requirements: a transfer function the OS understands as HDR (HLG), a container that carries the non-ICC metadata describing it (HEIC with NCLX), and OS-level support on the target device. On iOS, all three align. That is why the same RAW file that looks flat as a TIFF or DNG can glow on an iPhone OLED screen as a raw2hdr HEIC.</p>
          </Section>

          {/* ─── 08 ─── */}
          <Section id="hlg" number="08" icon={<Monitor className="w-5 h-5 text-blue-400" />}
            accentColor="bg-blue-500/10" gradientFrom="from-blue-300"
            title="HLG Encoding" subtitle="Perceptual HDR without metadata fragility — the same file on every screen">
            <p>Two transfer functions dominate HDR: <strong className="text-white">PQ (SMPTE ST 2084)</strong> and <strong className="text-white">HLG (ITU-R BT.2100)</strong>. They represent fundamentally different philosophies.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2">
                <div className="text-xs font-mono text-red-400 uppercase tracking-widest">PQ (HDR10)</div>
                <ul className="text-sm text-gray-400 space-y-1.5">
                  <li>Encodes absolute nit values</li>
                  <li>Requires external metadata (MaxCLL/MaxFALL)</li>
                  <li>Without metadata: display guesses, often wrong</li>
                  <li>Designed for controlled cinema environments</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">HLG (BT.2100) — raw2hdr uses this</div>
                <ul className="text-sm text-gray-300 space-y-1.5">
                  <li>Encodes luminance relative to display white</li>
                  <li>Self-describing — no metadata required</li>
                  <li>Natively backwards-compatible with SDR displays</li>
                  <li>One file works correctly on every screen</li>
                </ul>
              </div>
            </div>

            <DetailsPanel title="Why PQ is fragile for user-generated photography" accent="border-blue-500/20">
              <p>PQ encodes absolute display luminance in candelas per square metre. A PQ signal value of 50% encodes a specific nit level regardless of the display it is shown on. This precision is valuable in controlled cinema post-production environments where the mastering display characteristics are known and the distribution chain is tightly managed.</p>
              <p>The cost is dependency: PQ content requires external metadata — static MaxCLL/MaxFALL values or frame-level dynamic metadata — to tell each display what the content's peak brightness is so it can tone-map correctly for its own capabilities. A 600-nit phone display and a 2000-nit reference monitor need different tone-map curves applied to the same PQ signal. Without that metadata correctly matching the content, PQ material either appears washed out (if the display assumes higher peak than the content) or crushes the highlights (if it assumes lower).</p>
              <p>For user-generated photographs shared casually across the full spectrum of viewer devices — iMessage, AirDrop, email, social platforms, cloud storage — from older SDR phones to ProDisplay XDR — this metadata dependency is a meaningful fragility. HLG's self-describing nature and SDR backward compatibility are decisive. The same HEIC file works correctly on every viewer. No version management, no SDR export, no metadata maintenance.</p>
            </DetailsPanel>

            <HlgSignalChart />
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-3">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">How the curve is shaped</div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <div><strong className="text-white">Shadows:</strong> The curve expands — fine tonal distinctions in dark areas are preserved with more detail than the eye would lose, so shadow gradients stay smooth and clean.</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <div><strong className="text-white">Highlights:</strong> The curve compresses — progressively more brightness maps into each step, mirroring how film shoulder rolloff and human vision both treat extreme brightness as diminishing returns.</div>
                </div>
              </div>
            </div>

            <DetailsPanel title="Why the two-segment design is what makes one file work on every screen" accent="border-blue-500/20">
              <p>The practical goal of HLG's transfer function design is simple: <strong className="text-white">a single exported photo that looks correct on a five-year-old SDR phone, a current iPhone OLED, and an Apple ProDisplay XDR — without any per-device version, tone mapping pass, or metadata dependency.</strong> The two-segment curve is the mechanism that achieves this.</p>

              <p>The curve is shaped to match how human eyes actually perceive differences in brightness. In shadows, our eyes are highly sensitive — small luminance changes read as distinct tonal steps. In bright highlights, our eyes compress — the difference between "bright" and "slightly brighter" is far less noticeable than the same absolute difference in the shadows. The HLG curve allocates encoding precision accordingly: generous resolution in shadows and midtones where it matters perceptually, progressively tighter compression in highlights where it matters less.</p>

              <p><strong className="text-white">The backward compatibility follows directly from this shape.</strong> Because reference white sits below the top of the signal range, an SDR display reading the file simply treats reference white as its maximum brightness — the upper portion of the signal that encodes HDR headroom maps to "at or above white," which the SDR display clips to white. The image doesn't look degraded; it looks like a correctly exposed photograph. No adaptation is required because the curve was designed so that the SDR portion of the signal is a valid, complete image on its own.</p>

              <p><strong className="text-white">On an HDR display, the upper portion activates.</strong> The OS recognises the HLG colour space descriptor, maps the extended signal range to physical luminance above SDR white, and the recovered highlights — sky gradations, specular reflections, light sources — render with genuine brightness. The same file, the same signal, interpreted differently by a capable display.</p>

              <p>This is the core reason raw2hdr chose HLG over PQ. PQ requires external metadata to tell each display how bright the content is — without it, tone mapping is a guess. HLG encodes the intent in the curve shape itself. The file carries its own display instructions, which is the only viable approach for photographs shared casually across every device a viewer might own.</p>
            </DetailsPanel>

            <DetailsPanel title="How HDR metadata is embedded — as identity, not a sidecar" accent="border-blue-500/20">
              <p>HEIC stores colour space information intrinsically as part of the image's data structure. When the HLG-encoded pixel buffer is assigned the BT.2100 HLG colour space before HEIC encoding, the container embeds the corresponding NCLX colour description box directly in the file:</p>
              <ul className="space-y-1.5 pl-4">
                <li className="flex gap-2"><span className="text-blue-400 mt-0.5">•</span><span><strong className="text-white">Colour primaries:</strong> BT.2020 (the wide-gamut primaries)</span></li>
                <li className="flex gap-2"><span className="text-blue-400 mt-0.5">•</span><span><strong className="text-white">Transfer characteristics:</strong> HLG (as distinct from sRGB gamma, PQ, or BT.2020's gamma 2.4)</span></li>
                <li className="flex gap-2"><span className="text-blue-400 mt-0.5">•</span><span><strong className="text-white">Matrix coefficients:</strong> BT.2020 non-constant luminance</span></li>
              </ul>
              <p>These three values are what iOS Photos, macOS Preview, Safari, and any HEIC-capable viewer read to determine: (a) the HDR rendering path should be activated, (b) the BT.2100 HLG tone curve should be applied to the signal, and (c) the HDR badge should appear in the Photos UI.</p>
              <p>The HDR designation is not a flag. It is not a sidecar. It is not a layer. It is an intrinsic property of the image's colour space descriptor, embedded in the same container as the pixel data. The image cannot be stripped of its HDR metadata without reprocessing the pixel data — they are structurally unified.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 09 ─── */}
          <Section id="canvas" number="09" icon={<Sparkles className="w-5 h-5 text-pink-400" />}
            accentColor="bg-pink-500/10" gradientFrom="from-pink-300"
            title="HDR Canvas Problem" subtitle="Every standard graphics API silently destroys HDR — and how raw2hdr avoids it">
            <p>Every standard 2D graphics system on iOS defaults to <strong className="text-white">8-bit sRGB compositing</strong>. Drawing a border, compositing a graphic overlay, or rendering text through any standard context irreversibly converts the pipeline to 8-bit, discarding all HDR data.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-4 space-y-2">
                <div className="text-xs font-mono text-red-400 uppercase tracking-widest">Standard Path (broken for HDR)</div>
                <div className="font-mono text-xs text-gray-400 space-y-1">
                  {[
                    { text: 'HDR HEIC (16-bit, HLG)', arrow: false, color: '' },
                    { text: '↓', arrow: true, color: 'text-gray-600' },
                    { text: 'Standard CGContext 8-bit sRGB — HDR lost here', arrow: false, color: 'text-red-400' },
                    { text: '↓', arrow: true, color: 'text-gray-600' },
                    { text: 'Add border, text, overlays', arrow: false, color: '' },
                    { text: '↓', arrow: true, color: 'text-gray-600' },
                    { text: 'Output: 8-bit sRGB — no HDR', arrow: false, color: 'text-red-400' },
                  ].map((row, i) => (
                    <div key={i} className={`${row.arrow ? 'text-center' : ''} ${row.color}`}>{row.text}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">raw2hdr Native Path</div>
                <div className="font-mono text-xs text-gray-300 space-y-1">
                  {[
                    { text: 'HDR HEIC (16-bit, HLG)', arrow: false, color: '' },
                    { text: '↓', arrow: true, color: 'text-gray-600' },
                    { text: 'Native float context (BT.2100 HLG)', arrow: false, color: 'text-emerald-400' },
                    { text: '↓', arrow: true, color: 'text-gray-600' },
                    { text: 'Border fill (HLG signal value)', arrow: false, color: '' },
                    { text: 'Text rendering (float alpha)', arrow: false, color: '' },
                    { text: 'Overlay composite (float precision)', arrow: false, color: '' },
                    { text: '↓', arrow: true, color: 'text-gray-600' },
                    { text: 'Output: 16-bit BT.2100 HLG preserved', arrow: false, color: 'text-emerald-400' },
                  ].map((row, i) => (
                    <div key={i} className={`${row.arrow ? 'text-center' : ''} ${row.color}`}>{row.text}</div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">raw2hdr moves all compositing into the native layer where the context is configured for 16-bit half-float storage and BT.2100 HLG from creation. A white border appears at HDR reference white — not at an sRGB 255 value that maps to a different luminance in HDR signal space.</p>

            <DetailsPanel title="Why every standard graphics system defaults to 8-bit" accent="border-pink-500/20">
              <p>The 8-bit default is the right default for most software: sufficient for UI rendering, icon compositing, and standard photography. It is memory-efficient and GPU-accelerated across all hardware. The problem is specific to HDR photography — a context type optimised for buttons and labels is being asked to carry 16-bit half-float HDR image data.</p>
              <p>Solving it requires bypassing the standard graphics path entirely and explicitly creating a context configured for 16-bit half-float pixel storage in the BT.2100 HLG colour space — a different context type that the standard UI rendering systems never create by default. This is not a workaround; it is a different API surface at the operating system level.</p>
            </DetailsPanel>

            <DetailsPanel title="Perceptual consequences on HDR displays" accent="border-pink-500/20">
              <p>The entire framed output — image and decorative elements together — is a coherent HDR composition. A white border appears at HDR reference white, not at sRGB 255 mapped to a different luminance relative to the photograph beside it. Typography, sprocket holes, EXIF text, and colour swatches all carry the same HDR signal precision as the image pixels.</p>
              <p>On an SDR display, everything renders identically to a standard photograph with a standard frame. HLG's backward compatibility means the SDR fallback is not degraded HDR — it is correct SDR.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 10 ─── */}
          <Section id="filmicfx" number="10" icon={<Film className="w-5 h-5 text-amber-400" />}
            accentColor="bg-amber-500/10" gradientFrom="from-amber-300"
            title="Filmic F/X &amp; Frame Design" subtitle="Creative effects and compositional frames — both applied in the HDR buffer">
            <p>Film grain, light leaks, and lens flare are applied after the complete HLG encoding, directly onto the floating-point HLG pixel buffer. This means effects can reach brightness levels above SDR white — a light leak can genuinely glow, a flare can be brilliantly overexposed — rather than clipping at paper white the way any effect applied in a standard editing context would. The same applies to frame compositing: borders, typography, EXIF overlays, and graphic frame elements are all rendered in the same HDR-native context.</p>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Film grain', desc: 'Organic grain texture spanning the full character range — from the tight, fine grain of slow emulsions to the coarser, more diffuse texture of pushed high-speed stock.', fx: true },
                { title: 'Light leaks', desc: 'Warm and coloured light bleeds applied in HDR space — the leak can be set genuinely brighter than white, the way physical overexposure actually looks on film.', fx: true },
                { title: 'Lens flare', desc: 'Multi-element optical flare with ghost patterns that vary in character and intensity. Flare highlights can exceed display reference white rather than clipping flat.', fx: true },
                { title: 'Consistent across the tonal range', desc: 'Because effects are applied in HDR signal space, grain and texture behave evenly in shadows, midtones, and highlights — not coarser in the darks the way 8-bit application produces.', fx: true },
                { title: 'Typography at float precision', desc: 'Character edges and sub-pixel antialiasing are preserved at full floating-point precision — no quantization at glyph boundaries.', fx: false },
                { title: 'EXIF override system', desc: 'Every metadata field has a user-configurable text override — camera name, lens, custom title. Purely cosmetic, no effect on image data.', fx: false },
                { title: 'Multiple frame layouts', desc: 'Borderless watermark, split EXIF, film strip with sprocket holes, journal with weather and GPS, palette with colour swatches, and more.', fx: false },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl space-y-1 ${item.fx ? 'bg-amber-500/5 border border-amber-500/15' : 'bg-rose-500/5 border border-rose-500/15'}`}>
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>

            <DetailsPanel title="What the 8-bit bottleneck looks like for effects and frames" accent="border-amber-500/20">
              <p>When effects and frames pass through a standard 8-bit compositing context, the consequences are specific and visible on any HDR display: a light leak that should glow above reference white clips silently at paper white instead. Film grain applied in 8-bit space is coarser in the shadows than the highlights — the quantization floor is proportionally larger at low signal levels. A border rendered at sRGB 255 appears at a different perceptual brightness than the HDR reference white of the photograph beside it. The output HEIC may carry an HDR label, but the pixel data has been through an 8-bit bottleneck.</p>
              <p>The HDR Canvas section covers how raw2hdr constructs the native float context that avoids this. The point here is that it affects every creative operation equally — effects, borders, text, and overlays — which is why both are built on the same context rather than treated as separate problems.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 11 ─── */}
          <Section id="cache" number="11" icon={<Database className="w-5 h-5 text-emerald-400" />}
            accentColor="bg-emerald-500/10" gradientFrom="from-emerald-300"
            title="LUT Thumbnail Cache Architecture" subtitle="Single-decode strategy — 9x faster than naive per-LUT decode">
            <p>Without caching, 60 LUT previews at roughly 3.3 seconds per full decode would take over 3 minutes. The cache architecture reduces this to approximately 21 seconds.</p>
            <p>The key insight: all LUT previews for a given RAW share the same input — the neutral linear RGB decode at reduced resolution. The decode runs once; the buffer is held in memory and reused across all 60+ LUT applications.</p>
            <LutCacheChart />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">In-Memory Cache</div>
                <p className="text-sm text-gray-400">Generated PNG thumbnails held keyed by RAW basename + LUT identifier. A cache hit is instantaneous — bytes already in RAM, no I/O or processing.</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">On-Disk Cache</div>
                <p className="text-sm text-gray-400">Thumbnails written to the app temp directory organized by RAW basename. Persists across app launches. A disk hit requires only a file read (~10ms) with no processing.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <MetricCard value="25%" label="Decode scale" sub="1/16th total pixels" color="bg-emerald-500/5 border border-emerald-500/20" />
              <MetricCard value="750px" label="Thumbnail max size" sub="Native at 3x retina 250pt" color="bg-blue-500/5 border border-blue-500/20" />
              <MetricCard value="18 MB" label="Memory for 60 thumbs" sub="~300KB x 60 LUT previews" color="bg-violet-500/5 border border-violet-500/20" />
            </div>

            <DetailsPanel title="Thumbnail quality and sizing — three competing constraints" accent="border-emerald-500/20">
              <p>The 750px maximum dimension target was chosen to satisfy three competing constraints simultaneously:</p>
              <p><strong className="text-white">Visual fidelity:</strong> 750px is large enough that the LUT's characteristic colour rendering, highlight treatment, shadow density, and tonal contrast are clearly visible in the selection grid at 3× retina screen density. A smaller target would make fine differences between similar LUTs indistinguishable.</p>
              <p><strong className="text-white">Memory efficiency:</strong> At 750×500 pixels with 4 bytes per pixel as PNG, each thumbnail occupies roughly 300KB in memory. 60 thumbnails for a single RAW image require approximately 18MB — well within the memory budget of current devices without triggering pressure.</p>
              <p><strong className="text-white">Retina alignment:</strong> 750px corresponds to 250 logical points at 3× display scale — matching the standard iPhone screen width in landscape for current Pro models — so the thumbnails can be displayed at native resolution without upsampling.</p>
              <p>The exposure metering analysis also reads from the same cached buffer, so the EV value used to normalise all 60 thumbnails is computed from the same data without any additional decode overhead. When the user explicitly requests cache regeneration — after a LUT pack update, or after changing processing parameters — both cache levels are cleared and the full generation cycle runs again from the linear decode.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 12 ─── */}
          <Section id="logprofile" number="12" icon={<Settings className="w-5 h-5 text-cyan-400" />}
            accentColor="bg-cyan-500/10" gradientFrom="from-cyan-300"
            title="Log Profile System" subtitle="Data-driven per-manufacturer calibration — adding a new format requires only a new profile">
            <p>Each manufacturer chose different log curve shapes, midpoint placements, and headroom ratios. None were coordinated across manufacturers. Rather than hardcoding these relationships, raw2hdr uses a fully data-driven profile system — adding support for a new log format requires only a new calibrated profile, with no changes to the processing pipeline itself.</p>
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-3">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Profile Design Principles</div>
              {[
                ['Tonal alignment', 'Each profile aligns the manufacturer\'s midtone placement and tonal contrast range to match what the LUT expects — so the creative rendering lands in the right tonal position.'],
                ['Colour balance calibration', 'Per-channel adjustments account for systematic colour offsets between a neutral decode and the manufacturer\'s native encoding, ensuring colour accuracy without manual correction.'],
                ['HDR extension tuning', 'Each profile includes a highlight extension setting tuned to the aesthetic of that manufacturer\'s LUT library — some benefit from aggressive extension, others from restraint.'],
              ].map(([param, desc], i) => (
                <div key={i} className={`flex gap-4 py-3 border-b border-zinc-800/50 last:border-0 ${i === 0 ? '' : ''}`}>
                  <div className="text-sm text-cyan-300 font-medium w-52 flex-shrink-0 leading-relaxed">{param}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
            <Callout variant="note">
              <strong>Calibration:</strong> Parameters are determined empirically by shooting a gray card and colour checker on each target camera, then iteratively adjusting until the synthetic log encode matches the camera SOOC JPEG across the full tonal range. The calibration absorbs any offset the manufacturer baked into their RAW-to-log pipeline.
            </Callout>

            <DetailsPanel title="Handling LUT output range variation" accent="border-cyan-500/20">
              <p>LUTs from different sources embed different assumptions about their output range. A professionally-authored LUT pack designed for post-production will typically have its range already normalised. Community-authored packs, video-workflow LUTs, and packs designed for specific camera-native log signals often have systematic offsets: a black point that sits slightly above true zero, or a white point slightly below maximum, or a midtone that lands at a different tonal position than the pipeline expects.</p>
              <p>The log profile system addresses this through a calibrated output normalisation step. The approach varies by LUT source — some packs are used directly without normalisation (applying corrections to an already-normalised pack would over-correct); others require range adjustment to fill the expected output window; and some require an additional midtone alignment step on top of range correction to handle manufacturers whose tonal conventions place midtones at different positions than standard.</p>
              <p>The normalisation strategy is part of the profile — not a global setting — because different manufacturers and different LUT libraries have different characteristics. A profile tuned for one manufacturer's official LUT pack will not produce the same output range as one tuned for community-authored packs, and applying the wrong normalisation approach is the single most common cause of output that is systematically lighter, darker, or lower-contrast than the LUT was designed to produce.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 13 ─── */}
          <Section id="lens" number="13" icon={<Eye className="w-5 h-5 text-indigo-400" />}
            accentColor="bg-indigo-500/10" gradientFrom="from-indigo-300"
            title="Lens Correction" subtitle="Radial distortion and vignetting corrected in linear light — the only physically correct stage">
            <p>Lens correction is applied after demosaic but before log encoding, LUT application, or HDR extension. This staging reflects the physics of what lens distortions actually are.</p>
            <div className="space-y-3">
              {[
                { title: 'Vignetting is multiplicative in linear light', detail: 'Vignetting attenuates light by a position-dependent factor. Correcting it by multiplying the inverse is physically exact only in linear light. After gamma or log encoding, the correction introduces systematic tonal errors.', color: 'border-indigo-500/25 bg-indigo-500/5' },
                { title: 'Bilinear interpolation is correct in linear', detail: 'Averaging two neighboring pixels during geometric warp produces the physically correct intermediate value only in linear space. Averaging two log-encoded values produces a systematically different result.', color: 'border-blue-500/25 bg-blue-500/5' },
                { title: 'Correction before HDR extension prevents over-encoding', detail: 'A corner pixel darkened 10% by vignetting, when corrected in linear, may now exceed SDR white — placing it in the HDR extension path. If corrected after HLG encoding, that pixel would be incorrectly placed in the signal range.', color: 'border-cyan-500/25 bg-cyan-500/5' },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
                  <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{item.detail}</div>
                </div>
              ))}
            </div>
            <ColorSpaceBar />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Distortion Model</div>
                <p className="text-sm text-gray-400">A/B/C polynomial radial model from the Lensfun database. Applied as an inverse warp (output to source) — no holes in the corrected image. Resolution-independent.</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">GPU Execution</div>
                <p className="text-sm text-gray-400">Both geometric warp and vignetting run as GPU shader programs — no inter-pixel dependencies, trivially parallelised across millions of pixels per image.</p>
              </div>
            </div>

            <DetailsPanel title="Radial distortion correction — polynomial inverse warp" accent="border-indigo-500/20">
              <p>All photographic lenses exhibit some degree of radial distortion: the scale of the image changes as a function of distance from the optical axis. <strong className="text-white">Barrel distortion</strong> (more scale at the centre than edges) is characteristic of wide-angle lenses, zoom lenses at their shortest focal lengths, and most smartphone lenses. <strong className="text-white">Pincushion distortion</strong> (more scale at the edges than centre) is characteristic of telephoto lenses. Moderate zoom lenses often show complex distortion that is barrel-type at short focal lengths and pincushion at long, with a "wavy" or "mustache" characteristic at some ranges.</p>
              <p>The correction is applied as an inverse warp: for each pixel position in the output image, compute the corresponding position in the source (undistorted) image, and sample that position using bilinear interpolation. The inverse direction — output to source, not source to output — is necessary to avoid holes in the corrected image (every output pixel has exactly one source sample; the forward direction would leave some output pixels with no source mapping).</p>
              <p>The mathematical model is the standard polynomial radial model employed by the Lensfun open database, which provides distortion coefficients for thousands of lens-camera combinations. The correction polynomial is applied in normalised image coordinates, making it independent of image resolution and correctly applicable at any output scale.</p>
            </DetailsPanel>

            <DetailsPanel title="Vignetting correction in polar coordinates" accent="border-indigo-500/20">
              <p>Natural vignetting produces a characteristic circular darkening centred on the optical axis, with the darkening increasing monotonically toward the corners. The profile of the falloff varies with lens design, aperture, and focal length.</p>
              <p>The correction is a multiplicative brightening applied in polar-coordinate space: for each pixel, compute its distance from the image centre normalised to the half-diagonal, evaluate the correction polynomial at that radius, and multiply the pixel value by the correction factor. The correction is the reciprocal of the vignetting attenuation function, so applying it in linear light exactly restores the true scene luminance at each position.</p>
              <p>The vignetting model is also sourced from the Lensfun database. Higher-order polynomial terms allow the correction to accurately model lenses with complex vignetting profiles — for example, lenses that vignette moderately at the edges but sharply at the extreme corners due to mechanical vignetting at the lens mount.</p>
              <p>Because vignetting correction increases the brightness of corner and edge pixels, it must be applied <em>before</em> HDR encoding to ensure that the recovered highlight values in those regions are correctly placed in the HDR signal range. A corner sky pixel that was 10% darker than the centre due to vignetting, when corrected in linear light, may now have a scene-linear value above SDR white — entering the same highlight extension path the rest of the sky went through. If vignetting correction were applied <em>after</em> HDR encoding, that pixel would have been incorrectly encoded at the vignetting-darkened level and the correction would attempt to brighten an already-encoded value in HLG space, producing an incorrect and visually inconsistent result.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 14 ─── */}
          <Section id="arch" number="14" icon={<GitBranch className="w-5 h-5 text-violet-400" />}
            accentColor="bg-violet-500/10" gradientFrom="from-violet-300"
            title="Architectural Overview" subtitle="Why open-source RAW libraries aren't the answer on iOS — and what native Core Image solves">

            <p>The obvious starting point for a RAW processing app is an open-source RAW decoder. Tools like <strong className="text-white">LibRaw</strong> and its predecessor <strong className="text-white">dcraw</strong> are the foundation of nearly every RAW workflow outside of commercial desktop software. They decode hundreds of camera formats, they are well-documented, and they are free. The problem is that they are genuinely difficult to use correctly for an HDR pipeline — and on iOS, many of the traditional deployment paths are closed entirely.</p>

            <p>The deeper issue is not licensing or compilation. It is that getting a <em>correct</em>, <em>linear</em>, <em>colour-accurate</em> decode from LibRaw requires solving a chain of subtle configuration problems — and getting any one of them wrong silently corrupts every downstream processing step without producing an obvious error.</p>

            <DetailsPanel title="What LibRaw gets wrong by default — and what you have to fix manually" accent="border-violet-500/20">
              <p><strong className="text-white">Gamma curve applied by default.</strong> LibRaw's output is gamma-encoded unless you explicitly disable the output curve. The default behaviour applies a standard gamma transfer to the decoded values before returning them. For an HDR pipeline that needs to operate in linear light, this is invisible corruption — every subsequent colour matrix, log encode, and LUT application runs on non-linear data while assuming it is linear. The visual result looks plausible but is systematically wrong in a way that is nearly impossible to diagnose by eye.</p>

              <p><strong className="text-white">Automatic brightness normalization.</strong> LibRaw scales output exposure based on a statistical analysis of the image histogram unless this behaviour is explicitly disabled. This means two consecutive shots of the same scene can produce different linear values if the histogram distribution shifts. For a pipeline generating 60+ LUT previews that must all share a consistent exposure baseline, unpredictable automatic brightness scaling breaks the entire comparison model.</p>

              <p><strong className="text-white">Highlight reconstruction modes.</strong> LibRaw defaults to clipping highlights — values above the sensor's white level are discarded. For HDR output, those highlights are the entire point. Enabling reconstruction mode requires choosing between several algorithms (blend, rebuild, Laplacian-based) each with their own artifact characteristics and tuning parameters. Getting this wrong either clips highlights silently or introduces colour fringing in recovered areas.</p>

              <p><strong className="text-white">Colour matrix source selection.</strong> LibRaw maintains a built-in colour matrix database derived from dcraw — matrices that are sometimes years behind current camera releases and may not reflect manufacturer updates. For newer cameras, the matrix embedded in the DNG metadata is more accurate, but reading it correctly requires understanding which DNG illuminant tags to prioritise and how to interpolate between multi-illuminant matrices. An incorrect colour matrix produces systematic hue shifts that look subtle in neutral images but become obvious in the skin tones and sky gradients that LUT authors use as reference when designing their colour science.</p>

              <p><strong className="text-white">White balance per-manufacturer EXIF parsing.</strong> Reading the camera's as-shot white balance from the RAW file requires parsing proprietary EXIF sub-tags that differ between every manufacturer. Canon, Fujifilm, Sony, Nikon, Panasonic, and Leica each store white balance coefficients in different metadata fields, in different units, with different scaling conventions. LibRaw handles the major manufacturers, but the correctness of the parsing degrades with newer or less common models, and an incorrect white balance means all downstream colour work — including every LUT applied to every preview — starts from a colour-shifted baseline.</p>

              <p><strong className="text-white">No GPU acceleration.</strong> LibRaw processes entirely on CPU. Demosaicing, colour matrix application, and white balance all run single- or multi-threaded on CPU cores. For a 50-megapixel RAW file decoded at full resolution, this creates a meaningful per-image latency that compounds across 60+ LUT previews. There is no Metal integration, no CIImage interop, and no way to hand off work to the GPU without manually copying the output buffer into a Metal texture — an operation that itself has non-trivial memory cost.</p>

              <p><strong className="text-white">Format currency.</strong> LibRaw's support for new camera models lags behind camera release dates. New RAW formats from Sony, Canon, Fujifilm, and Nikon may produce incorrect output or fail entirely in older LibRaw versions. Staying current requires updating the library dependency with each new camera release cycle — and validating that the update did not regress output for any of the previously supported cameras in the compatibility matrix.</p>
            </DetailsPanel>

            <DetailsPanel title="What Apple's Core Image RAW decode handles automatically" accent="border-violet-500/20">
              <p><strong className="text-white">True linear output, guaranteed.</strong> CIRAWFilter outputs scene-referred linear RGB. The output is not gamma-encoded. There is no automatic brightness normalization. The pixel values represent physical scene luminance on a consistent linear scale — doubling the value means doubling the light — which is the precise starting condition the entire downstream pipeline requires.</p>

              <p><strong className="text-white">Apple-calibrated colour matrices.</strong> The colour matrices used by CIRAWFilter come from Apple's own camera calibration process — the same matrices that power the colour science of the iPhone camera app and every image that passes through the Apple imaging pipeline. For supported cameras, these are manufacturer-verified matrices that have been validated against physical colour targets, not inherited from a community database.</p>

              <p><strong className="text-white">Correct as-shot white balance, every camera.</strong> CIRAWFilter reads the camera's recorded white balance directly and applies it correctly for every supported manufacturer without requiring per-brand EXIF parsing logic. The output white balance is consistent and correct without any calibration effort on raw2hdr's part.</p>

              <p><strong className="text-white">Maximum highlight preservation.</strong> The linear decode retains all sensor data above the nominal white level that the sensor physically recorded. There is no default clipping, no highlight reconstruction algorithm to choose, no artifact tradeoff to tune. The full dynamic range of the sensor arrives at the next pipeline stage intact.</p>

              <p><strong className="text-white">Metal GPU acceleration built in.</strong> CIRAWFilter output is a CIImage backed by a Metal texture, computed on the GPU. Demosaicing, colour matrix transformation, and white balance all execute as Metal compute shaders. The output is already in GPU memory and directly usable by subsequent Core Image processing stages without any CPU-side buffer copy.</p>

              <p><strong className="text-white">ProRAW and DNG handled natively.</strong> Apple ProRAW — a DNG variant with embedded computational photography data — is decoded correctly by CIRAWFilter without any special handling. Standard DNG, Apple ProRAW, and all RAW formats from supported cameras are handled through the same code path.</p>

              <p><strong className="text-white">Format support via OS updates.</strong> When a new camera is released and Apple adds its RAW format to the OS, CIRAWFilter's support is updated transparently. raw2hdr gains support for new cameras through operating system updates without any library update, dependency management, or regression testing on raw2hdr's part.</p>

              <p>The consequence of using CIRAWFilter as the sole decode path is that every hard problem of RAW decoding — linear output, correct colour matrices, accurate white balance, highlight preservation, GPU performance, and format currency — is delegated to Apple's imaging platform. The entire downstream pipeline can be designed with a single, precisely guaranteed input contract: a floating-point linear sRGB buffer where scene white is reproducible, colour is calibrated, and highlights are intact.</p>
            </DetailsPanel>

            <DetailsPanel title="The Apple-exclusive stack — and what an Android port would actually require" accent="border-violet-500/20">
              <p>Every layer of the raw2hdr pipeline depends on something that exists only within the Apple ecosystem. Understanding which layers those are explains why "just port it to Android" is not a straightforward project.</p>

              <p><strong className="text-white">RAW decode: CIRAWFilter has no Android equivalent.</strong> The entire argument for Core Image over LibRaw — correct colour matrices, guaranteed linear output, accurate per-manufacturer white balance, Metal GPU acceleration, automatic format support — disappears on Android. An Android port starts where this document began: with LibRaw, every configuration problem it brings, and no platform-provided alternative. All of the RAW decode reliability that CIRAWFilter provides for free must be rebuilt manually.</p>

              <p><strong className="text-white">GPU compute: Metal is iOS and macOS only.</strong> The GPU-accelerated processing stages — demosaicing, lens correction, LUT lookup, HDR compositing — all run as Metal compute shaders. Android uses Vulkan or OpenGL ES for GPU compute. These are different APIs with different shader languages, different memory models, and different performance characteristics. The shaders would need to be rewritten entirely, not translated.</p>

              <p><strong className="text-white">HDR output format: HEIC + HLG is Apple's stack.</strong> Encoding a 10-bit HEIC with a BT.2100 HLG colour space descriptor — the step that tells the OS to activate the EDR rendering path — uses AVFoundation and ImageIO APIs that are Apple-only. Android does not have a native equivalent path for writing HEIC with proper HDR signalling. The closest Android equivalent is Google's Ultra HDR format (a JPEG with an embedded gain map) — which Section 06 of this document describes in detail as an architecturally inferior approach with seven known quality problems. An Android version would either accept those quality tradeoffs or wait for a standardised Android HDR container format to mature.</p>

              <p><strong className="text-white">HDR display rendering: EDR is Apple's system.</strong> Apple's Extended Dynamic Range rendering pipeline — the system that maps HLG signal values to physical display luminance above SDR white — is built into iOS and macOS at the OS level. Android HDR display support is fragmented across device manufacturers, with different implementations, different peak brightness levels, and different tone-mapping behaviours on different hardware. A consistent HDR viewing experience across Android devices would require significant per-device testing and potentially per-manufacturer workarounds.</p>

              <p><strong className="text-white">HDR compositing context: the float canvas is Apple API.</strong> The solution to the HDR canvas problem — creating a compositing context backed by 16-bit half-float storage with a BT.2100 HLG colour space — uses a specific Core Image context configuration that is Apple-only. Replicating this on Android requires building a custom Vulkan-backed float compositing pipeline from scratch, including all text rendering, overlay compositing, and frame design operations that currently run through Apple's Core Image and CoreText systems.</p>

              <p>An Android version of raw2hdr is not impossible. But it is a separate, parallel engineering project of roughly equivalent scope to the original iOS build — not a port. Each of the platform dependencies listed above represents a pillar of the current architecture that would need an Android-native replacement before a single line of the HDR pipeline logic could be shared between the two.</p>
            </DetailsPanel>

            <div className="grid sm:grid-cols-3 gap-4">
              <MetricCard value="Linear" label="Output from RAW decode" sub="No gamma, no tone curve applied" color="bg-violet-500/5 border border-violet-500/20" />
              <MetricCard value="GPU" label="Decode execution" sub="Metal-accelerated via Core Image" color="bg-blue-500/5 border border-blue-500/20" />
              <MetricCard value="1 pass" label="RAW to HDR HEIC" sub="No intermediate SDR render" color="bg-emerald-500/5 border border-emerald-500/20" />
            </div>
          </Section>

          {/* Summary */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/15 space-y-5">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-violet-400" />
              <h2 className="text-2xl font-bold text-white">Core Thesis</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Every design decision in raw2hdr follows a single principle: <strong className="text-white">normalize all RAW formats to a manufacturer-agnostic linear-light baseline at the earliest possible stage, and maintain floating-point precision throughout the entire pipeline until the final output file is written.</strong>
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {[
                ['Same linear baseline', 'One LUT pipeline for every camera manufacturer'],
                ['Floating-point throughout', 'HDR headroom is always recoverable'],
                ['Lens correction in linear', 'Physically exact, no pipeline mismatch artifacts'],
                ['Compositing in HDR context', 'Borders and effects never degrade dynamic range'],
                ['Effects on HLG buffer', 'Perceptually uniform, can exceed SDR white'],
                ['HLG is self-describing', 'No metadata needed — one file, every screen'],
              ].map(([label, consequence], i) => (
                <div key={i} className="text-sm flex gap-2">
                  <span className="text-gray-500 shrink-0">{label} →</span>
                  <span className="text-white font-medium">{consequence}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── 15 ─── */}
          <Section id="references" number="15" icon={<Eye className="w-5 h-5 text-gray-400" />}
            accentColor="bg-gray-500/10" gradientFrom="from-gray-300"
            title="References &amp; Standards" subtitle="Published specifications and research papers behind the techniques in this document">
            <DetailsPanel title="View all references" accent="border-gray-500/20">
            <div className="space-y-3">
              {[
                {
                  tag: 'ITU-R BT.2100',
                  title: 'Image parameter values for high dynamic range television',
                  body: 'Defines both the HLG and PQ transfer functions, along with Rec.2020 colour primaries, for HDR video and image systems. The normative specification for the HLG encoding used in raw2hdr.',
                  url: 'https://www.itu.int/rec/R-REC-BT.2100/en',
                  color: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
                },
                {
                  tag: 'ITU-R BT.2020',
                  title: 'Parameter values for ultra-high definition television systems',
                  body: 'Defines the Rec.2020 wide colour gamut primaries used as the HDR container colour volume.',
                  url: 'https://www.itu.int/rec/R-REC-BT.2020/en',
                  color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
                },
                {
                  tag: 'ITU-R BT.709',
                  title: 'Parameter values for the HDTV standards for production and international programme exchange',
                  body: 'Defines the Rec.709 colour primaries and luminance coefficients referenced in standard-display colour management and perceptual luminance weighting.',
                  url: 'https://www.itu.int/rec/R-REC-BT.709/en',
                  color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
                },
                {
                  tag: 'BBC R&D WHP 309',
                  title: 'A "Display Independent" High Dynamic Range Television System',
                  body: 'The original BBC / NHK research paper describing the HLG system design — its display-independent philosophy, backward compatibility with SDR, and the piecewise transfer function.',
                  url: 'https://www.bbc.co.uk/rd/publications/whitepaper309',
                  color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
                },
                {
                  tag: 'ICC Specification',
                  title: 'ICC.1: Image technology colour management — architecture, profile format, and data structure',
                  body: 'The International Color Consortium profile specification (ISO 15076-1). Defines the ICC framework used by standard SDR colour spaces — and why it lacks an HDR signal path.',
                  url: 'https://www.color.org/icc_specs2.xalter',
                  color: 'text-gray-400 border-gray-500/20 bg-gray-500/5',
                },
                {
                  tag: 'OpenEXR',
                  title: 'Technical Introduction to OpenEXR',
                  body: 'Official technical documentation for the OpenEXR half-float HDR image format — designed from the ground up for scene-referred linear data with values above 1.0 as a first-class concept.',
                  url: 'https://openexr.com/en/latest/TechnicalIntroduction.html',
                  color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
                },
                {
                  tag: 'ISO/IEC 23008-12 · HEIF',
                  title: 'High Efficiency Image File Format — Nokia Technologies Reference',
                  body: 'Technical overview of the HEIF/HEIC container standard, covering HEVC encoding, the NCLX colour box mechanism, and the metadata architecture that enables HDR signalling.',
                  url: 'https://nokiatech.github.io/heif/',
                  color: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
                },
                {
                  tag: 'CIE Publication 15',
                  title: 'Colorimetry, 4th Edition',
                  body: 'The authoritative CIE colorimetry reference covering the 1931 standard observer, colour-matching functions, chromaticity coordinates, and the XYZ colour space used as the intermediate in gamut conversion.',
                  url: 'https://www.cie.co.at/publications/colorimetry-4th-edition',
                  color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
                },
                {
                  tag: 'Malvar, He & Cutler (2004)',
                  title: 'High-quality linear interpolation for demosaicing of Bayer-patterned colour images',
                  body: 'Microsoft Research / ICASSP 2004. Widely cited academic paper on high-quality linear interpolation for single-CCD Bayer demosaicing — the mathematical foundation for RAW decode.',
                  url: 'https://www.microsoft.com/en-us/research/publication/high-quality-linear-interpolation-for-demosaicing-of-bayer-patterned-color-images/',
                  color: 'text-teal-400 border-teal-500/20 bg-teal-500/5',
                },
                {
                  tag: 'Apple Developer Documentation',
                  title: 'Displaying HDR content in a Metal layer',
                  body: 'Apple\'s official guide to rendering HDR/EDR content using Metal, covering the EDR headroom API, extended dynamic range display capabilities, and the relationship between HLG signal values and display luminance.',
                  url: 'https://developer.apple.com/documentation/metal/displaying-hdr-content-in-a-metal-layer',
                  color: 'text-gray-300 border-gray-500/20 bg-gray-500/5',
                },
                {
                  tag: 'Lensfun',
                  title: 'Lensfun — Lens Correction Database',
                  body: 'Open-source library and database providing geometric distortion, chromatic aberration, and vignetting correction coefficients for a wide range of camera and lens combinations.',
                  url: 'https://lensfun.github.io/',
                  color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
                },
              ].map((ref, i) => (
                <a
                  key={i}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-xl border p-4 space-y-1.5 hover:brightness-110 transition-all ${ref.color}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${ref.color}`}>{ref.tag}</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{ref.title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{ref.body}</div>
                  <div className="text-xs text-gray-600 font-mono truncate">{ref.url}</div>
                </a>
              ))}
            </div>
            </DetailsPanel>
          </Section>

          <div className="mt-8 pt-6 border-t border-gray-800/50 text-xs text-gray-700 text-center">
            raw2hdr Technical Deep Dive · Engineering Reference
          </div>
        </main>
      </div>
    </div>
  );
};

export default TechnicalDeepDive;
