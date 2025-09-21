// ProblemList.jsx (visual enhancement only)
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { getToken } from "../services/auth";
import { Link } from "react-router-dom";

export default function ProblemList() {
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
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
        Problems
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((prob) => (
          <div
            key={prob.id}
            className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition border border-gray-200 flex flex-col justify-between"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{prob.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{prob.description}</p>
              {prob.difficulty && (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    prob.difficulty.toLowerCase() === "easy"
                      ? "bg-green-100 text-green-700"
                      : prob.difficulty.toLowerCase() === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {prob.difficulty}
                </span>
              )}
            </div>

            <Link
              to={`/problems/${prob.id}`}
              className="mt-auto inline-block px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 text-center transition"
            >
              View Problem
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
