from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
load_dotenv()

def llm():
    return ChatGoogleGenerativeAI(model="gemini-1.5-flash")



