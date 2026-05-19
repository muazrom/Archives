# Archive – AI-Native Unified File System & Hybrid Search Engine

Archive is an intelligent file system that seamlessly combines local storage with web intelligence to deliver hyper-personalized information retrieval. By leveraging vector databases and modern web search APIs, it provides a unified, context-aware search experience while maintaining strict data privacy and access control.

## 🌟 Key Features

- **Hybrid Search Engine:** Query both your local files and the web simultaneously to get comprehensive answers.
- **Semantic Retrieval:** Built on top of vector databases (ChromaDB/Milvus) to understand the *meaning* of your files, not just keyword matching.
- **Context-Aware (Noctua):** Integrates with Noctua context to personalize results based on your current tasks and historical interactions.
- **Privacy-First:** Local files stay local. Your private data is never sent to external servers without explicit consent.
- **Modern Desktop Experience:** Built with Electron and React for a fast, native-feeling desktop application.

## 🛠️ Technology Stack

- **Frontend:** React, Electron, Tailwind CSS
- **Backend:** Python (FastAPI)
- **Vector Database:** ChromaDB / Milvus
- **Search Intelligence:** Brave Search API / Perplexity API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment: `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the backend server: `uvicorn app:app --reload`

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## 📁 Project Structure

- `/backend` - Python server handling vector embeddings, file parsing, and search APIs.
- `/frontend` - React/Electron application for the user interface.
