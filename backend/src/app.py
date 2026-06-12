from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import threading
from indexer import index_all, search as semantic_search

EXT_ICONS = {
    '.pdf': '📄', '.docx': '📝', '.txt': '📃', '.md': '📋',
    '.py': '🐍', '.js': '🟨', '.ts': '🔷', '.jsx': '⚛️', '.tsx': '⚛️',
    '.json': '{}', '.csv': '📊', '.png': '🖼️', '.jpg': '🖼️',
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    thread = threading.Thread(target=index_all, daemon=True)
    thread.start()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/search")
def search(q: str):
    results = semantic_search(q)
    for r in results:
        r['icon'] = EXT_ICONS.get(r['ext'], '📄')
    return {"results": results}


@app.get("/health")
def health():
    return {"status": "ok"}
