from langchain_community.document_loaders import PyPDFLoader
from rich import print

def loader(file_path):
    docs = PyPDFLoader(file_path)
    return docs.load()

