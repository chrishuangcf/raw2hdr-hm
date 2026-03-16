import React, { useEffect, useRef } from 'react';

// CIE 1931 2° standard observer – spectral locus xy at 5 nm steps (380–700 nm)
const LOCUS: [number, number, number][] = [
  [380, 0.1741, 0.0050], [385, 0.1740, 0.0050], [390, 0.1738, 0.0049],
  [395, 0.1736, 0.0049], [400, 0.1733, 0.0048], [405, 0.1730, 0.0048],
  [410, 0.1726, 0.0048], [415, 0.1721, 0.0048], [420, 0.1714, 0.0051],
  [425, 0.1703, 0.0058], [430, 0.1689, 0.0069], [435, 0.1669, 0.0086],
  [440, 0.1644, 0.0109], [445, 0.1611, 0.0138], [450, 0.1566, 0.0177],
  [455, 0.1510, 0.0227], [460, 0.1440, 0.0297], [465, 0.1355, 0.0399],
  [470, 0.1241, 0.0578], [475, 0.1096, 0.0868], [480, 0.0913, 0.1327],
  [485, 0.0687, 0.2007], [490, 0.0454, 0.2950], [495, 0.0235, 0.4127],
  [500, 0.0082, 0.5384], [505, 0.0039, 0.6548], [510, 0.0139, 0.7502],
  [515, 0.0389, 0.8120], [520, 0.0743, 0.8338], [525, 0.1142, 0.8262],
  [530, 0.1547, 0.8059], [535, 0.1929, 0.7816], [540, 0.2296, 0.7543],
  [545, 0.2658, 0.7243], [550, 0.3016, 0.6923], [555, 0.3373, 0.6589],
  [560, 0.3731, 0.6245], [565, 0.4087, 0.5896], [570, 0.4441, 0.5547],
  [575, 0.4788, 0.5202], [580, 0.5125, 0.4866], [585, 0.5448, 0.4544],
  [590, 0.5752, 0.4242], [595, 0.6029, 0.3965], [600, 0.6270, 0.3725],
  [605, 0.6482, 0.3514], [610, 0.6658, 0.3340], [615, 0.6801, 0.3197],
  [620, 0.6915, 0.3083], [625, 0.7006, 0.2993], [630, 0.7079, 0.2920],
  [635, 0.7140, 0.2859], [640, 0.7190, 0.2809], [645, 0.7230, 0.2770],
  [650, 0.7260, 0.2740], [655, 0.7283, 0.2717], [660, 0.7300, 0.2700],
  [665, 0.7311, 0.2689], [670, 0.7320, 0.2680], [675, 0.7327, 0.2673],
  [680, 0.7334, 0.2666], [685, 0.7340, 0.2660], [690, 0.7344, 0.2656],
  [695, 0.7346, 0.2654], [700, 0.7347, 0.2653],
];

const NM_LABELS = [380, 460, 470, 480, 490, 500, 520, 540, 560, 580, 600, 620, 700];
const D65: [number, number] = [0.3127, 0.3290];

// Canvas layout
const CW = 520, CH = 560;
const ML = 44, MR = 14, MT = 12, MB = 24;
const PW = CW - ML - MR;   // 462
const PH = CH - MT - MB;   // 524

// CIE xy → SVG pixel
const toX = (x: number) => ML + (x / 0.8) * PW;
const toY = (y: number) => MT + PH - (y / 0.9) * PH;

// Point-in-polygon
function pip(px: number, py: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// CIE xy (Y=1) → sRGB [0–255]
function xyToRgb(cx: number, cy: number): [number, number, number] {
  if (cy < 1e-6) return [0, 0, 0];
  const X = cx / cy, Y = 1, Z = (1 - cx - cy) / cy;
  let r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  let b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;
  const mx = Math.max(r, g, b, 1e-10);
  r = Math.max(0, r / mx); g = Math.max(0, g / mx); b = Math.max(0, b / mx);
  const gc = (v: number) => v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return [Math.round(gc(r) * 255), Math.round(gc(g) * 255), Math.round(gc(b) * 255)];
}

// Three gamut triangles: [r, g, b] primaries in CIE xy
const GAMUTS = [
  {
    label: 'sRGB',
    r: [0.640, 0.330] as [number, number],
    g: [0.300, 0.600] as [number, number],
    b: [0.150, 0.060] as [number, number],
    stroke: '#dc2626',   // red-600
    width: 1.5,
    dash: '6,3',
  },
  {
    label: 'Display P3',
    r: [0.680, 0.320] as [number, number],
    g: [0.265, 0.690] as [number, number],
    b: [0.150, 0.060] as [number, number],
    stroke: '#059669',   // emerald-600
    width: 1.5,
    dash: '4,3',
  },
  {
    label: 'Rec. 2020',
    r: [0.708, 0.292] as [number, number],
    g: [0.170, 0.797] as [number, number],
    b: [0.131, 0.046] as [number, number],
    stroke: '#2563eb',   // blue-600
    width: 2,
    dash: '',
  },
];

const GamutGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render spectral horseshoe background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const toCx = (px: number) => (px - ML) / PW * 0.8;
    const toCy = (py: number) => (MT + PH - py) / PH * 0.9;

    const poly: [number, number][] = [
      ...LOCUS.map(([, x, y]) => [x, y] as [number, number]),
      [LOCUS[0][1], LOCUS[0][2]],
    ];

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CW, CH);

    const img = ctx.createImageData(CW, CH);
    const d = img.data;
    for (let py = MT; py < MT + PH; py++) {
      for (let px = ML; px < ML + PW; px++) {
        if (pip(toCx(px + 0.5), toCy(py + 0.5), poly)) {
          const [r, g, b] = xyToRgb(toCx(px + 0.5), toCy(py + 0.5));
          const i = (py * CW + px) * 4;
          d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  // Build SVG polygon points string for a gamut triangle
  const pts = (r: [number,number], g: [number,number], b: [number,number]) =>
    `${toX(r[0])},${toY(r[1])} ${toX(g[0])},${toY(g[1])} ${toX(b[0])},${toY(b[1])}`;

  // Grid values
  const gx = Array.from({ length: 9 }, (_, i) => i * 0.1);   // 0.0–0.8
  const gy = Array.from({ length: 10 }, (_, i) => i * 0.1);  // 0.0–0.9

  // Legend position (top-right corner of plot)
  const LX = ML + PW - 112;
  const LY = MT + 12;

  return (
    <div className="relative w-full bg-white rounded-2xl shadow-xl overflow-hidden"
         style={{ aspectRatio: `${CW} / ${CH}` }}>
      {/* Spectral background (canvas) */}
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        className="absolute inset-0 w-full h-full"
      />

      {/* Vector overlay (SVG) */}
      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
        aria-label="CIE 1931 chromaticity diagram showing sRGB, Display P3 and Rec.2020 color gamuts"
      >
        {/* Grid lines */}
        {gx.map(x => (
          <line key={`gx${x}`} x1={toX(x)} y1={MT} x2={toX(x)} y2={MT + PH}
            stroke="rgba(100,149,200,0.35)" strokeWidth="0.5" />
        ))}
        {gy.map(y => (
          <line key={`gy${y}`} x1={ML} y1={toY(y)} x2={ML + PW} y2={toY(y)}
            stroke="rgba(100,149,200,0.35)" strokeWidth="0.5" />
        ))}

        {/* Plot border */}
        <rect x={ML} y={MT} width={PW} height={PH}
          fill="none" stroke="rgba(100,149,200,0.55)" strokeWidth="0.8" />

        {/* Gamut triangles (vector) */}
        {GAMUTS.map(g => (
          <polygon
            key={g.label}
            points={pts(g.r, g.g, g.b)}
            fill="none"
            stroke={g.stroke}
            strokeWidth={g.width}
            strokeDasharray={g.dash}
          />
        ))}

        {/* D65 white point */}
        <circle cx={toX(D65[0])} cy={toY(D65[1])} r="4" fill="#111" />
        <text x={toX(D65[0]) + 6} y={toY(D65[1]) + 4}
          fontSize="10" fill="#111" fontFamily="sans-serif">D65</text>

        {/* Wavelength labels */}
        {NM_LABELS.map(nm => {
          const pt = LOCUS.find(p => p[0] === nm);
          if (!pt) return null;
          const [, lx, ly] = pt;
          const dx = lx - D65[0], dy = ly - D65[1];
          const len = Math.hypot(dx, dy);
          const ox = (dx / len) * 14;
          const oy = -(dy / len) * 14;
          const anchor = ox > 2 ? 'start' : ox < -2 ? 'end' : 'middle';
          return (
            <text key={nm}
              x={toX(lx) + ox} y={toY(ly) + oy}
              fontSize="9" fill="#1a6aaa" fontFamily="sans-serif"
              textAnchor={anchor}>
              {nm}
            </text>
          );
        })}

        {/* X-axis tick labels */}
        {gx.map(x => (
          <text key={`xl${x}`} x={toX(x)} y={MT + PH + 15}
            fontSize="8.5" fill="#333" fontFamily="sans-serif" textAnchor="middle">
            {x.toFixed(1)}
          </text>
        ))}
        {/* Y-axis tick labels */}
        {gy.map(y => (
          <text key={`yl${y}`} x={ML - 4} y={toY(y) + 3}
            fontSize="8.5" fill="#333" fontFamily="sans-serif" textAnchor="end">
            {y.toFixed(1)}
          </text>
        ))}
        {/* Y-axis label */}
        <text
          x="10" y={MT + PH / 2}
          fontSize="10" fill="#444" fontWeight="bold" fontFamily="sans-serif"
          textAnchor="middle"
          transform={`rotate(-90 10 ${MT + PH / 2})`}>
          y
        </text>

        {/* Legend box */}
        <rect x={LX - 4} y={LY - 4} width="116" height="74"
          rx="5" fill="rgba(255,255,255,0.88)" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
        {GAMUTS.map((g, i) => {
          const ly = LY + 14 + i * 22;
          return (
            <g key={g.label}>
              <line x1={LX} y1={ly} x2={LX + 22} y2={ly}
                stroke={g.stroke} strokeWidth={g.width} strokeDasharray={g.dash} />
              <text x={LX + 28} y={ly + 4}
                fontSize="10" fill="#222" fontFamily="sans-serif">
                {g.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GamutGraph;
