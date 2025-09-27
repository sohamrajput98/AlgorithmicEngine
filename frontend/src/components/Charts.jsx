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

// Color palette (keeps violets but not everywhere)
const COLORS = ["#8b5cf6", "#60a5fa", "#34d399", "#f59e0b", "#f472b6"];

// Safe helpers
const safeDateLabel = (d) => {
  if (!d) return "";
  // if ISO-ish date, return as is; else toString
  return typeof d === "string" ? d : (d.toString ? d.toString() : "");
};

export function LineChart({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Submissions Over Time</h2>
      {!hasData ? (
        <div className="text-gray-400">No submission history to show.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="x" tickFormatter={safeDateLabel} stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip labelFormatter={(l) => `Date: ${safeDateLabel(l)}`} />
            <Legend />
            <Line type="monotone" dataKey="y" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            <Brush dataKey="x" height={30} stroke="#8884d8" />
          </RLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function PieChart({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Problem Difficulty</h2>
      {!hasData ? (
        <div className="text-gray-400">No difficulty distribution available.</div>
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}`, "Solved"]} />
            <Legend />
          </RPieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function CategoryBarChart({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-8">
      <h2 className="text-lg font-semibold mb-4">Solved vs Attempted</h2>
      {!hasData ? (
        <div className="text-gray-400">No category data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="category" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Legend />
            <Bar dataKey="attempted" fill="#60a5fa" />
            <Bar dataKey="solved" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
