import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

/**
 * Named export Charts — visualizer-specific.
 * If provided an array of numbers, render a bar chart. If objects, try to map keys.
 */
export function Charts({ data = [] }) {
  // Normalize input to [{x: idx, y: val}]
  const safeData = Array.isArray(data)
    ? data.map((v, i) => ({ x: String(i), y: typeof v === "number" ? v : Number(v || 0) }))
    : [];

  if (!safeData.length) {
    return <div className="bg-gray-800 p-4 rounded-xl text-gray-400">No chart data</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md">
      <h3 className="text-white font-semibold mb-3">Array Metrics</h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={safeData}>
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
            <XAxis dataKey="x" tick={{ fill: "#e5e7eb" }} />
            <YAxis tick={{ fill: "#e5e7eb" }} />
            <Tooltip />
            <Legend wrapperStyle={{ color: "#e5e7eb" }} />
            <Bar dataKey="y" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* small line chart below for smoothness visualization */}
      <div className="mt-4" style={{ width: "100%", height: 120 }}>
        <ResponsiveContainer>
          <LineChart data={safeData}>
            <Line type="monotone" dataKey="y" stroke="#60a5fa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
