import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { getToken } from "../services/auth";
import { Link } from "react-router-dom";

export default function ProblemList() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [sortBy, setSortBy] = useState("difficulty");
  const [selectedTopics, setSelectedTopics] = useState([]);

  const fakeTopics = ["Arrays", "Graphs", "DP", "Greedy", "Math", "Strings"];

  const { data: problems, isLoading, error } = useQuery({
    queryKey: ["problems"],
    queryFn: async () => {
      const res = await api.get("/problems", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    },
    retry: false,
  });

  const allTags = useMemo(() => {
    if (!problems) return [];
    const tagsSet = new Set();
    problems.forEach(p => p.tags?.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }, [problems]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleTopic = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const filteredProblems = useMemo(() => {
    if (!problems) return [];
    const order = { easy: 1, medium: 2, hard: 3 };

    let filtered = problems
      .filter(p =>
        selectedTags.length > 0 ? selectedTags.every(tag => p.tags?.includes(tag)) : true
      )
      .filter(p =>
        difficultyFilter
          ? p.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()
          : true
      )
      .filter(p =>
        selectedTopics.length > 0
          ? selectedTopics.every(topic => p.title?.toLowerCase().includes(topic.toLowerCase()))
          : true
      );

    if (sortBy === "difficulty") {
      filtered.sort((a, b) => {
        const aDiff = a.difficulty?.toLowerCase() || "unknown";
        const bDiff = b.difficulty?.toLowerCase() || "unknown";
        return (order[aDiff] || 4) - (order[bDiff] || 4);
      });
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [problems, selectedTags, difficultyFilter, selectedTopics, sortBy]);

  if (isLoading)
    return <div className="text-center mt-20 text-gray-500">Loading problems...</div>;

  if (error)
    return (
      <div className="text-center mt-20 text-red-600">
        Error loading problems: {error.message}
      </div>
    );

  if (!problems || problems.length === 0)
    return (
      <div className="text-center mt-20 text-gray-500">No problems available yet.</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-4xl font-extrabold text-white text-center bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-xl shadow-lg">
        Problems
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedTags.includes(tag)
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {tag} {selectedTags.includes(tag) && "×"}
          </button>
        ))}
        <select
          value={difficultyFilter}
          onChange={e => setDifficultyFilter(e.target.value)}
          className="ml-auto px-3 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Fake Topic Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {fakeTopics.map(topic => (
          <button
            key={topic}
            onClick={() => toggleTopic(topic)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedTopics.includes(topic)
                ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {topic} {selectedTopics.includes(topic) && "❌"}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setSortBy("difficulty")}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
              sortBy === "difficulty"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            Sort by Difficulty
          </button>
          <button
            onClick={() => setSortBy("title")}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
              sortBy === "title"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            Sort by Title
          </button>
        </div>
      </div>

      {/* Problem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((prob) => (
          <div
            key={prob.id}
            className="bg-gray-900 text-gray-100 shadow-xl rounded-2xl p-6 hover:shadow-2xl transition border border-gray-700 flex flex-col justify-between"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">{prob.title}</h2>
              <p className="text-gray-300 text-sm mb-2">{prob.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {prob.tags?.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full hover:from-purple-600 hover:to-indigo-600 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {prob.difficulty && (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    prob.difficulty.toLowerCase() === "easy"
                      ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                      : prob.difficulty.toLowerCase() === "medium"
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                      : "bg-gradient-to-r from-red-400 to-red-600 text-white"
                  }`}
                >
                  {prob.difficulty}
                </span>
              )}
            </div>

            <Link
              to={`/problems/${prob.id}`}
              className="mt-auto inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-indigo-600 text-center transition shadow-md"
            >
              View Problem
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}