
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import torch

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pre-trained Sentence-BERT model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
results_store = []
# Input schema for API
class Resume(BaseModel):
    name: str
    email: str
    skills: List[str]
    experience: str
    projects: str
    education: str

class CompareRequest(BaseModel):
    jdData: str
    resumes: List[Resume]

@app.post("/compare/")
async def compare(request: CompareRequest):
    jd_text = request.jdData
    results = []

    # Get embedding for job description
    jd_embedding = model.encode(jd_text)

    for resume in request.resumes:
        # Combine all resume fields for semantic similarity
        resume_text = (
            " ".join(resume.skills) + " " +
            resume.experience + " " +
            resume.projects + " " +
            resume.education
        )

        # Get embedding for resume
        resume_embedding = model.encode(resume_text)

        # Calculate cosine similarity
        similarity_score = cosine_similarity([jd_embedding], [resume_embedding])[0][0]

        # Compile results
        results.append({
            "name": resume.name,
            "email": resume.email,
            "similarity_score": round(float(similarity_score), 2),
            "message": "Comparison successful"
        })
    results_store.extend(results)
    return {"results": results}
@app.get("/results/")
async def get_results():
    if not results_store:
        return {"message": "No results available"}
    return {"results": results_store}
# Run using: uvicorn compare:app --reload --host 127.0.0.1 --port 8001