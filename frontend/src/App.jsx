import { useState } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    
    // Simulate backend call
    setTimeout(() => {
      setResults({
        local: [
          { id: 1, title: 'Project_Proposal_v2.pdf', snippet: '...integrating the new vector DB with our local files...', path: '/Documents/Work/Project_Proposal_v2.pdf' },
          { id: 2, title: 'Q3_Financials.xlsx', snippet: '...revenue projections based on AI features...', path: '/Documents/Finance/Q3_Financials.xlsx' }
        ],
        web: [
          { id: 1, source: 'Perplexity API', snippet: 'A vector database is a type of database designed to store and query high-dimensional vectors, which are often used in AI...' },
          { id: 2, source: 'Brave Search', snippet: 'Best practices for setting up local-first AI applications involve using tools like ChromaDB and local LLMs.' }
        ]
      })
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center py-20 px-4 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="mb-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Archive
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          AI-Native Unified File System & Hybrid Search Engine. 
          <br className="hidden sm:block" /> Retrieve knowledge from your local files and the web.
        </p>
      </header>

      {/* Search Bar */}
      <div className="w-full max-w-3xl relative">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl focus-within:border-indigo-500 transition-colors">
            <svg className="w-6 h-6 text-gray-500 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything or search for files..."
              className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-5 outline-none text-lg"
            />
            <button 
              type="submit" 
              className="px-6 py-3 mr-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all active:scale-95 disabled:opacity-50"
              disabled={isSearching || !query.trim()}
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching
                </span>
              ) : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Area */}
      {results && (
        <div className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Local Files Column */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-indigo-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              Local Files (ChromaDB)
            </h2>
            <div className="space-y-4">
              {results.local.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 transition-colors cursor-pointer group">
                  <h3 className="font-medium text-gray-200 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.snippet}</p>
                  <div className="text-xs text-gray-600 mt-3 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    {item.path}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Web Intelligence Column */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              Web Intelligence
            </h2>
            <div className="space-y-4">
              {results.web.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md">
                      {item.source}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.snippet}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default App
