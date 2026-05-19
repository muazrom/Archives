import os
import chromadb
from pathlib import Path

# Initialize ChromaDB client pointing to the same local persistent directory
chroma_client = chromadb.PersistentClient(path="./chroma_data")
collection = chroma_client.get_or_create_collection(name="local_files")

def index_directory(directory_path: str):
    """
    Scans a directory for text-based files and indexes them into ChromaDB.
    """
    path = Path(directory_path)
    
    if not path.exists() or not path.is_dir():
        print(f"Error: Directory '{directory_path}' does not exist.")
        return

    # Supported file extensions for plain text
    supported_extensions = ['.txt', '.md', '.csv', '.json', '.py', '.js']
    
    documents = []
    metadatas = []
    ids = []

    print(f"Scanning directory: {directory_path}...")

    # Recursively find all files in the directory
    for filepath in path.rglob('*'):
        if filepath.is_file() and filepath.suffix.lower() in supported_extensions:
            try:
                # Read file content
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Only index if file has content
                if content.strip():
                    documents.append(content)
                    metadatas.append({
                        "filename": filepath.name,
                        "path": str(filepath.absolute()),
                        "extension": filepath.suffix
                    })
                    ids.append(str(filepath.absolute()))
                    print(f"Prepared: {filepath.name}")

            except Exception as e:
                print(f"Skipped {filepath.name} due to read error: {e}")

    if documents:
        print(f"\nIndexing {len(documents)} files into ChromaDB...")
        # Add to ChromaDB. ChromaDB will automatically generate embeddings using its default model
        # if an embedding function isn't explicitly provided.
        collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        print("✅ Indexing complete!")
    else:
        print("No supported files found or files were empty.")

if __name__ == "__main__":
    # For testing, you can index the backend directory itself
    test_directory = "./"
    
    # You can change this to any directory you want to index:
    # test_directory = "/Users/muazarief/Documents"
    
    index_directory(test_directory)
