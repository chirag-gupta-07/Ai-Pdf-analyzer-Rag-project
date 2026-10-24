# AI PDF Analyzer (RAG Project)

**🌟 Live Demo:** [https://ai-pdf-analyzer-epbj.onrender.com](https://ai-pdf-analyzer-epbj.onrender.com)

A powerful, full-stack web application that allows users to upload PDF documents and chat with them using Advanced Retrieval-Augmented Generation (RAG). Built with a blazing fast FastAPI backend and a premium, responsive frontend.

## Features

- **Premium Web UI**: A beautiful dark-mode interface with glassmorphism, micro-animations, and markdown rendering.
- **Dynamic Document Processing**: Upload a PDF and it's instantly embedded and ready for chat. Uploading a new PDF safely clears out the old local embeddings.
- **Intelligent RAG System**: Powered by Langchain, ChromaDB, and Google Gemini for fast, context-aware answers.
- **Smart Formatting**: The AI assistant behaves as a professional Document Analyst and outputs beautiful markdown-formatted text.

## Tech Stack

- **Backend**: FastAPI, Python
- **AI/ML Engine**: Langchain, Google Gemini (`models/text-embedding-004` & `gemini-1.5-flash`), Chroma (Vector Database)
- **Frontend**: Vanilla HTML5, CSS3, JavaScript, Marked.js (for markdown rendering)

## Prerequisites

- Python 3.9+
- A [Google AI Studio API Key](https://aistudio.google.com/) (Free)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chirag-gupta-07/Ai-Pdf-analyzer-Rag-project.git
   cd Ai-Pdf-analyzer-Rag-project
   ```

2. **Create a virtual environment and install dependencies:**
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   # source .venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   MISTRAL_API_KEY=your_mistral_api_key_here
   ```

4. **Run the Application:**
   Start the FastAPI server:
   ```bash
   uvicorn app:app --reload
   ```

5. **Start Chatting:**
   Open your browser and navigate to `http://localhost:8000`. Use the sidebar to upload a PDF and start asking questions!

## Repository Structure

- `app.py`: The FastAPI application and server endpoints (`/upload`, `/chat`).
- `backend/`: Core AI logic (Langchain chains, prompts, embeddings, text splitters, loaders).
- `static/`: Frontend web files (`index.html`, `style.css`, `script.js`).
- `requirements.txt`: Python dependencies.
