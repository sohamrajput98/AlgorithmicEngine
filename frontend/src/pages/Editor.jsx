import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchProblemById } from '../services/problems';
import EditorCard from '../components/EditorCard';

const Editor = () => {
  const { id } = useParams();

  const { data: problem, isLoading, error } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => fetchProblemById(id),
    enabled: !!id,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 300,
    retry: false,
  });

  if (isLoading) return (
    <div className="p-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-2 w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
      <div className="h-64 bg-gray-100 rounded"></div>
    </div>
  );

  if (error) return <div className="p-6 text-red-600">Problem not found or failed to load.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Problem Details */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-800">{problem.title}</h2>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span>⭐ {problem.stars}</span>
          {problem.tags?.map(tag => (
            <span key={tag} className="bg-gray-200 px-2 py-1 rounded">{tag}</span>
          ))}
        </div>
        {problem.difficulty_notes && (
          <div className="text-xs italic text-gray-500">Difficulty: {problem.difficulty_notes}</div>
        )}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Problem Statement</h3>
          <pre className="whitespace-pre-wrap text-gray-800">{problem.statement}</pre>
        </div>
      </div>

      {/* Right: EditorCard */}
      <div>
        <EditorCard problemId={id} />
      </div>
    </div>
  );
};

export default Editor;
