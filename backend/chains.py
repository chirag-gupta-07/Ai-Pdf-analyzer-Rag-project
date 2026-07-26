from backend.llm import llm
from backend.retriever import retriever
from backend.Prompt_template import prompt
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def chain():
    chain = {"context" :retriever(),"question" : RunnablePassthrough()} | prompt() | llm()
    return chain
    # print(chain.invoke("Hello").content[0]['text'])









