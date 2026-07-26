from dotenv import load_dotenv
load_dotenv()
from langchain_chroma import Chroma
from langchain_mistralai import MistralAIEmbeddings
from backend.loader import loader
from backend.splitter import splitter
from rich import print

import os
def create_embeddings(file_path):
    docs = loader(file_path)
    chunks = splitter(docs)

    embedding_model = MistralAIEmbeddings(
        model="mistral-embed"
    )

    db_path = os.environ.get("CHROMA_DB_PATH", "vector_db/test")
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory=db_path
    )
