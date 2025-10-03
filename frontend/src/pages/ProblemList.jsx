import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProblems } from "../services/problems";
import { ProblemsTable } from "../components/ProblemsTable";
import api from "../services/api";
import { LoginPrompt } from "../components/LoginPrompt";
import { FiSearch, FiX } from "react-icons/fi";
import { getToken } from "../services/auth";

const useTags = () => {
  const token = getToken();
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await api.get("/problems/tags");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  });
};

export default function ProblemList() {
  const [sortConfig, setSortConfig] = useState({ key: 'stars', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    stars: "",
    tags: "" // ✅ updated from 'tag'
  });

  const token = getToken();
  const { data: tagsData = [] } = useTags();

  const { data: problems, isLoading, error } = useQuery({
    queryKey: ["problems", sortConfig, searchQuery, filters],
    queryFn: () => fetchProblems({
      sort_by: sortConfig.key,
      order: sortConfig.direction,
      search: searchQuery || undefined,
      status: filters.status || undefined,
      stars: filters.stars || undefined,
      tags: filters.tags || undefined, // ✅ updated from 'tag'
      limit: 100,
    }),
    retry: false,
    placeholderData: (prevData) => prevData,
    enabled: !!token,
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({ status: "", stars: "", tags: "" }); // ✅ updated from 'tag'
    setSortConfig({ key: 'stars', direction: 'asc' });
  };

  if (!token) { return <LoginPrompt />; }
  if (error) {
    if (error.response?.status === 401) return <LoginPrompt />;
    return <div className="text-center py-20 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 bg-gray-900 text-white">
      <div className="text-left">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
          Problemset
        </h1>
        <p className="mt-2 text-gray-400">Hone your skills with our curated collection of challenges.</p>
      </div>

      <div className="space-y-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems..."
            className="w-full bg-gray-900 text-white rounded-md p-2.5 pl-10 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select name="stars" value={filters.stars} onChange={handleFilterChange} className="bg-gray-900 text-white rounded-md p-2.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 h-full appearance-none">
            <option value="">All Difficulties</option>
            <option value="1">★☆☆☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="3">★★★☆☆</option>
            <option value="4">★★★★☆</option>
            <option value="5">★★★★★</option>
          </select>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="bg-gray-900 text-white rounded-md p-2.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 h-full appearance-none">
            <option value="">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="Attempted">Attempted</option>
            <option value="Solved">Solved</option>
          </select>
          <select name="tags" value={filters.tags} onChange={handleFilterChange} className="bg-gray-900 text-white rounded-md p-2.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 h-full appearance-none">
            <option value="">All Tags</option>
            {tagsData.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-md hover:opacity-90 transition-opacity h-full flex items-center justify-center gap-2"
          >
            <FiX /> Reset
          </button>
        </div>
      </div>

      <ProblemsTable
        problems={problems || []}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      {isLoading && !problems && <p className="text-center text-gray-500 animate-pulse">Loading problems...</p>}
    </div>
  );
}