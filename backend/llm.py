from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
load_dotenv()

import os
def llm():
    return ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )



