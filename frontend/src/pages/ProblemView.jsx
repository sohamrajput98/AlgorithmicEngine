import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProblemById, fetchSimilarProblems } from '../services/problems';
import { useState } from 'react';

const ProblemView = () => {
  const { id } = useParams();
  const [showSimilar, setShowSimilar] = useState(false);

  const { data: problem, isLoading, error } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => fetchProblemById(id),
    retry: false,
  });

  const { data: similarProblems = [], refetch: fetchSimilar, isFetching } = useQuery({
    queryKey: ['similarProblems', id],
    queryFn: () => fetchSimilarProblems(id, 5),
    enabled: false, // manual fetch
  });

  if (isLoading) return <div className="p-6 text-gray-600">Loading problem...</div>;
  if (error) return <div className="p-6 text-red-600">❌ Error loading problem</div>;

  const handleShowSimilar = async () => {
    await fetchSimilar();
    setShowSimilar(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">{problem.title}</h1>
        <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-600">
          <span className="font-semibold">⭐ {problem.stars}</span>
          {problem.tags?.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        <pre className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-4 rounded-lg shadow-inner">{problem.statement}</pre>
        {problem.difficulty_notes && (
          <div className="mt-2 text-xs italic text-gray-500">Notes: {problem.difficulty_notes}</div>
        )}
        {problem.expected && (
          <div className="mt-2 text-xs italic text-gray-500">Expected Output: {problem.expected}</div>
        )}

        <Link
          to={`/editor/${problem.id}`}
          className="mt-4 inline-block bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-teal-600 transition"
        >
          Solve This Problem
        </Link>
      </div>

      <div>
        <button
          onClick={handleShowSimilar}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:from-purple-600 hover:to-indigo-600 transition"
        >
          {isFetching ? 'Loading...' : 'Try Similar Problems'}
        </button>
      </div>

      {showSimilar && similarProblems.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {similarProblems.map(p => (
              <Link
                key={p.id}
                to={`/problems/${p.id}`}
                className="min-w-[250px] p-4 bg-white rounded-xl shadow hover:shadow-lg transition flex-shrink-0"
              >
                <h2 className="font-semibold text-lg mb-2 text-gray-800">{p.title}</h2>
                <div className="flex flex-wrap gap-1 text-xs text-gray-600 mb-2">
                  <span className="font-semibold">⭐ {p.stars}</span>
                  {p.tags?.slice(0, 4).map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-700 px-1 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm line-clamp-3">{p.statement}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showSimilar && similarProblems.length === 0 && !isFetching && (
        <p className="mt-2 text-gray-600">No similar problems found.</p>
      )}
    </div>
  );
};

export default ProblemView;
