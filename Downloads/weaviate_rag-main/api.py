import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI(title="Mental Wellness Chatbot API")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load resources
model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index("mental_index.faiss")

with open("metadata.pkl", "rb") as f:
    metadata = pickle.load(f)

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    current_node: Optional[dict] = None
    followup_index: int = 0

class followup(BaseModel):
    question: str
    answer: str

class ChatResponse(BaseModel):
    bot_response: str
    followup_question: Optional[str] = None
    current_node: Optional[dict] = None
    followup_index: int = 0
    is_finished: bool = False

def is_new_question(text):
    text = text.lower()
    keywords = [
        "why", "how", "i feel", "i am", "i'm", "i cant", "i can't",
        "i dont", "i don't", "i have", "i keep",
    ]
    for k in keywords:
        if k in text:
            return True
    return False

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    user_input = request.message
    current_node = request.current_node
    followup_index = request.followup_index

    # New question or first message
    if current_node is None or is_new_question(user_input):
        query_vector = model.encode([user_input])
        query_vector = np.array(query_vector).astype("float32")

        distances, indices = index.search(query_vector, 1)
        best_match = metadata[indices[0][0]]

        current_node = best_match
        followup_index = 0

        bot_response = best_match.get("response", "")
        followups = best_match.get("followups", [])
        
        followup_question = None
        if followups:
            followup_question = followups[0]["question"]

        return ChatResponse(
            bot_response=bot_response,
            followup_question=followup_question,
            current_node=current_node,
            followup_index=followup_index,
            is_finished=False if followups else True
        )

    # Continuing follow-ups
    followups = current_node.get("followups", [])

    if followup_index < len(followups):
        answer = followups[followup_index]["answer"]
        followup_index += 1

        next_question = None
        is_finished = False
        if followup_index < len(followups):
            next_question = followups[followup_index]["question"]
        else:
            next_question = "Thanks for sharing. Would you like to talk about something else?"
            is_finished = True

        return ChatResponse(
            bot_response=answer,
            followup_question=next_question,
            current_node=current_node if not is_finished else None,
            followup_index=followup_index if not is_finished else 0,
            is_finished=is_finished
        )
    
    return ChatResponse(
        bot_response="I'm here to listen. Tell me more or ask anything else.",
        is_finished=True
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
