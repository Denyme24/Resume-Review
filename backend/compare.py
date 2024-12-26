from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize

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

    # Get embedding for job description and normalize
    jd_embedding = model.encode(jd_text)
    jd_embedding = normalize([jd_embedding])[0]  # Normalize JD embedding

    for resume in request.resumes:
        # Combine all resume fields for semantic similarity
        resume_text = (
            " ".join(resume.skills) + " " +
            resume.experience + " " +
            resume.projects + " " +
            resume.education
        )

        # Get embedding for resume and normalize
        resume_embedding = model.encode(resume_text)
        resume_embedding = normalize([resume_embedding])[0]  # Normalize Resume embedding

        # Calculate cosine similarity and apply scaling
        similarity_score = cosine_similarity([jd_embedding], [resume_embedding])[0][0]
        scaled_score = min(similarity_score * 1.1, 1.0)  # Scale similarity score

        # Compile results
        result = {
            "name": resume.name,
            "email": resume.email,
            "overall_score": round(float(scaled_score), 2)
        }
        results.append(result)
    results_store.extend(results)
    return {"results": results}


@app.get("/results/")
async def get_results():
    if not results_store:
        raise HTTPException(status_code=404, detail="No results available")
    results = results_store.copy()
    results_store.clear()  # Clear the results store after returning the results
    return {"results": results}