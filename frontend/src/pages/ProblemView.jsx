import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProblemById } from '../services/problems'

const ProblemView = () => {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)

  useEffect(() => {
    fetchProblemById(id).then(setProblem)
  }, [id])

  if (!problem) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
      <p className="text-sm text-gray-600 mb-2">⭐ {problem.stars} | Tags: {problem.tags?.join(', ')}</p>
      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{problem.statement}</pre>
      {problem.difficulty_notes && (
        <div className="mt-4 text-sm text-gray-700">
          <strong>Notes:</strong> {problem.difficulty_notes}
        </div>
      )}
      <Link to={`/editor/${problem.id}`} className="mt-6 inline-block text-blue-600 underline">
        Solve This Problem
      </Link>
    </div>
  )
}

export default ProblemView