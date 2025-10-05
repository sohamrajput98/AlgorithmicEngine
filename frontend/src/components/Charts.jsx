import React from "react";
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Brush,
  PieChart as RPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// Color palette for visualizer charts
const COLORS = ["#8b5cf6", "#60a5fa", "#34d399", "#f59e0b", "#f472b6"];

// Safe label formatter
const safeLabel = (d) => (d ? (typeof d === "string" ? d : d.toString()) : "");

// Line chart for array metrics (like swaps or step progression)
export function LineChart({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Array Metrics</h2>
      {!hasData ? (
        <div className="text-gray-400">No data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="x" tickFormatter={safeLabel} stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip labelFormatter={(l) => `Step: ${safeLabel(l)}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
            <Brush dataKey="x" height={30} stroke="#8884d8" />
          </RLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// Pie chart for algorithm-specific breakdowns (e.g., pivot distribution)
export function PieChart({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Algorithm Breakdown</h2>
      {!hasData ? (
        <div className="text-gray-400">No breakdown data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              dataKey="y"
              label={(entry) => `${entry.x}: ${entry.y}`}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => [`${val}`, "Count"]} />
            <Legend />
          </RPieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// Bar chart for attempts vs success in steps or segments
export function CategoryBarChart({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;

  
}
