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
    { channel: 'Red', weight: 21.26, fill: '#f87171' },
    { channel: 'Green', weight: 71.52, fill: '#4ade80' },
    { channel: 'Blue', weight: 7.22, fill: '#60a5fa' },
  ];

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">

        {/* EV compensation curve */}
        <div className="p-5 space-y-3">
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">EV Compensation vs. Center Luminance</div>
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
            <div className="flex items-center gap-1.5 text-gray-400"><div className="w-4 h-0.5 bg-orange-500" /> EV = log₂(0.18 / Y)</div>
            <div className="flex items-center gap-1.5 text-gray-400"><div className="w-3 h-3 rounded-full bg-emerald-500" /> 18% gray (EV = 0)</div>
          </div>
        </div>

        {/* Rec.709 channel weights */}
        <div className="p-5 space-y-3">
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Rec.709 Perceptual Channel Weights</div>
            <div className="text-xs text-gray-600 mt-0.5">How each colour channel contributes to perceived luminance Y</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weights} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="channel" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} tickFormatter={(v: number) => `${v}%`} domain={[0, 80]} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, color: '#e4e4e7', fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, 'Weight']}
              />
              <Bar dataKey="weight" radius={[6, 6, 0, 0]}>
                {weights.map((w, i) => <Cell key={i} fill={w.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs text-gray-500 leading-relaxed">
            Green carries 71.5% of perceived brightness — matching human photopic sensitivity. This is why green channel noise is the most visible in photos.
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

const TechnicalDeepDive: React.FC<{ onClose?: () => void }> = () => {
  const navigate = useNavigate();
  const tocItems = [
    { id: 'arch', label: '01. Architecture' },
    { id: 'demosaic', label: '02. RAW Demosaic' },
    { id: 'pipeline', label: '03. Color Pipeline' },
    { id: 'metering', label: '04. Exposure Metering' },
    { id: 'lut-engine', label: '05. 3D LUT Engine' },
    { id: 'hdr-lut', label: '06. HDR LUT Problem' },
    { id: 'gainmap', label: '07. Gain Map vs Raw-Native' },
    { id: 'hlg', label: '08. HLG Encoding' },
    { id: 'canvas', label: '09. HDR Canvas Problem' },
    { id: 'filmicfx', label: '10. Filmic F/X' },
    { id: 'frames', label: '11. Frame System' },
    { id: 'cache', label: '12. LUT Cache' },
    { id: 'logprofile', label: '13. Log Profile System' },
    { id: 'lens', label: '14. Lens Correction' },
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
          <div className="w-20 text-right text-xs text-gray-600 font-mono">14 chapters</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 lg:flex gap-12">
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-20 space-y-0.5">
            <div className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">Chapters</div>
            {tocItems.map(item => (
              <a key={item.id} href={`#${item.id}`} className="block text-xs text-gray-500 hover:text-white transition-colors py-1 px-2 rounded hover:bg-white/5">
                {item.label}
              </a>
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
          <Section id="arch" number="01" icon={<GitBranch className="w-5 h-5 text-violet-400" />}
            accentColor="bg-violet-500/10" gradientFrom="from-violet-300"
            title="Architectural Overview" subtitle="Two layers with a hard boundary between them">
            <p>raw2hdr is divided into two layers. The <strong className="text-white">UI and orchestration layer</strong> manages everything the user sees — file selection, LUT browsing, frame configuration, export UI. It never touches pixel data. The <strong className="text-white">native processing layer</strong> handles all pixel mathematics via compiled native code on background threads.</p>
            <p className="text-sm text-gray-400">This is a hard requirement of iOS. iOS prohibits spawning child processes, eliminating the common approach of shelling out to tools like <code className="bg-white/5 px-1 rounded">dcraw</code>. Every processing step must be compiled directly into the application binary.</p>
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-5">Full Native Processing Pipeline</div>
              {[
                ['RAW file on disk', 'Input: .RAF .CR3 .ARW .RW2 .ORF .DNG', 'border-gray-600'],
                ['Demosaic + White Balance', 'CIRAWFilter — linear sRGB (16-bit half-float)', 'border-violet-500'],
                ['Lens Correction', 'Distortion warp + vignetting in linear light', 'border-indigo-500'],
                ['Exposure Scaling', 'EV from center-weighted software metering', 'border-blue-500'],
                ['Gamut Convert + Log Encode', 'Linear sRGB → manufacturer gamut (linear) + log OETF', 'border-cyan-500'],
                ['3D LUT Lookup', 'Trilinear interpolation across 33-grid cube', 'border-teal-500'],
                ['Post-LUT Calibration', 'Range normalization + per-channel gain correction', 'border-emerald-500'],
                ['Linearize + Highlight Extension', 'Scene-linear data above SDR white soft-log extended', 'border-lime-500'],
                ['Rec.2020 + HLG Encode', 'Linear sRGB → XYZ (D65) → Rec.2020 → BT.2100 HLG OETF', 'border-yellow-500'],
                ['Creative FX + Compositing', 'Applied to HLG buffer in native float context', 'border-orange-500'],
                ['HEIC Encode', '10-bit HEVC + BT.2100 HLG colour space embedded', 'border-red-500'],
              ].map(([step, desc, accent], i, arr) => (
                <PipelineStep key={i} step={step} desc={desc} accent={accent} last={i === arr.length - 1} />
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <MetricCard value="16-bit" label="Processing precision" sub="Half-float throughout" color="bg-violet-500/5 border border-violet-500/20" />
              <MetricCard value="0" label="Integer quantization steps" sub="Until final HEIC encode" color="bg-blue-500/5 border border-blue-500/20" />
              <MetricCard value="1 pass" label="RAW to HDR" sub="No intermediate SDR step" color="bg-emerald-500/5 border border-emerald-500/20" />
            </div>
            <DetailsPanel title="Why a compiled native layer instead of CLI tools?" accent="border-violet-500/20">
              <p>In traditional RAW processing workflows, software often orchestrates external command-line tools — delegating decoding to one process, colour conversion to another, and encoding to a third. Operating systems that permit child process spawning make this straightforward: pipe data between stages and collect the result.</p>
              <p>iOS prohibits this entirely. Mobile applications cannot spawn child processes, fork background daemons, or execute arbitrary binaries. Every computation the app performs must be compiled into the application binary itself and called through the native function interface. This is not a soft guideline — it is enforced at the operating system level.</p>
              <p>This constraint ultimately drove the architecture: a self-contained compiled native layer where every processing step — RAW decoding, gamut conversion, log encoding, LUT lookup, HDR encoding, creative effects, compositing, and file encoding — runs as compiled native code within the app's own address space. The UI layer coordinates sequencing and observes results, but never operates on pixel data directly. Communication between layers is limited to file paths and configuration parameters — the native layer reads a RAW file from disk, processes it entirely in memory using floating-point precision, and writes the output back to disk.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 02 ─── */}
          <Section id="demosaic" number="02" icon={<Camera className="w-5 h-5 text-indigo-400" />}
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

          {/* ─── 03 ─── */}
          <Section id="pipeline" number="03" icon={<Sliders className="w-5 h-5 text-blue-400" />}
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
              <div className="text-xs leading-loose">Linear sRGB → [Lens Correction] → [Exposure Scale] → [Gamut Matrix] → [Log OETF] → [3D LUT] → [Post-LUT Cal] → [Linearize] → [Highlight Ext] → [Rec.2020] → [HLG OETF] → HEIC</div>
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

          {/* ─── 04 ─── */}
          <Section id="metering" number="04" icon={<Gauge className="w-5 h-5 text-cyan-400" />}
            accentColor="bg-cyan-500/10" gradientFrom="from-cyan-300"
            title="Exposure Metering" subtitle="Center-weighted in software — consistent baseline across all 60+ LUT thumbnails">
            <p>Every LUT preview must share the same exposure baseline. Without this, brightness differences between thumbnails would reflect exposure variation rather than the LUT itself, making comparison unreliable.</p>
            <p>raw2hdr mirrors physical center-weighted metering: the central 30% of the reduced-resolution decode is averaged using Rec.709 perceptual coefficients. The result is compared to 18% middle gray in linear light, yielding the EV compensation applied identically to every LUT preview.</p>
            <MeteringChart />

            <DetailsPanel title="The physical camera metering analogy" accent="border-cyan-500/20">
              <p>Camera metering modes differ in which pixels of the scene they use to estimate the "correct" exposure. Evaluative/matrix metering divides the frame into zones and applies a weighted formula. Spot metering uses only the central 1–5% of the frame. <strong className="text-white">Center-weighted metering</strong> concentrates 60–80% of the calculation on a circular central region, under the assumption that the primary subject is positioned there.</p>
              <p>Center-weighted metering dates to the earliest generation of automatic-exposure SLRs in the 1970s — the Canon AE-1, the Nikon F2S, the Olympus OM-1 — and has remained a standard metering mode in every professional camera since. Its longevity reflects its practical reliability: for the vast majority of photographic compositions, the subject is in or near the centre, and metering that region correctly exposes the subject regardless of what the background or periphery is doing.</p>
              <p>raw2hdr's software metering mirrors this approach exactly. A square region at the centre of the reduced-resolution decode buffer — approximately the central 30% in each dimension — is isolated, and the luminance-weighted average is computed using the standard Rec.709 perceptual coefficients (green most heavily, then red, then blue, matching the relative sensitivity of human vision). That average is compared to the photographic reference for 18% middle grey in linear light. The ratio, expressed in exposure value stops, becomes the EV compensation.</p>
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

          {/* ─── 05 ─── */}
          <Section id="lut-engine" number="05" icon={<Layers className="w-5 h-5 text-teal-400" />}
            accentColor="bg-teal-500/10" gradientFrom="from-teal-300"
            title="3D LUT Engine — Cross-Manufacturer Compatibility" subtitle="Synthetic log encoding from neutral linear — any LUT, any camera">
            <p>LUTs are authored for one specific input format. A Fujifilm PROVIA LUT expects F-Log2/F-Gamut signal. Feed it V-Log signal and every output dimension is wrong. This is the traditional reason camera brand and LUT brand must match.</p>
            <p>Because every RAW emerges as neutral linear sRGB, raw2hdr synthesises any log signal from scratch. For a Fujifilm LUT: convert linear sRGB to F-Gamut, apply the F-Log2 OETF. The LUT receives input indistinguishable from a Fujifilm camera signal.</p>
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
              <p>Photographers and colourists are familiar with two traditional calibration approaches, and it is worth explaining why neither solves the problem raw2hdr's calibration addresses — because they are solving fundamentally different problems.</p>

              <p><strong className="text-white">Display calibration with a spider (colorimeter/spectrophotometer).</strong> Devices like the X-Rite i1Display or Datacolor SpyderX attach to a monitor. The software displays a series of known colour patches on screen; the spider's optical sensor measures the actual light emitted by the panel for each patch; the difference between what was requested and what was physically emitted becomes the correction applied through an ICC display profile. The goal is <em>display accuracy</em> — ensuring the monitor reproduces colours faithfully so the photographer can trust what they see on screen. This has nothing to do with the camera's colour science, the RAW file, or LUT compatibility. A perfectly calibrated display will still show the wrong result if an F-Log2 LUT receives V-Log input.</p>

              <p><strong className="text-white">Camera profiling with a physical colour checker.</strong> A photographer shoots a standardised colour target — an X-Rite ColorChecker Passport, a SpyderCHECKR 24, or similar chart with patches of known spectral reflectance — under controlled, measured lighting. Software then compares the camera's captured RGB values for each patch against the patches' known reference values (published by the chart manufacturer) and computes a correction transform. This transform is saved as a DNG Camera Profile or ICC input profile. When applied during RAW development, it maps the camera's sensor response to a "colourimetrically accurate" reproduction — the red patch looks like the reference red, the skin tone patch matches the reference skin tone, and so on.</p>

              <p>This approach answers the question: <em>"How do I make this camera reproduce colours that are measurably accurate against a physical reference?"</em> It creates a mapping from camera sensor space to a standardised colour space (usually ProPhoto RGB or CIE XYZ) that is metrologically correct — meaning a spectrophotometer pointed at the original scene and at the calibrated reproduction would read the same CIE coordinates.</p>

              <p><strong className="text-white">Why neither approach solves the LUT compatibility problem.</strong> raw2hdr's calibration is asking an entirely different question: <em>"How do I synthesise a signal that is indistinguishable — from the LUT's perspective — from the signal the camera manufacturer's own encoding pipeline would have produced?"</em></p>

              <p>This is not a colourimetric accuracy problem. A Fujifilm F-Log2 signal is not trying to be "accurate" in the ICC sense — it is trying to be a specific non-linear encoding with a specific midpoint placement, a specific contrast characteristic, a specific per-channel balance, and a specific relationship to the manufacturer's creative rendering. The F-Log2 curve was designed by Fujifilm's engineers as the <em>input contract</em> for their Film Simulation LUTs. Reproducing that contract requires matching the manufacturer's intent, not matching a physical colour reference.</p>

              <p>An ICC profile built from a colour checker tells you the physically accurate RGB value for a given spectral stimulus. It does not tell you where Fujifilm places 18% grey in F-Log2 signal, or what per-channel gain offset Panasonic applies in V-Log relative to the theoretical V-Log curve, or how Leica's L-Log midpoint differs from the published specification by a fraction of a stop due to firmware-level tuning. These are the idiosyncratic, manufacturer-specific offsets that raw2hdr's calibration captures — and they are invisible to any ICC-based workflow because ICC profiles do not model log encoding behaviour, manufacturer-specific midpoint placement, or creative rendering intent.</p>

              <p>Put differently: an ICC-calibrated workflow ensures your <em>colours are physically correct</em>. raw2hdr's calibration ensures the <em>LUT receives exactly the signal it was designed to consume</em>. The first is about truth to the physical world. The second is about truth to the manufacturer's creative system — which is what makes a Fujifilm PROVIA LUT produce PROVIA-looking results, regardless of which camera captured the scene.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 06 ─── */}
          <Section id="hdr-lut" number="06" icon={<Zap className="w-5 h-5 text-yellow-400" />}
            accentColor="bg-yellow-500/10" gradientFrom="from-yellow-300"
            title="The HDR LUT Problem" subtitle="Recovering the highlights that SDR LUTs silently discard">
            <p>All commercially distributed film simulation LUTs produce <strong className="text-white">8-bit SDR output</strong>. Their maximum value is display white — anything brighter is clipped. The scene-linear values above SDR white were never discarded in raw2hdr; they flow through the pipeline in parallel with the log-encoded signal.</p>

            <DetailsPanel title="Reframing: SDR output as scene intent, not display output" accent="border-yellow-500/20">
              <p>raw2hdr resolves the HDR-from-SDR-LUT problem by treating the LUT's SDR output not as a final display-referred result, but as a <strong className="text-white">compressed statement of the photographer's tonal and colour intent</strong> — one that happens to be expressed in a range too narrow to contain all the scene's luminance information.</p>
              <p>The mathematical insight: a pixel at SDR white in the LUT output does not mean "this is the brightest displayable value." It means "this is the boundary of the LUT's range." The scene-linear value at that pixel might have been 1.5× scene white, or 3×, or 8×. The LUT silently clamped those values because it had nowhere to put them.</p>
              <p>But crucially — in this pipeline, the original scene-linear value was never discarded. It was carried through the pipeline in parallel with the log-encoded signal that was fed into the LUT. The scene still knows how bright those pixels actually were. The LUT merely didn't have the dynamic range to express it.</p>
            </DetailsPanel>

            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-4">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Highlight Recovery — 4 Steps</div>
              {[
                { num: '1', step: 'Linearize LUT output', desc: 'Remove sRGB gamma to recover linear-light values for everything below SDR white.', color: 'text-blue-400 border-blue-500/30' },
                { num: '2', step: 'Extend highlights from scene-linear', desc: 'For pixels above SDR white, apply soft logarithmic extension. Each stop above white gets a progressively smaller boost — mirrors film shoulder rolloff.', color: 'text-yellow-400 border-yellow-500/30' },
                { num: '3', step: 'Convert to Rec.2020', desc: 'Map wide-gamut colours into the HDR container colour volume.', color: 'text-emerald-400 border-emerald-500/30' },
                { num: '4', step: 'Apply HLG OETF', desc: 'Map the extended linear range to HLG signal: ~75% for SDR-equivalent, ~25% for recovered highlight headroom.', color: 'text-orange-400 border-orange-500/30' },
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
              <p>In terms of HLG signal values: SDR reference white sits at approximately 0.75 in the signal range. A pixel at 2× scene white (recovered) maps to approximately 0.85. A pixel at 4× scene white maps to approximately 0.93. The ceiling at 12× scene white reaches 1.0. Each stop of highlight recovery occupies a progressively smaller slice of the signal range — allocating more precision to the near-white highlights that human vision is most sensitive to, and less to the extreme super-whites that serve mainly as specular accents.</p>
              <p>On an SDR display, the same HLG HEIC file degrades gracefully. The HDR extension region maps to display white and above, which an SDR display simply ignores. The remaining ~75% of the signal renders identically to a well-exposed SDR image. No adaptation or separate SDR fallback export is needed.</p>
            </DetailsPanel>

            <DetailsPanel title="Why 16-bit TIFF, PSD, and DNG don't solve the HDR problem" accent="border-yellow-500/20">
              <p>A natural question: if the problem is 8-bit precision, why not just use a 16-bit file format? TIFF supports 16-bit integer per channel. PSD supports 16-bit and 32-bit modes. DNG stores the full-depth RAW sensor data. These formats genuinely carry 16 bits of data, process with 16-bit math, and save to 16-bit containers. So where does the dynamic range go?</p>

              <p>The answer is that <strong className="text-white">bit depth and dynamic range are not the same thing.</strong> Bit depth determines how many steps exist between the darkest and brightest values the format can represent. Dynamic range determines <em>what those darkest and brightest values actually mean on a display.</em> A 16-bit TIFF has 65,536 steps per channel — an enormous amount of tonal precision. But every one of those 65,536 steps lives within the SDR luminance range: from display black to display reference white. No value in the file means "brighter than white." The extra bits buy you extraordinarily smooth gradients and virtually zero banding within that SDR window, but they do not extend the window itself.</p>

              <p><strong className="text-white">The constraint is the transfer function, not the bit depth.</strong> TIFF and PSD files carry ICC colour profiles that describe their colour space — sRGB, Adobe RGB, ProPhoto RGB, Display P3. Every one of these colour spaces uses an SDR transfer function (gamma 2.2, sRGB TRC, or similar). The transfer function is what tells the display how to map code values to physical luminance. An SDR transfer function maps the maximum code value to SDR reference white — typically around 100 nits on a calibrated display — and nothing more. There is no value in the ICC vocabulary that means "render this pixel above reference white at extended luminance."</p>

              <p><strong className="text-white">Even on an XDR or P3 display, SDR files render at SDR brightness.</strong> When iOS or macOS opens a 16-bit TIFF with a Display P3 ICC profile, the display pipeline does two things correctly: it uses the full P3 colour gamut (wider than sRGB — those extra reds and greens are real), and it preserves the 16-bit precision through the display path (as much as the panel's 10-bit hardware allows). But it renders the content at SDR luminance. The operating system's Extended Dynamic Range (EDR) rendering path is <em>never activated</em>, because the file's ICC profile does not contain the information needed to trigger it. Reference white stays at the SDR brightness level. Highlights hit that ceiling and stop. The display is physically capable of 1,000+ nits, but the file format gave it no instruction to use that capability.</p>

              <p>This is the critical distinction: HEIC with BT.2100 HLG carries a completely different colour space descriptor — not an ICC profile, but an NCLX colour description that specifies BT.2020 primaries and the HLG transfer function. When the OS reads this descriptor, it recognises that the content uses an HDR transfer function and activates the EDR rendering path. Now pixel values above HLG reference white (signal value ~0.75) are rendered at genuine extended luminance — 200, 400, 800, 1000+ nits on capable hardware. The display is being told, through the file format itself, to use its full brightness range.</p>

              <p><strong className="text-white">So the formats compare like this:</strong></p>
              <div className="rounded-lg bg-black/30 border border-white/10 overflow-hidden mt-2">
                <div className="grid grid-cols-3 text-xs">
                  <div className="px-3 py-2 border-b border-r border-white/10 text-gray-500 font-mono">Format</div>
                  <div className="px-3 py-2 border-b border-r border-white/10 text-gray-500 font-mono">Precision</div>
                  <div className="px-3 py-2 border-b border-white/10 text-gray-500 font-mono">Display behaviour on HDR screen</div>

                  <div className="px-3 py-2 border-b border-r border-white/10 text-gray-300">16-bit TIFF (sRGB / P3)</div>
                  <div className="px-3 py-2 border-b border-r border-white/10 text-gray-400">65,536 steps</div>
                  <div className="px-3 py-2 border-b border-white/10 text-red-400">SDR luminance only. EDR never activated. 65,536 steps within 0–100 nits.</div>

                  <div className="px-3 py-2 border-b border-r border-white/10 text-gray-300">16-bit PSD (ProPhoto RGB)</div>
                  <div className="px-3 py-2 border-b border-r border-white/10 text-gray-400">65,536 steps</div>
                  <div className="px-3 py-2 border-b border-white/10 text-red-400">SDR luminance only. Widest gamut of any ICC space, but still SDR brightness ceiling.</div>

                  <div className="px-3 py-2 border-b border-r border-white/10 text-gray-300">DNG (RAW container)</div>
                  <div className="px-3 py-2 border-b border-r border-white/10 text-gray-400">12–14 bit sensor data</div>
                  <div className="px-3 py-2 border-b border-white/10 text-amber-400">Not a display format. Must be rendered first — and the render pipeline determines SDR vs. HDR.</div>

                  <div className="px-3 py-2 border-r border-white/10 text-gray-300">10-bit HEIC (BT.2100 HLG)</div>
                  <div className="px-3 py-2 border-r border-white/10 text-gray-400">1,024 steps</div>
                  <div className="px-3 py-2 border-white/10 text-emerald-400">EDR activated. ~750 steps for SDR range + ~274 steps for genuine HDR highlights above reference white.</div>
                </div>
              </div>

              <p className="pt-2">The paradox is real: a 10-bit HEIC with HLG produces a wider visible dynamic range on an HDR display than a 16-bit TIFF, despite having six fewer bits of precision. The TIFF has more steps but they are all confined within the SDR brightness window. The HLG HEIC has fewer steps but they span a luminance range that includes genuine highlights above reference white — the region where HDR displays physically emit more light.</p>

              <p>This is ultimately why raw2hdr outputs HEIC with BT.2100 HLG rather than 16-bit TIFF or any other high-precision SDR format. The goal is not maximum bit depth — it is maximum <em>displayable dynamic range</em>. The HLG transfer function and the HEIC container together form the instruction set that tells an iPhone's OLED panel to actually use the extended brightness it is capable of. Without that instruction set, all the bit depth in the world stays trapped behind the SDR brightness ceiling.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 07 ─── */}
          <Section id="gainmap" number="07" icon={<Triangle className="w-5 h-5 text-orange-400" />}
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
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">HLG Transfer Function — Two Segments</div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <div><strong className="text-white">Square root segment (E ≤ 1/12):</strong> Shadows to lower midtones. Allocates many signal codes to subtle dark-area variations, matching human visual sensitivity to low luminance.</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <div><strong className="text-white">Logarithmic segment (E &gt; 1/12):</strong> Midtones to highlights. Matches the Weber-Fechner logarithmic sensitivity of human vision — and the shoulder curve of photographic film.</div>
                </div>
              </div>
            </div>

            <DetailsPanel title="The two segments and human visual perception" accent="border-blue-500/20">
              <p>The HLG OETF is a piecewise mathematical function with two segments, each corresponding to a different regime of the human visual system.</p>
              <p>The <strong className="text-white">square root segment</strong> (low luminance, shadows to lower midtones) is a power function with exponent 0.5 — a relatively rapid compression that allocates many signal codes to the subtle tonal variations in dark areas. Human vision is most sensitive to relative contrast in dark regions; this segment matches that sensitivity by providing fine tonal resolution in the shadows.</p>
              <p>The <strong className="text-white">logarithmic segment</strong> (midtones to highlights) naturally matches the logarithmic sensitivity of human vision to brightness (the Weber-Fechner law) and also matches the characteristic shoulder curve of photographic film. This segment allocates signal codes at a rate that corresponds to how much tonal distinction a viewer can actually perceive — compressing highlights more aggressively than midtones because the perceptual difference between "2× white" and "2.1× white" is far smaller than the difference between "18% grey" and "19% grey."</p>
              <p>The boundary between the two segments is set at 1/12 of scene white — approximately the luminance of a dark but not-black shadow area. The transition is smooth, with the square root and logarithmic segments meeting tangentially (matching in both value and derivative) so there is no perceptual discontinuity. A scale factor places reference white at approximately 75% of the HLG signal range, leaving the upper 25% available for extended highlights — roughly 750 codes for SDR-equivalent content and 274 codes for highlights brighter than reference white in a 10-bit file.</p>
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
                  <div>HDR HEIC (16-bit, HLG)</div>
                  <div className="text-gray-600">↓</div>
                  <div className="text-red-400">Standard CGContext 8-bit sRGB — HDR lost here</div>
                  <div className="text-gray-600">↓</div>
                  <div>Add border, text, overlays</div>
                  <div className="text-gray-600">↓</div>
                  <div className="text-red-400">Output: 8-bit sRGB — no HDR</div>
                </div>
              </div>
              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">raw2hdr Native Path</div>
                <div className="font-mono text-xs text-gray-300 space-y-1">
                  <div>HDR HEIC (16-bit, HLG)</div>
                  <div className="text-gray-600">↓</div>
                  <div className="text-emerald-400">Native float context (BT.2100 HLG)</div>
                  <div className="text-gray-600">↓</div>
                  <div>Border fill (HLG signal value)</div>
                  <div>CoreText rendering (float alpha)</div>
                  <div>Overlay composite (float precision)</div>
                  <div className="text-gray-600">↓</div>
                  <div className="text-emerald-400">Output: 16-bit BT.2100 HLG preserved</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">raw2hdr moves all compositing into the native layer where the context is configured for 16-bit half-float storage and BT.2100 HLG from creation. A white border appears at HDR reference white — not at an sRGB 255 value that maps to a different luminance in HDR signal space.</p>

            <DetailsPanel title="Why every standard graphics system defaults to 8-bit" accent="border-pink-500/20">
              <p>The 8-bit default exists for legitimate reasons: 8-bit sRGB is sufficient for UI rendering, icon compositing, text display, and standard photography at consumer quality. It is memory-efficient (3 or 4 bytes per pixel vs. 8 bytes for 16-bit float). It is GPU-accelerated across all hardware. And the vast majority of software use cases — displaying a button, rendering a label, drawing a chart — have no need for extended precision or dynamic range.</p>
              <p>The consequence for HDR photography is severe. Any compositing operation performed through these standard systems — adding a border, overlaying text, compositing a graphic element, drawing a shape fill — runs at 8-bit precision and produces 8-bit sRGB output. Even if the input is a 16-bit HDR HEIC, the standard context discards the precision immediately. The HLG encoding is gone. The Rec.2020 wide gamut is gone. The recovered highlights are gone.</p>
              <p>This is not a software bug. It is the designed behaviour of these systems. Solving it requires bypassing the standard graphics path entirely and explicitly creating a compositing context configured for 16-bit half-float pixel storage and the BT.2100 HLG colour space — a different context type at the operating system level that the standard UI rendering systems never create by default.</p>
            </DetailsPanel>

            <DetailsPanel title="Perceptual consequences on HDR displays" accent="border-pink-500/20">
              <p>On an HDR display, the visual consequence of the native float compositing path is that the entire framed output — image and decorative elements together — is a coherent HDR composition. A white border appears at the HDR reference white level, not at a sRGB 255 value that might accidentally appear as a different luminance relative to the image content. Text has the same perceptual brightness relationship to the image as the designer intended. A film strip frame's sprocket holes and edge markings are rendered at HDR precision, matching the photographic grain and tone of the bordered image.</p>
              <p>On an SDR display, everything looks exactly like a standard photograph with a standard frame. HLG's backward compatibility ensures that the 8-bit pathway is not "degraded HDR" — it is genuinely correct SDR rendering of the HLG signal.</p>
              <p>The phrase "every creative operation available in HDR format at 10-bit precision" means precisely this: no operation in the post-processing stack — effects, borders, text, overlays — forces a downgrade to 8-bit. The dynamic range of the photograph is preserved from RAW decode to final composited HEIC output without interruption.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 10 ─── */}
          <Section id="filmicfx" number="10" icon={<Film className="w-5 h-5 text-amber-400" />}
            accentColor="bg-amber-500/10" gradientFrom="from-amber-300"
            title="Filmic F/X — Creative Effects Natively in HDR" subtitle="Applied to the HLG pixel buffer — after encode, before file write">
            <p>Film grain, light leaks, and lens flare are applied <strong className="text-white">after</strong> the complete HLG encoding, directly onto the floating-point HLG pixel buffer. This staging means effects can exceed SDR white and operate in a perceptually uniform signal space.</p>
            <div className="space-y-3">
              {[
                { label: 'Effects can exceed SDR white', detail: 'An overexposed light leak or a brilliant lens flare can be set above display reference white in the HLG buffer — representing genuine physical overexposure. Applied pre-HDR, these elements clip at SDR maximum.' },
                { label: 'Perceptually uniform response', detail: 'HLG signal space is roughly perceptually uniform. Grain at a given intensity produces consistent visual weight across shadows, midtones, and highlights — not the disproportionate shadow coarseness of gamma-space application.' },
                { label: 'No precision degradation', detail: 'Effects composited into an 8-bit buffer reduce precision at that region permanently. In the 16-bit HLG context, precision is maintained regardless of which effects overlap.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <DetailsPanel title="Why the staging of effects matters — before, during, or after HLG" accent="border-amber-500/20">
              <p>The choice of <em>when</em> in the pipeline to apply creative effects has significant consequences that are not interchangeable.</p>
              <p><strong className="text-white">If effects were applied before the HLG encode</strong> — to the linear Rec.2020 buffer, for example — they would need to be designed in linear light, where the luminance distribution is highly non-uniform and the signal codes are concentrated in bright areas. Grain applied in linear light would appear extremely faint in dark regions and disproportionately coarse in bright regions, because linear light allocates most of its precision to high luminance.</p>
              <p><strong className="text-white">If effects were applied after SDR tone-mapping</strong> — as virtually all traditional photography apps and editing software do — they would operate on 8-bit sRGB values. The effect would be limited to the SDR tonal range (0–255), meaning that grain or light leak elements could never exceed SDR paper white. Bright creative elements would clip at white. The HDR headroom that was so carefully recovered through the pipeline would be untouched by the creative layer.</p>
              <p><strong className="text-white">By applying effects to the HLG-encoded signal,</strong> raw2hdr operates in the same perceptually-uniform space that the HLG transfer function was designed to create: tonal steps in shadows, midtones, and highlights are all represented at roughly equal perceptual weight. An effect at a given intensity level produces a visually consistent result across the full tonal range.</p>
            </DetailsPanel>

            <DetailsPanel title="What traditional 8-bit editing fundamentally cannot do" accent="border-amber-500/20">
              <p><strong className="text-white">Hard ceiling at SDR white.</strong> Any effect element that should be brighter than paper white — an overexposed light leak, a brilliant sun flare, a specular reflection on a rain-wet surface — clips to the maximum code value. The effect looks correct on SDR but loses the physical intensity that makes it convincing. On an HDR display, SDR-applied effects look flat because their brightest elements are capped below what the display can show.</p>
              <p><strong className="text-white">Perceptual non-uniformity in 8-bit space.</strong> sRGB allocates more code values to dark tones than to bright tones (due to gamma encoding). Procedural effects like grain that are designed to be uniform across the tonal range appear coarser in shadows and finer in highlights when applied in sRGB, because the granularity of the underlying signal is not perceptually uniform. Correcting for this requires explicit gamma compensation that most tools do not implement.</p>
              <p><strong className="text-white">Irreversible precision loss.</strong> Once an effect has been composited into an 8-bit buffer, the precision of the underlying image in that region is reduced to 8 bits regardless of what was there before. The HLG encoding, the Rec.2020 gamut, the sub-bit precision of the colour grading — all of it is permanently lost in the regions where effects were composited.</p>
              <p><strong className="text-white">No HDR-native element representation.</strong> A traditional light leak consists of an RGB colour pattern whose maximum values clip at sRGB 255. In raw2hdr's HLG buffer, the same light leak's colour values can be set above SDR reference white — representing a genuinely overexposed, transparently burned-through quality that actual film light leaks produce. The leak "glows" in the HDR region above what a standard display can show, which is precisely how physical overexposure looks when correctly represented.</p>
            </DetailsPanel>

            <DetailsPanel title="Effect design philosophy — physical dimensions of real-world analogs" accent="border-amber-500/20">
              <p>The three effects in raw2hdr — film grain, light leaks, and lens flare — are each parameterised to cover the physical dimension of their real-world analog:</p>
              <p><strong className="text-white">Grain size</strong> maps to emulsion grain character — from fine-grain slow films (ISO 50–100 stocks like Velvia, Ektar) to coarse pushed high-speed stocks (ISO 1600–3200 like Tri-X pushed two stops). <strong className="text-white">Grain type</strong> maps to the physical grain structure difference between silver halide monochrome film (irregular, hard-edged clumps) and dye-cloud colour film (softer, larger, more diffuse grain clusters).</p>
              <p><strong className="text-white">Light leak positioning</strong> maps to the physical geometry of where light enters a film camera body relative to the film gate — back door hinge leaks produce vertical streaks on the left edge of the frame, sprocket channel leaks produce horizontal washes along the top or bottom, and body seam leaks produce diffuse warm glow from the edges inward.</p>
              <p><strong className="text-white">Lens flare ghost count</strong> maps to the number of optical elements in a compound lens that produce secondary internal reflections — a simple 5-element prime produces fewer, more defined ghosts than a complex 18-element zoom.</p>
              <p>The goal is not simulation for its own sake but the preservation of the physical relationships that make these effects feel authentic — and the HDR compositing space is what makes the luminance relationships physically plausible, rather than clipped approximations.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 11 ─── */}
          <Section id="frames" number="11" icon={<FileImage className="w-5 h-5 text-rose-400" />}
            accentColor="bg-rose-500/10" gradientFrom="from-rose-300"
            title="Frame Design System" subtitle="Compositional layouts — all composited in native HDR without degradation">
            <p>Adding a border to a photograph seems trivial. For HDR images it is one of the most fragile operations in a pipeline. The standard approach — create a canvas, fill a border, composite image — runs in 8-bit sRGB at step one. The HDR HEIC is immediately degraded when it touches a standard graphics context.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'CoreText at float precision', desc: 'Sub-pixel antialiasing with fractional alpha values preserved at 16-bit. No quantization error at character edges, even at high magnification.' },
                { title: 'EXIF override system', desc: 'Every metadata field has a user-configurable text override — camera name, lens, custom title. Purely cosmetic, no effect on image data.' },
                { title: 'Multiple layouts', desc: 'Borderless watermark, split EXIF, film strip with sprocket holes, journal with weather and GPS, palette with colour swatches, and more.' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 space-y-1">
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>

            <DetailsPanel title="The traditional frame addition problem — step by step" accent="border-rose-500/20">
              <p>The standard approach in virtually every photo app is: (1) create a new canvas in the standard graphics context — which is 8-bit sRGB; (2) fill the border region with the chosen colour; (3) composite the image into the centre of the canvas; (4) save the result.</p>
              <p>Step 1 irreversibly converts the pipeline to 8-bit sRGB. The HDR HEIC's floating-point pixel values are decoded, mapped through the colour space, and deposited into an 8-bit integer buffer. The HLG transfer function, the Rec.2020 gamut, the recovered highlights — all discarded at the moment the standard canvas is created. The photograph may look identical on an SDR screen, but the output is no longer an HDR image in any meaningful technical sense.</p>
              <p>Every subsequent operation — adding text, compositing graphic overlays, drawing frame elements — compounds the problem. The more "post-processing" that happens after the initial HDR degradation, the further the output drifts from the original radiometric fidelity. raw2hdr solves this by performing all frame compositing in the native processing layer, in the same floating-point HDR context that holds the processed photograph.</p>
            </DetailsPanel>

            <DetailsPanel title="Custom typography without HDR compromise" accent="border-rose-500/20">
              <p>Text rendering in frame designs uses the platform's CoreText engine, which provides professional-grade glyph rasterisation with sub-pixel anti-aliasing. When rendered into the 16-bit HDR compositing context, this anti-aliasing produces fractional alpha values (the partial pixel coverage at character edges) that blend against the HDR image background at full floating-point precision.</p>
              <p>In a standard 8-bit context, these same fractional alpha values would be quantised to 8-bit, producing visible staircasing at glyph edges when viewed at high magnification or displayed on a high-DPI screen. In the 16-bit HDR context, they are preserved at full precision and produce visually smooth character edges even at extreme zoom.</p>
            </DetailsPanel>

          </Section>

          {/* ─── 12 ─── */}
          <Section id="cache" number="12" icon={<Database className="w-5 h-5 text-emerald-400" />}
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

          {/* ─── 13 ─── */}
          <Section id="logprofile" number="13" icon={<Settings className="w-5 h-5 text-cyan-400" />}
            accentColor="bg-cyan-500/10" gradientFrom="from-cyan-300"
            title="Log Profile System" subtitle="Data-driven per-manufacturer calibration — adding a new format requires only a new profile">
            <p>Each manufacturer chose different log curve shapes, midpoint placements, and headroom ratios. None were coordinated across manufacturers. Rather than hardcoding these relationships, raw2hdr uses a fully data-driven profile system with seven parameters per log format.</p>
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-800 text-xs font-mono text-gray-500 uppercase tracking-widest">Log Profile Parameters</div>
              {[
                ['Exposure scale', 'Aligns linear 18% gray to the midpoint position the LUT expects for midtone input.'],
                ['Log curve shape', 'Manufacturer-specific log OETF coefficients (F-Log2, V-Log, L-Log, Mi-Log each differ).'],
                ['Log midpoint', 'The log-encoded value corresponding to 18% gray — the tonal contrast reference point.'],
                ['Contrast scale', 'Expands or contracts the tonal range around the midpoint to match LUT expectations.'],
                ['Per-channel calibration gains', 'Independent R/G/B corrections for systematic colour balance offsets vs. native decode.'],
                ['Saturation scale', 'Optional midtone saturation adjustment for LUT packs designed for video workflows.'],
                ['HDR highlight extension gain', 'Controls aggressiveness of logarithmic highlight extension — tuned per LUT aesthetic.'],
              ].map(([param, desc], i) => (
                <div key={i} className={`flex gap-4 px-5 py-3 border-b border-zinc-800/50 last:border-0 ${i % 2 === 0 ? 'bg-black/10' : ''}`}>
                  <div className="text-sm text-cyan-300 font-mono w-52 flex-shrink-0 leading-relaxed">{param}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
            <Callout variant="note">
              <strong>Calibration:</strong> Parameters are determined empirically by shooting a gray card and colour checker on each target camera, then iteratively adjusting until the synthetic log encode matches the camera SOOC JPEG across the full tonal range. The calibration absorbs any offset the manufacturer baked into their RAW-to-log pipeline.
            </Callout>

            <DetailsPanel title="Output normalisation: three distinct strategies" accent="border-cyan-500/20">
              <p>LUTs from different sources embed different assumptions about their output range. A professionally-authored LUT produced in post-production software is designed with full range normalisation built in. A community-authored LUT may have its black point slightly above true zero or its white point slightly below the maximum. Without normalisation, these systematic offsets would cause output to appear systematically lighter, darker, or lower-contrast than intended.</p>
              <p><strong className="text-white">Pass-through (no normalisation):</strong> The LUT output is used directly. Appropriate for professionally-authored, self-normalising LUT packs — most manufacturer-official distribution packs fall into this category. Applying normalisation to already-normalised LUTs would double-correct and introduce systematic errors.</p>
              <p><strong className="text-white">Endpoint normalisation:</strong> The LUT is probed at two known reference points — scene black and maximum expected highlight level. The resulting output values establish the actual min and max of the LUT's range. The pipeline linearly rescales all output to fill a consistent range, with a deliberate 5% headroom reserved at the top for the HDR highlight extension step. This handles LUTs with systematic range offsets — common with community-authored packs and video-workflow LUTs.</p>
              <p><strong className="text-white">Midpoint gamma normalisation:</strong> This applies endpoint normalisation first, then checks whether the normalised midtone (18% grey passed through the LUT and normalised) lands at the expected target level. If it is systematically dark or bright, a power-function correction brings the midtone into alignment. This handles a specific class of LUT behaviour common with Panasonic V-Log packs, where the 18% grey midtone target falls at a different normalised position than other manufacturers' conventions. Without this correction, V-Log LUT output would have a systematically offset midtone regardless of endpoint normalisation.</p>
            </DetailsPanel>
          </Section>

          {/* ─── 14 ─── */}
          <Section id="lens" number="14" icon={<Eye className="w-5 h-5 text-indigo-400" />}
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
              <p>The mathematical model — a polynomial radial model with three to four coefficients — is the standard model employed by the Lensfun open database, which provides distortion coefficients for thousands of lens-camera combinations. The correction polynomial is applied in normalised image coordinates, making it independent of image resolution and correctly applicable at any output scale.</p>
            </DetailsPanel>

            <DetailsPanel title="Vignetting correction in polar coordinates" accent="border-indigo-500/20">
              <p>Natural vignetting produces a characteristic circular darkening centred on the optical axis, with the darkening increasing monotonically toward the corners. The profile of the falloff varies with lens design, aperture, and focal length.</p>
              <p>The correction is a multiplicative brightening applied in polar-coordinate space: for each pixel, compute its distance from the image centre normalised to the half-diagonal, evaluate the correction polynomial at that radius, and multiply the pixel value by the correction factor. The correction is the reciprocal of the vignetting attenuation function, so applying it in linear light exactly restores the true scene luminance at each position.</p>
              <p>The polynomial model for vignetting (typically a fourth- or sixth-order polynomial in radial distance) is also sourced from the Lensfun database. The higher-order polynomial allows the correction to accurately model lenses that have a complex vignetting profile — for example, lenses that vignette moderately at the edges but sharply at the extreme corners due to mechanical vignetting at the lens mount.</p>
              <p>Because vignetting correction increases the brightness of corner and edge pixels, it must be applied <em>before</em> HDR encoding to ensure that the recovered highlight values in those regions are correctly placed in the HDR signal range. A corner sky pixel that was 10% darker than the centre due to vignetting, when corrected in linear light, may now have a scene-linear value above SDR white — entering the same highlight extension path the rest of the sky went through. If vignetting correction were applied <em>after</em> HDR encoding, that pixel would have been incorrectly encoded at the vignetting-darkened level and the correction would attempt to brighten an already-encoded value in HLG space, producing an incorrect and visually inconsistent result.</p>
            </DetailsPanel>
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

          <div className="mt-12 pt-6 border-t border-gray-800 text-xs text-gray-600 text-center">
            raw2hdr Technical Deep Dive · Engineering Reference
          </div>
        </main>
      </div>
    </div>
  );
};

export default TechnicalDeepDive;
