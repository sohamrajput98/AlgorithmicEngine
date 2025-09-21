import React from "react";

export default function StatsCard({ title, value, color = "bg-blue-500" }) {
  return (
    <div
      className={`${color} text-white p-6 rounded-2xl shadow-lg w-48 transition transform hover:-translate-y-1 hover:shadow-2xl`}
    >
      <h3 className="text-sm font-medium uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
