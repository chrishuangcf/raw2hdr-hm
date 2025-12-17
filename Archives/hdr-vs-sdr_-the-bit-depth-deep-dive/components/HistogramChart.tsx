import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { ColorMode, DataPoint } from '../types';

interface HistogramChartProps {
  mode: ColorMode;
}

export const HistogramChart: React.FC<HistogramChartProps> = ({ mode }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate synthetic data
  // We want a curve that looks good. A combination of Gaussians.
  const data: DataPoint[] = useMemo(() => {
    const points: DataPoint[] = [];
    const maxVal = 1024; // HDR max
    
    // Create a complex distribution
    for (let i = 0; i < maxVal; i++) {
      // Mixture of Gaussians to make it look like a photo histogram
      const y1 = Math.exp(-Math.pow(i - 300, 2) / 20000);
      const y2 = Math.exp(-Math.pow(i - 700, 2) / 15000) * 0.7;
      const noise = (Math.random() - 0.5) * 0.05;
      points.push({
        value: i,
        frequency: Math.max(0, y1 + y2 + noise) * 100
      });
    }
    return points;
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Scale
    // SDR: 0-255, HDR: 0-1023
    const xMax = mode === ColorMode.SDR ? 255 : 1023;
    const xScale = d3.scaleLinear()
      .domain([0, xMax])
      .range([0, width]);

    // Y Scale
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.frequency) || 100])
      .range([height, 0]);

    // Draw Axes
    const xAxis = d3.axisBottom(xScale).ticks(mode === ColorMode.SDR ? 5 : 10);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "text-gray-400")
      .call(xAxis);

    g.append("g")
      .attr("class", "text-gray-400")
      .call(yAxis);

    // Labels
    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + 35)
      .attr("text-anchor", "middle")
      .attr("fill", "#9ca3af")
      .attr("font-size", "12px")
      .text(mode === ColorMode.SDR ? "Luminance Level (0-255)" : "Luminance Level (0-1023)");

    // Drawing the bars/lines
    const color = mode === ColorMode.SDR ? "#fbbf24" : "#38bdf8";

    if (mode === ColorMode.SDR) {
      // Downsample data for SDR: Average every 4 values to simulate 8-bit binning
      const sdrData: DataPoint[] = [];
      for (let i = 0; i < 256; i++) {
        let sum = 0;
        for(let j=0; j<4; j++) sum += data[i*4 + j]?.frequency || 0;
        sdrData.push({ value: i, frequency: sum / 4 });
      }

      g.selectAll(".bar")
        .data(sdrData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.value))
        .attr("y", d => yScale(d.frequency))
        .attr("width", width / 256) // Visible discrete bars
        .attr("height", d => height - yScale(d.frequency))
        .attr("fill", color)
        .attr("opacity", 0.8);
        
    } else {
      // HDR: Draw path for smoothness or thin rects
      // Using area chart for 10-bit smooth look
      const area = d3.area<DataPoint>()
        .x(d => xScale(d.value))
        .y0(height)
        .y1(d => yScale(d.frequency))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(data)
        .attr("fill", "url(#hdr-gradient)")
        .attr("d", area)
        .attr("stroke", color)
        .attr("stroke-width", 1.5);

      // Add gradient def
      const defs = svg.append("defs");
      const gradient = defs.append("linearGradient")
        .attr("id", "hdr-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
      gradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.6);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.1);
    }

  }, [mode, data]);

  return (
    <div ref={containerRef} className="w-full bg-gray-900 rounded-lg p-4 shadow-inner">
      <svg ref={svgRef} className="w-full h-[300px] overflow-visible"></svg>
    </div>
  );
};