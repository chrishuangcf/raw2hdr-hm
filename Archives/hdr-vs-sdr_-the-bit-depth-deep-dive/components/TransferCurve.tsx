import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

export const TransferCurve: React.FC = () => {
  // Generate curve data
  // Rec.709 (Gamma 2.4 approx) vs PQ (ST 2084)
  // X axis: Signal Input (0 to 1)
  // Y axis: Luminance (Nits)
  
  const data = [];
  for (let i = 0; i <= 100; i++) {
    const input = i / 100; // 0 to 1
    
    // SDR: Gamma 2.4. Usually mapped to 100 nits peak on reference display.
    // L = V^2.4
    const sdrNits = Math.pow(input, 2.4) * 100;
    
    // HDR: PQ Curve (Conceptual)
    // The PQ curve is absolute. 
    // Let's simplify for visualization: PQ curve allocates bits differently.
    // A 75% signal in PQ is much brighter than 75% in SDR.
    // Real PQ formula is complex, this is a visual approximation for educational purposes showing the headroom.
    // PQ 1.0 = 10,000 nits.
    // We will scale graph to 1000 nits for readability.
    
    // Simulating the "Lift" of PQ
    const pqNits = Math.pow(input, 4) * 1000; // NOT ACCURATE MATH, visual approximation of the "Headroom" curve shape
    
    data.push({
      input: input.toFixed(2),
      SDR: sdrNits,
      HDR: pqNits, 
    });
  }

  return (
    <div className="h-[400px] w-full bg-gray-900 rounded-lg p-4 text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="input" 
            label={{ value: 'Digital Input Signal (0.0 - 1.0)', position: 'bottom', fill: '#9ca3af', offset: 0 }} 
            tick={{fill: '#6b7280'}}
          />
          <YAxis 
            label={{ value: 'Luminance (Nits)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} 
            tick={{fill: '#6b7280'}}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
            formatter={(value: number) => [`${value.toFixed(1)} nits`, '']}
          />
          <Line 
            type="monotone" 
            dataKey="SDR" 
            stroke="#fbbf24" 
            strokeWidth={3} 
            dot={false}
            name="SDR (Gamma / Rec.709)"
          />
          <Line 
            type="monotone" 
            dataKey="HDR" 
            stroke="#38bdf8" 
            strokeWidth={3} 
            dot={false}
            name="HDR (PQ / Rec.2020)"
          />
          <ReferenceLine y={100} stroke="#fbbf24" strokeDasharray="3 3">
            <Label value="SDR Peak (100 nits)" position="insideTopRight" fill="#fbbf24" />
          </ReferenceLine>
           <ReferenceLine y={1000} stroke="#38bdf8" strokeDasharray="3 3">
            <Label value="HDR Common Peak (1000+ nits)" position="insideBottomRight" fill="#38bdf8" />
          </ReferenceLine>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};