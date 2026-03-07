import json
import faiss
import numpy as np


with open("mental_wellness_tree_kb.json", "r") as f:
    data = json.load(f)


vectors = [item["vector"] for item in data]
vectors = np.array(vectors).astype("float32")

dimension = vectors.shape[1]


index = faiss.IndexFlatL2(dimension)


index.add(vectors)


faiss.write_index(index, "mental_wellness_index.faiss")


with open("metadata.json", "w") as f:
    json.dump(data, f)

print(" Vector DB created successfully")
print("Total vectors:", index.ntotal)