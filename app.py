from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import shutil
import os
from pydantic import BaseModel
from backend.chains import chain
from backend.embeddings import create_embeddings
import uuid

app = FastAPI()

# Mount the static directory to serve HTML, CSS, JS
app.mount("/static", StaticFiles(directory="static"), name="static")

class ChatRequest(BaseModel):
    query: str

@app.get("/", response_class=HTMLResponse)
async def read_root():
    # Make sure static directory exists
    os.makedirs("static", exist_ok=True)
    try:
        with open("static/index.html", "r") as f:
            return f.read()
    except FileNotFoundError:
        return "<html><body><h1>static/index.html not found!</h1></body></html>"

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    new_db_dir = f"vector_db/test_{uuid.uuid4().hex}"
    os.environ["CHROMA_DB_PATH"] = new_db_dir

    # Try to clean up old vector_db directories (ignore errors for locked files)
    if os.path.exists("vector_db"):
        for item in os.listdir("vector_db"):
            item_path = os.path.join("vector_db", item)
            if item_path != new_db_dir:
                shutil.rmtree(item_path, ignore_errors=True)

    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{file.filename}"

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        create_embeddings(file_path)
        return {"message": "File uploaded and embeddings created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = chain().invoke(request.query)
        content = response.content
        if isinstance(content, list):
            answer = "".join(
                item.get("text", "") if isinstance(item, dict) else str(item)
                for item in content
            )
        else:
            answer = str(content)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
