import { useQuery } from '@tanstack/react-query';
import { fetchSubmissions } from '../services/submissions';
import { Link } from 'react-router-dom';

const Submissions = () => {
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  const {
    data: submissions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['submissions', userId],
    queryFn: () => fetchSubmissions(userId),
    enabled: !!userId,
  });

  if (!userId) return <div className="p-6 text-red-600">❌ User not logged in</div>;
  if (isLoading) return <div className="p-6">Loading submissions...</div>;
  if (error) return <div className="p-6 text-red-600">❌ Failed to load submissions</div>;
  if (!submissions.length) return <div className="p-6">No submissions found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submission History</h1>
      <ul className="space-y-4">
        {submissions.map(sub => (
          <li key={sub.id} className="border p-4 rounded bg-gray-50 shadow-sm">
            <p>
              <strong>Problem:</strong>{' '}
              <Link to={`/problems/${sub.problem_id}`} className="text-blue-600 underline">
                #{sub.problem_id}
              </Link>
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`font-semibold ${sub.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {sub.status}
              </span>
            </p>
            <p>
              <strong>Output:</strong>{' '}
              <pre className="bg-white p-2 rounded border">{sub.output || '—'}</pre>
            </p>
            <p>
              <strong>Expected:</strong>{' '}
              <pre className="bg-white p-2 rounded border">{sub.expected || '—'}</pre>
            </p>
            {sub.output !== sub.expected && (
              <p className="text-sm text-red-500">⚠️ Output does not match expected</p>
            )}
            <p className="text-sm text-gray-500">
              <strong>Submitted:</strong>{' '}
              {sub.created_at
                ? new Date(sub.created_at).toLocaleString()
                : 'Unknown'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Submissions;