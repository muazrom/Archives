import { useState, useEffect, useRef } from 'react'
import './index.css'

const QUICK_ACTIONS = [
  { icon: '📁', label: 'Browse Files', hint: 'Navigate your file system' },
  { icon: '🚀', label: 'Launch App', hint: 'Open any application' },
  { icon: '📄', label: 'Recent Files', hint: 'Files opened recently' },
  { icon: '⚙️', label: 'Preferences', hint: 'Archive settings' },
]

const EXT_COLOR = {
  '.pdf': 'bg-red-500/20 text-red-300',
  '.docx': 'bg-blue-500/20 text-blue-300',
  '.doc': 'bg-blue-500/20 text-blue-300',
  '.xlsx': 'bg-green-500/20 text-green-300',
  '.py': 'bg-yellow-500/20 text-yellow-300',
  '.js': 'bg-yellow-400/20 text-yellow-200',
  '.ts': 'bg-blue-400/20 text-blue-200',
  '.jsx': 'bg-cyan-500/20 text-cyan-300',
  '.tsx': 'bg-cyan-500/20 text-cyan-300',
  '.md': 'bg-purple-500/20 text-purple-300',
  '.txt': 'bg-gray-500/20 text-gray-300',
  '.json': 'bg-orange-500/20 text-orange-300',
  '.png': 'bg-pink-500/20 text-pink-300',
  '.jpg': 'bg-pink-500/20 text-pink-300',
  '.mp4': 'bg-indigo-500/20 text-indigo-300',
}

function getExt(path) {
  const m = path?.match(/(\.[^.]+)$/)
  return m ? m[1].toLowerCase() : ''
}

function FileIcon({ ext, emoji }) {
  const cls = EXT_COLOR[ext] || 'bg-gray-500/20 text-gray-300'
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 ${cls}`}>
      {emoji}
    </div>
  )
}

function shorten(path) {
  return path?.replace(/^\/Users\/[^/]+/, '~') || ''
}

export default function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (query) { setQuery(''); setResults([]); setSelected(0) }
        else window.archive?.hideWindow()
      }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && results[selected]) {
        window.archive?.openFile?.(results[selected].path)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [query, results, selected])

  useEffect(() => {
    const el = listRef.current?.children[selected]
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  const handleSearch = async (e) => {
    const value = e.target.value
    setQuery(value)
    setSelected(0)
    if (!value.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8001/search?q=${encodeURIComponent(value)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const isEmpty = !query

  return (
    <div className="flex items-start justify-center min-h-screen">
      <div className="w-full max-w-[680px] mt-[15vh] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/10"
        style={{ background: 'rgba(28,28,32,0.92)', backdropFilter: 'blur(40px)' }}>

        {/* Search bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-5 h-5 shrink-0 flex items-center justify-center">
            {loading
              ? <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              : <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
            }
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search files, apps, anything..."
            className="flex-1 bg-transparent text-white text-[17px] font-light outline-none placeholder-white/25 tracking-[-0.01em]"
          />
          {query
            ? <button onClick={() => { setQuery(''); setResults([]); setSelected(0) }}
                className="text-white/25 hover:text-white/50 transition-colors text-xs border border-white/10 rounded px-1.5 py-0.5">
                esc
              </button>
            : <span className="text-white/15 text-xs border border-white/10 rounded px-1.5 py-0.5">⌘Space</span>
          }
        </div>

        {/* Home — quick actions */}
        {isEmpty && (
          <div className="p-3">
            <p className="text-white/20 text-[11px] font-medium uppercase tracking-wider px-2 pb-2">Quick Actions</p>
            <ul>
              {QUICK_ACTIONS.map((a, i) => (
                <li key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-white/[0.06] group">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.07] flex items-center justify-center text-lg shrink-0">
                    {a.icon}
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">{a.label}</p>
                    <p className="text-white/30 text-xs">{a.hint}</p>
                  </div>
                  <svg className="ml-auto w-4 h-4 text-white/15 group-hover:text-white/30 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Search results */}
        {!isEmpty && results.length > 0 && (
          <div className="p-3">
            <p className="text-white/20 text-[11px] font-medium uppercase tracking-wider px-2 pb-2">
              Files — {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <ul ref={listRef} className="max-h-[360px] overflow-y-auto space-y-0.5">
              {results.map((r, i) => {
                const ext = getExt(r.path)
                const isActive = i === selected
                return (
                  <li key={i}
                    onMouseEnter={() => setSelected(i)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${isActive ? 'bg-white/[0.09]' : 'hover:bg-white/[0.05]'}`}>
                    <FileIcon ext={ext} emoji={r.icon || '📄'} />
                    <div className="min-w-0 flex-1">
                      <p className="text-white/85 text-sm font-medium truncate">{r.name}</p>
                      <p className="text-white/30 text-xs truncate">{shorten(r.path)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${EXT_COLOR[ext] || 'bg-white/10 text-white/30'}`}>
                        {ext || 'file'}
                      </span>
                      {isActive && (
                        <span className="text-white/20 text-[10px] border border-white/10 rounded px-1.5 py-0.5">↵</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* No results */}
        {!isEmpty && !loading && results.length === 0 && (
          <div className="py-12 flex flex-col items-center gap-2">
            <p className="text-white/20 text-4xl">🔍</p>
            <p className="text-white/40 text-sm">No results for <span className="text-white/60">"{query}"</span></p>
            <p className="text-white/20 text-xs">Try different keywords</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/[0.05]">
          <span className="text-white/15 text-[11px]">Archive</span>
          <div className="flex items-center gap-3 text-white/15 text-[11px]">
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>esc close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
