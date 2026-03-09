# 🧠 Mental Wellness RAG Chatbot

A conversational AI chatbot designed to provide supportive responses for mental wellness discussions.
The system uses **Retrieval-Augmented Generation (RAG)** with **FAISS vector search** and a **conversation tree knowledge base** to retrieve relevant responses.

This project demonstrates how structured mental wellness conversation trees can be combined with semantic search to build an intelligent chatbot.

---

# 🚀 Features

* Semantic search using **FAISS vector database**
* **Sentence Transformers embeddings**
* Structured **conversation tree knowledge base**
* Context-aware **follow-up questions**
* Automatic **topic switching detection**
* Simple command-line chatbot interface

---

# 🏗️ Project Architecture

User Input
↓
Sentence Embedding (SentenceTransformers)
↓
FAISS Vector Search
↓
Retrieve Relevant Conversation Node
↓
Return Response + Follow-up Questions
↓
Continue Conversation Flow

---

# 📂 Project Structure

```
mental-wellness-rag
│
├── chatbot.py                         # Main chatbot program
├── build_faiss.py                     # Builds FAISS vector database
│
├── mental_awareness_60_trees_kb.json  # Knowledge base with embeddings
├── mental_awareness_chatbot_trees.md  # Original conversation trees
│
├── mental_index.faiss                 # FAISS vector index
├── metadata.pkl                       # Metadata for retrieved nodes
```

---

# ⚙️ Installation

Clone the repository

```
git clone https://github.com/ogpiyush31/weaviate_rag.git
cd weaviate_rag
```

Create virtual environment

```
python -m venv venv
```

Activate environment

Windows:

```
venv\Scripts\activate
```

Install dependencies

```
pip install faiss-cpu sentence-transformers numpy
```

---

# ▶️ Running the Chatbot

Run the chatbot using:

```
python chatbot.py
```

Example interaction:

```
You: why do small problems feel big?

Bot: When stress levels are high the brain may magnify small issues because it is trying to prepare for possible threats.

Bot: What situations trigger this feeling?
```

---

# 🧠 Knowledge Base

The chatbot uses a structured **conversation tree dataset** containing:

* Root mental health questions
* Helpful responses
* Follow-up questions
* Trigger-based conversational branches

This allows the chatbot to guide conversations in a supportive and structured way.

---

# 🛠️ Technologies Used

* Python
* FAISS (Facebook AI Similarity Search)
* Sentence Transformers
* NumPy
* JSON Knowledge Base

---

GitHub:
https://github.com/ogpiyush31
