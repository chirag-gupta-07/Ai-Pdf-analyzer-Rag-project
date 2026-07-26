from langchain_text_splitters import RecursiveCharacterTextSplitter
from backend.loader import loader
from rich import print

def splitter(docs):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size= 1000,
        chunk_overlap = 200,
    )

    return text_splitter.split_documents(docs)
