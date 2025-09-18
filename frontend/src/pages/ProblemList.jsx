import { useEffect, useState } from 'react'
import { fetchProblems } from '../services/problems'
import { Link } from 'react-router-dom'

const ProblemList = () => {
  const [problems, setProblems] = useState([])

 useEffect(() => {
  const load = async () => {
    const data = await fetchProblems()
    console.log("✅ Problems fetched:", data)
    setProblems(data)
  }
  load()
}, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Problems</h1>
      <ul className="space-y-4">
        {problems.map(p => (
          <li key={p.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-600">⭐ {p.stars} | Tags: {p.tags?.join(', ')}</p>
            <Link to={`/problems/${p.id}`} className="text-blue-600 underline mt-2 inline-block">
              View Problem
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProblemList