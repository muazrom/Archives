# Archive – Raycast-Style Replacement for Finder, Spotlight, and the Dock

Archive is a macOS desktop overlay application that completely replaces three native macOS tools — Finder, Spotlight, and the Dock — with a single, fast, keyboard-driven interface. Summon it with a hotkey, find anything on your machine semantically, browse your files, and launch apps — all without ever touching the native macOS tools.

## The Problem

macOS Spotlight and Finder silently fail to index files in many folders, making it impossible to find things you know exist. Managing files, launching apps, and switching windows across three separate native tools (Finder, Spotlight, Dock) adds unnecessary friction. Archive replaces all three.

## What Archive Replaces

| Native macOS Tool | Archive Equivalent |
|---|---|
| **Spotlight** | Hotkey-triggered semantic search over your entire file system |
| **Finder** | Built-in file browser — navigate, open, move, rename files |
| **Dock** | Integrated app launcher and switcher — macOS Dock is hidden |

## How It Works

- Press a hotkey (e.g. `⌘ Space` or custom) → Archive overlay appears
- Type to search files semantically ("Q3 report", "passport scan", "logo design")
- Browse folders inline without opening Finder
- Launch or switch to any app from the same interface
- Press `Esc` → overlay dismisses, you're back to work

## Core Features

- **Semantic Search** — understands meaning, not just filenames. Powered by local vector embeddings (ChromaDB).
- **Full-Text Search** — searches inside PDFs, DOCX, Markdown, text files, and more.
- **Reliable Indexing** — Archive builds and maintains its own file index, not dependent on macOS Spotlight.
- **File Browser** — inline folder navigation replacing Finder.
- **App Launcher** — find and launch any installed app; replaces the Dock entirely.
- **Privacy-First** — fully local, no internet required, no data leaves your machine.

## Technology Stack

- **Frontend:** Electron + React (frameless overlay window)
- **Backend:** Python (FastAPI) — file indexing, embeddings, search
- **Vector Search:** ChromaDB (semantic/meaning-based search)
- **Full-Text Search:** SQLite FTS5
- **File Parsing:** PDFs, DOCX, Markdown, plain text

## Project Structure

```
/frontend   – Electron + React overlay UI
/backend    – FastAPI server (indexer, embeddings, search engine)
```

## Status

Early development. Starting with the core indexing + search pipeline.
