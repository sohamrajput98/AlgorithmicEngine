import React from "react";

/**
 * ArrayBlock
 * - value: number|string
 * - highlight: optional string indicating state: "compare"|"swap"|"pointer"|"mid"|"active"
 * - index: optional index for custom styling
 *
 * NOTE: Keep styles simple here; when you give me a UI template I will show where to plug template classes.
 */
export default function ArrayBlock({ value, highlight = "", index = 0 }) {
  // highlight -> style mapping
  let extra = "bg-blue-500 text-white";
  if (highlight === "compare") extra = "bg-yellow-400 text-black";
  else if (highlight === "swap") extra = "bg-red-400 text-white";
  else if (highlight === "pointer") extra = "bg-pink-400 text-white";
  else if (highlight === "mid") extra = "bg-green-400 text-black";
  else if (highlight === "active") extra = "bg-indigo-400 text-white";

  // compute a height clamp (defensive)
  const numeric = typeof value === "number" ? Math.max(8, Math.min(120, value * 3)) : 40;

  return (
    <div className={`flex flex-col items-center`}>
      <div
        className={`w-12 rounded ${extra} flex items-end justify-center shadow transition-all duration-400`}
        style={{ height: `${numeric}px` }}
      >
        <span className="text-sm font-semibold mb-1 select-none">{value}</span>
      </div>
    </div>
  );
}
