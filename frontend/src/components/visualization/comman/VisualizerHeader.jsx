import React from 'react';
import { FiChevronDown, FiInfo } from 'react-icons/fi';

/**
 * VisualizerHeader Component
 * Displays the algorithm selection dropdowns and the current algorithm's name.
 * @param {string} algorithmName - The name of the currently selected algorithm.
 * @param {Array<string>} categories - A list of algorithm categories (e.g., "Sorting", "Searching").
 * @param {string} selectedCategory - The currently selected category.
 * @param {function} setSelectedCategory - Function to update the selected category.
 * @param {object} algorithms - An object mapping categories to lists of algorithms.
 * @param {string} selectedAlgorithm - The currently selected algorithm key.
 * @param {function} setSelectedAlgorithm - Function to update the selected algorithm.
 */
export function VisualizerHeader({
  algorithmName,
  categories,
  selectedCategory,
  setSelectedCategory,
  algorithms,
  selectedAlgorithm,
  setSelectedAlgorithm,
}) {

  // Custom styles for the dropdown to match the metallic theme
  const selectStyles = "w-full text-white bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none";

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-[#1f2937] to-[#111827] rounded-xl shadow-lg border border-gray-700 mb-6">

      {/* Algorithm Selection Dropdowns */}
      <div className="flex-1 w-full md:w-auto flex flex-col sm:flex-row gap-4">
        {/* Category Dropdown */}
        <div className="relative w-full">
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={selectStyles}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Algorithm Dropdown */}
        <div className="relative w-full">
          <select
            id="algorithm-select"
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className={selectStyles}
            disabled={!selectedCategory}
          >
            {selectedCategory && algorithms[selectedCategory]?.map((algo) => (
              <option key={algo.key} value={algo.key}>{algo.name}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Algorithm Info Block */}
      <div className="flex-shrink-0 flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-lg border border-purple-500/30">
        <FiInfo className="text-purple-400" size={20} />
        <h2 className="text-lg font-semibold text-white tracking-wider">
          {algorithmName || "Select an Algorithm"}
        </h2>
      </div>
    </div>
  );
}