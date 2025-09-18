import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { submitSolution } from '../services/problems'

const Editor = () => {
  const { id } = useParams()
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await submitSolution({ problem_id: parseInt(id), code })
      setResult(res)
    } catch (err) {
      setResult({ status: 'error', reason: err.response?.data?.detail || 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Editor</h1>
      <textarea
        className="w-full h-64 p-4 border rounded font-mono"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Write your Python code here..."
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Output:</strong> <pre>{result.output}</pre></p>
          <p><strong>Expected:</strong> <pre>{result.expected}</pre></p>
          {result.stderr && <p><strong>Errors:</strong> <pre>{result.stderr}</pre></p>}
        </div>
      )}
    </div>
  )
}

export default Editor