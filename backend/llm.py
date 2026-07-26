from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_mistralai import ChatMistralAI
load_dotenv()

def llm():
    # llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash")
    llm = ChatMistralAI(model = "mistral-small-latest")
    return llm



