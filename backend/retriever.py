from dotenv import load_dotenv
load_dotenv()

from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from rich import print

import os
def retriever():
    embedding_model = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004"
    )

    db_path = os.environ.get("CHROMA_DB_PATH", "vector_db/test")
    vector_store = Chroma(
        persist_directory=db_path,
        embedding_function=embedding_model 
    )

    retriever = vector_store.as_retriever(
        search_type = "mmr",
        search_kwargs = {
            "k" : 4,
            "fetch_k": 20,
            "lambda_mult" : 0.5
        }
    )

    return retriever
