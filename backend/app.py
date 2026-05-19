from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import chromadb
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(title="Archive Backend", description="AI-Native Unified File System & Hybrid Search Engine")

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB client (local persistent storage)
# This will store the vectors in a local directory named 'chroma_data'
chroma_client = chromadb.PersistentClient(path="./chroma_data")
collection = chroma_client.get_or_create_collection(name="local_files")

class SearchQuery(BaseModel):
    query: str
    top_k: int = 5
    include_web: bool = True

class FileRecord(BaseModel):
    filename: str
    content: str
    path: str

@app.get("/")
def read_root():
    return {"status": "Archive backend is running!"}

@app.post("/index-file/")
def index_file(record: FileRecord):
    """
    Simulates indexing a local file into the vector database.
    """
    try:
        # In a real app, you would use an embedding model here to convert content to vector.
        # ChromaDB uses a default embedding function if none is provided.
        collection.add(
            documents=[record.content],
            metadatas=[{"filename": record.filename, "path": record.path}],
            ids=[record.path]
        )
        return {"status": "success", "message": f"Indexed {record.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search/")
def hybrid_search(query: SearchQuery):
    """
    Performs a hybrid search across local vector DB and simulated web APIs.
    """
    results = {
        "local_results": [],
        "web_results": [],
        "noctua_context_applied": True
    }
    
    # 1. Local Search (ChromaDB)
    try:
        local_search_result = collection.query(
            query_texts=[query.query],
            n_results=query.top_k
        )
        
        if local_search_result and local_search_result['documents']:
            for i in range(len(local_search_result['documents'][0])):
                doc = local_search_result['documents'][0][i]
                meta = local_search_result['metadatas'][0][i]
                results["local_results"].append({
                    "content": doc,
                    "metadata": meta
                })
    except Exception as e:
        print(f"ChromaDB search error: {e}")
        
    # 2. Web Search (Mocking Brave/Perplexity API integration)
    if query.include_web:
        # In a complete implementation, this would call Brave Search or Perplexity API
        results["web_results"].append({
            "source": "Web Search API",
            "snippet": f"Simulated web response for: {query.query}. Showing internet knowledge combined with local context."
        })
        
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
