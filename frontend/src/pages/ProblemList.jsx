import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProblems } from '../services/problems';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const limit = 10;

  const loadProblems = async () => {
    setLoading(true);
    const data = await fetchProblems({ search, sort_by: sortBy, order, page, limit });
    setProblems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProblems();
  }, [search, sortBy, order, page]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">Sort By</option>
          <option value="stars">Stars</option>
          <option value="title">Title</option>
          <option value="difficulty_notes">Difficulty</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)} className="border px-2 py-1 rounded">
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {loading ? (
        <div>Loading problems...</div>
      ) : (
        <div className="grid gap-4">
          {problems.map(p => (
            <Link
              key={p.id}
              to={`/problems/${p.id}`}
              className="p-4 bg-white rounded shadow hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg mb-1">{p.title}</h2>
              <div className="flex gap-2 text-xs text-gray-600 mb-1">
                <span>⭐ {p.stars}</span>
                {p.tags?.map(tag => <span key={tag} className="bg-gray-200 px-1 py-0.5 rounded">{tag}</span>)}
              </div>
              <p className="text-gray-700 text-sm line-clamp-3">{p.statement}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
        <button onClick={() => setPage(prev => prev + 1)} className="px-3 py-1 bg-gray-200 rounded">Next</button>
      </div>
    </div>
  );
};

export default ProblemList;
