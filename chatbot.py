import json
import numpy as np
from sentence_transformers import SentenceTransformer


# Load model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Load dataset
with open("mental_awareness_60_trees_kb.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Keep only ROOT nodes
roots = [node for node in data if node.get("type") == "root"]

# Prepare embeddings from stored vectors
root_vectors = np.array([node["vector"] for node in roots])


def find_best_root(user_input):
    query_vec = model.encode(user_input)

    similarities = np.dot(root_vectors, query_vec)

    best_index = np.argmax(similarities)

    if similarities[best_index] > 0.35:   # threshold
        return roots[best_index]

    return None


print("\n🧠 Mental Wellness Chatbot")
print("Type 'exit' to stop\n")

current_tree = None
followup_index = 0


while True:

    user_input = input("You: ")

    if user_input.lower() == "exit":
        print("Bot: Take care. I'm here whenever you want to talk.")
        break

    # 🔎 Always check if this is a new root trigger
    new_tree = find_best_root(user_input)

    if new_tree:
        current_tree = new_tree
        followup_index = 0

        print("\nBot:", current_tree["response"])

        if current_tree["followups"]:
            print("\nBot:", current_tree["followups"][0]["question"])

        continue

    # 🧠 If already in conversation → followup logic
    if current_tree:

        followups = current_tree["followups"]

        print("\nBot:", followups[followup_index]["answer"])

        followup_index += 1

        if followup_index < len(followups):
            print("\nBot:", followups[followup_index]["question"])
        else:
            print("\nBot: Thank you for sharing. If you'd like, you can tell me about another concern.\n")
            current_tree = None
            followup_index = 0

    else:
        print("Bot: I'm here to listen. Could you tell me more?")