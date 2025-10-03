import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProblemById, fetchSimilarProblems, fetchProblemTestcases } from "../services/problems";
import { useState } from "react";

const ProblemView = () => {
  const { id } = useParams();
  const [showSimilar, setShowSimilar] = useState(false);
  const [testcases, setTestcases] = useState([]);

  const { data: problem, isLoading, error } = useQuery({
    queryKey: ["problem", id],
    queryFn: () => fetchProblemById(id),
    retry: false,
  });

  // Fetch all testcases including their results
  useQuery({
    queryKey: ["problemTestcases", id],
    queryFn: () => fetchProblemTestcases(id),
    onSuccess: (data) => {
      if (Array.isArray(data)) setTestcases(data);
    },
    enabled: !!id,
    retry: false,
  });

  const { data: similarProblems = [], refetch: fetchSimilar, isFetching } = useQuery({
    queryKey: ["similarProblems", id],
    queryFn: () => fetchSimilarProblems(id, 5),
    enabled: false,
  });

  if (isLoading) return <div className="p-6 text-gray-400">Loading problem...</div>;
  if (error) return <div className="p-6 text-red-600">❌ Error loading problem</div>;

  const handleShowSimilar = async () => {
    await fetchSimilar();
    setShowSimilar(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Problem Card */}
      <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-3 text-white">{problem.title}</h1>
        <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-300">
          <span className="font-semibold">⭐ {problem.stars}</span>
          {problem.tags?.map(tag => (
            <span key={tag} className="bg-gradient-to-r from-purple-500 to-indigo-500 px-2 py-1 rounded-full text-white text-xs">
              {tag}
            </span>
          ))}
        </div>
        <pre className="whitespace-pre-wrap bg-gray-800 text-gray-200 p-4 rounded-lg shadow-inner">{problem.statement}</pre>
        

        

        <Link
          to={`/editor/${problem.id}`}
          className="mt-4 inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 transition"
        >
          Solve This Problem
        </Link>
      </div>

      {/* Similar Problems */}
      <div>
        <button
          onClick={handleShowSimilar}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 transition"
        >
          {isFetching ? "Loading..." : "Try Similar Problems"}
        </button>
      </div>

      {showSimilar && similarProblems.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {similarProblems.map(p => (
              <Link
                key={p.id}
                to={`/problems/${p.id}`}
                className="min-w-[250px] p-4 bg-gray-900 text-gray-100 rounded-xl shadow hover:shadow-lg transition flex-shrink-0"
              >
                <h2 className="font-semibold text-lg mb-2 text-white">{p.title}</h2>
                <div className="flex flex-wrap gap-1 text-xs text-gray-300 mb-2">
                  <span className="font-semibold">⭐ {p.stars}</span>
                  {p.tags?.slice(0, 4).map(tag => (
                    <span key={tag} className="bg-gradient-to-r from-purple-500 to-indigo-500 px-1 py-0.5 rounded-full text-white">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-200 text-sm line-clamp-3">{p.statement}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showSimilar && similarProblems.length === 0 && !isFetching && (
        <p className="mt-2 text-gray-300">No similar problems found.</p>
      )}
    </div>
  );
};

export default ProblemView;
