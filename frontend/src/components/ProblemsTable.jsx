import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaPen, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { FiStar } from 'react-icons/fi';

// --- Star Rating Component ---
const StarRating = ({ stars }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <FiStar key={i} className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
    ))}
  </div>
);

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
  if (status === 'Solved') {
    return <FaCheckCircle className="text-green-500 text-xl mx-auto" title="Solved" />;
  }
  if (status === 'Attempted') {
    return <FaPen className="text-yellow-500 text-lg mx-auto" title="Attempted" />;
  }
  return <div className="w-5 h-5"></div>; // Placeholder for alignment
};

// --- Main Table Component ---
export const ProblemsTable = ({ problems, sortConfig, onSort }) => {
  
  const SortableHeader = ({ columnKey, title, className = '' }) => {
    const isSorted = sortConfig.key === columnKey;
    const Icon = isSorted ? (sortConfig.direction === 'asc' ? FaSortUp : FaSortDown) : FaSort;
    return (
      <th 
        onClick={() => onSort(columnKey)} 
        className={`p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors ${className}`}
      >
        <div className="flex items-center gap-2">{title} <Icon className="text-gray-500" /></div>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-900/50">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="p-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Status</th>
            <SortableHeader columnKey="title" title="Title" />
            <th className="p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags</th>
            <SortableHeader columnKey="stars" title="Difficulty" />
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {problems.map((prob) => (
            <tr key={prob.id} className="hover:bg-gray-800/50 transition-colors duration-200">
              <td className="p-4 whitespace-nowrap"><StatusBadge status={prob.status} /></td>
              <td className="p-4 whitespace-nowrap max-w-sm truncate">
                <Link to={`/problems/${prob.id}`} className="font-medium text-white hover:text-purple-400 transition-colors">
                  {prob.title}
                </Link>
              </td>
              <td className="p-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-2">
                  {/* 🧠 UI UPDATE: Added gradient to tags */}
                  {prob.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-xs font-semibold text-indigo-100 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 rounded-full">{tag}</span>
                  ))}
                </div>
              </td>
              <td className="p-4 whitespace-nowrap"><StarRating stars={prob.stars} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};