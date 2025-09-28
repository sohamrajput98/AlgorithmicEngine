import React from "react";

// named export
export function ArrayBlock({ value, isActive = false, index }) {
  return (
    <div
      aria-label={`array-item-${index}`}
      className={`flex items-center justify-center rounded-lg text-white font-semibold shadow-md transition-transform transform ${
        isActive
          ? "bg-gradient-to-r from-purple-500 to-indigo-500 scale-105 shadow-xl"
          : "bg-gray-700"
      }`}
      style={{ minWidth: 56, minHeight: 56 }}
    >
      {String(value)}
    </div>
  );
}
