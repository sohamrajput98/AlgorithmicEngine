import React, { useState } from "react";

export default function Visualizer() {
  const [selectedAlgo, setSelectedAlgo] = useState("two-pointers");

  const renderVisualization = () => {
    switch (selectedAlgo) {
      case "two-pointers":
        return (
          <div className="p-8 bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl shadow-xl text-center text-white">
            <h2 className="text-2xl font-semibold mb-6">Two Pointers</h2>
            <div className="flex justify-center gap-4">
              {[1, 3, 5, 7, 9].map((num, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 flex items-center justify-center bg-blue-500 rounded-lg text-lg font-semibold relative"
                >
                  {num}
                  {idx === 0 && (
                    <span className="absolute -top-6 text-sm text-yellow-300 font-semibold">L</span>
                  )}
                  {idx === 4 && (
                    <span className="absolute -top-6 text-sm text-pink-300 font-semibold">R</span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-base text-gray-200 font-medium">
              Example: Two pointers starting at both ends of the array.
            </p>
          </div>
        );

      case "binary-search":
        return (
          <div className="p-8 bg-gradient-to-br from-green-800 to-green-600 rounded-2xl shadow-xl text-center text-white">
            <h2 className="text-2xl font-semibold mb-6">Binary Search</h2>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((num, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 flex items-center justify-center bg-green-500 rounded-lg text-lg font-semibold relative"
                >
                  {num}
                  {idx === 3 && (
                    <span className="absolute -top-6 text-sm text-yellow-300 font-semibold">Mid</span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-base text-gray-200 font-medium">
              Example: Searching the middle element in a sorted array.
            </p>
          </div>
        );

      case "bubble-sort":
        return (
          <div className="p-8 bg-gradient-to-br from-purple-800 to-purple-600 rounded-2xl shadow-xl text-center text-white">
            <h2 className="text-2xl font-semibold mb-6">Bubble Sort</h2>
            <div className="flex justify-center gap-4 items-end">
              {[5, 3, 8, 4, 2].map((num, idx) => (
                <div
                  key={idx}
                  className={`w-16 h-${num * 4} flex items-end justify-center bg-purple-500 rounded-lg relative`}
                >
                  <span className="text-base font-semibold mb-2">{num}</span>
                  {(idx === 1 || idx === 2) && (
                    <span className="absolute -top-6 text-sm text-yellow-200 font-semibold">Compare</span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-base text-gray-200 font-medium">
              Example: Comparing adjacent elements to sort the array.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-10 text-center">Algorithm Visualizer</h1>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
        >
          <option value="two-pointers">Two Pointers</option>
          <option value="binary-search">Binary Search</option>
          <option value="bubble-sort">Bubble Sort</option>
        </select>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow text-white font-semibold">
          Play
        </button>
        <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg shadow text-white font-semibold">
          Pause
        </button>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow text-white font-semibold">
          Reset
        </button>
      </div>

      {/* Visualization */}
      <div className="w-full max-w-2xl">{renderVisualization()}</div>
    </div>
  );
}