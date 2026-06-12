import os
import hashlib
import chromadb
from pathlib import Path
from sentence_transformers import SentenceTransformer

WATCHED_DIRS = [
    str(Path.home() / "Documents"),
    str(Path.home() / "Desktop"),
    str(Path.home() / "Downloads"),
    str(Path.home()),
]

SKIP_DIRS = {'.git', 'node_modules', '__pycache__', 'venv', '.venv', 'Library'}

SUPPORTED_EXTENSIONS = {'.txt', '.md', '.pdf', '.docx', '.py', '.js', '.ts', '.jsx', '.tsx', '.json', '.csv'}

CHROMA_PATH = os.path.join(os.path.dirname(__file__), '..', 'chroma_data')

model = SentenceTransformer('all-MiniLM-L6-v2')
client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection("files")


def extract_text(path: str) -> str:
    ext = Path(path).suffix.lower()
    try:
        if ext in {'.txt', '.md', '.py', '.js', '.ts', '.jsx', '.tsx', '.json', '.csv'}:
            with open(path, 'r', errors='ignore') as f:
                return f.read()[:4000]
        if ext == '.pdf':
            from pypdf import PdfReader
            reader = PdfReader(path)
            return ' '.join(p.extract_text() or '' for p in reader.pages[:5])[:4000]
        if ext == '.docx':
            from docx import Document
            doc = Document(path)
            return ' '.join(p.text for p in doc.paragraphs)[:4000]
    except Exception:
        pass
    return ''


def file_id(path: str) -> str:
    return hashlib.sha256(path.encode()).hexdigest()


def index_file(path: str):
    name = Path(path).name
    text = extract_text(path)
    content = f"{name} {text}".strip()
    if not content:
        return
    embedding = model.encode(content).tolist()
    collection.upsert(
        ids=[file_id(path)],
        embeddings=[embedding],
        metadatas=[{"name": name, "path": path, "ext": Path(path).suffix.lower()}],
    )


def index_all():
    for root_dir in WATCHED_DIRS:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for filename in filenames:
                ext = Path(filename).suffix.lower()
                if ext in SUPPORTED_EXTENSIONS:
                    full_path = os.path.join(dirpath, filename)
                    try:
                        index_file(full_path)
                    except Exception:
                        pass


def search(query: str, n: int = 10):
    embedding = model.encode(query).tolist()
    results = collection.query(embeddings=[embedding], n_results=n)
    items = []
    if results and results.get('metadatas'):
        for meta in results['metadatas'][0]:
            items.append({"name": meta['name'], "path": meta['path'], "ext": meta['ext']})
    return items
