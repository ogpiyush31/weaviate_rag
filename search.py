import faiss
import json
import numpy as np
from sentence_transformers import SentenceTransformer


model = SentenceTransformer("all-MiniLM-L6-v2")


index = faiss.read_index("mental_wellness_index.faiss")


with open("metadata.json") as f:
    metadata = json.load(f)

print("\n Mental Wellness Chatbot Started")
print("Type 'exit' to stop\n")

current_node = None

while True:
    query = input("You: ")

    if query.lower() == "exit":
        break

    query_vector = model.encode([query]).astype("float32")

    
    D, I = index.search(query_vector, 1)

    result = metadata[I[0][0]]

   
    current_node = result

   
    print("\nBot:", result["response"])

  
    if result.get("followups"):
        print("\nBot Follow-up Questions:")
        for f in result["followups"]:
            print("-", f)

    print()