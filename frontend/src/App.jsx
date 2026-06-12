import { useState, useEffect, useRef } from 'react'
import './index.css'

export default function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        window.archive?.hideWindow()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = async (e) => {
    const value = e.target.value
    setQuery(value)
    if (!value.trim()) {
      setResults([])
      return
    }
    try {
      const res = await fetch(`http://localhost:8001/search?q=${encodeURIComponent(value)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    }
  }

  return (
    <div className="flex items-start justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl mt-24 rounded-2xl overflow-hidden shadow-2xl bg-white/90 backdrop-blur border border-white/20">
        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search files, apps, anything..."
            className="flex-1 bg-transparent text-gray-800 text-base outline-none placeholder-gray-400"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]) }} className="text-gray-400 hover:text-gray-600 text-sm">
              ✕
            </button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {results.map((r, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                <span className="text-xl">{r.icon || '📄'}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{r.name}</p>
                  <p className="text-xs text-gray-400 truncate">{r.path}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            No results for "{query}"
          </div>
        )}
      </div>
    </div>
  )
}
