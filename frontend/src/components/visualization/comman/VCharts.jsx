import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

/**
 * Charts Component (Restyled for recharts)
 * Visualizer-specific charts with a dark, metallic theme.
 */
export function Charts({ data = [] }) {
  const safeData = Array.isArray(data)
    ? data.map((v, i) => ({ x: String(i), y: typeof v === "number" ? v : Number(v || 0) }))
    : [];

  if (!safeData.length) {
    return (
      <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] p-4 rounded-xl shadow-lg border border-gray-700 h-64 flex items-center justify-center">
        <div className="text-gray-400">No chart data</div>
      </div>
    );
  }

  // Custom styled tooltip for a consistent look
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-700 backdrop-blur-sm">
          <p className="text-sm text-purple-300">{`Index: ${label}`}</p>
          <p className="text-lg font-bold text-white">{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] p-4 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-white font-semibold mb-3 text-lg">Array Visualization</h3>
      {/* Main Bar Chart */}
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={safeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" />
            <XAxis dataKey="x" tick={{ fill: "#9ca3af" }} fontSize={12} />
            <YAxis tick={{ fill: "#9ca3af" }} fontSize={12} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
            <Bar dataKey="y" fill="url(#chartGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Small trend line chart */}
      <div className="mt-4 opacity-70" style={{ width: "100%", height: 60 }}>
        <ResponsiveContainer>
          <LineChart data={safeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <Line type="monotone" dataKey="y" stroke="#60a5fa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}