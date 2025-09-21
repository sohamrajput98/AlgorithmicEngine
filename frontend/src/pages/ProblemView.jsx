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

  if (isLoading) return <div className="p-6">Loading problem...</div>;
  if (error) return <div className="p-6 text-red-600">❌ Error loading problem</div>;

  const handleShowSimilar = async () => {
    await fetchSimilar();
    setShowSimilar(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="p-4 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
        <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-600">
          <span>⭐ {problem.stars}</span>
          {problem.tags?.map(tag => <span key={tag} className="bg-gray-200 px-2 py-1 rounded">{tag}</span>)}
        </div>
        <pre className="whitespace-pre-wrap text-gray-800">{problem.statement}</pre>
        {problem.difficulty_notes && <div className="mt-2 text-xs italic text-gray-500">Notes: {problem.difficulty_notes}</div>}
        {problem.expected && <div className="mt-2 text-xs italic text-gray-500">Expected Output: {problem.expected}</div>}

        <Link
          to={`/editor/${problem.id}`}
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Solve This Problem
        </Link>
      </div>

      <div>
        <button
          onClick={handleShowSimilar}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded hover:from-purple-600 hover:to-indigo-600 transition"
        >
          {isFetching ? 'Loading...' : 'Try Similar Problems'}
        </button>
      </div>

      {showSimilar && similarProblems.length > 0 && (
        <div className="mt-4 flex overflow-x-auto gap-4">
          {similarProblems.map(p => (
            <Link
              key={p.id}
              to={`/problems/${p.id}`}
              className="min-w-[250px] p-4 bg-white rounded shadow hover:shadow-lg transition flex-shrink-0"
            >
              <h2 className="font-semibold text-lg mb-1">{p.title}</h2>
              <div className="flex flex-wrap gap-1 text-xs text-gray-600 mb-1">
                <span>⭐ {p.stars}</span>
                {p.tags?.slice(0, 4).map(tag => <span key={tag} className="bg-gray-200 px-1 py-0.5 rounded">{tag}</span>)}
              </div>
              <p className="text-gray-700 text-sm line-clamp-3">{p.statement}</p>
            </Link>
          ))}
        </div>
      )}

      {showSimilar && similarProblems.length === 0 && !isFetching && (
        <p className="mt-2 text-gray-600">No similar problems found.</p>
      )}
    </div>
  );
};

export default ProblemView;
