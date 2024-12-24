from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import spacy
import re

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class JobDescription(BaseModel):
    text: str

def normalize_text(text: str) -> str:
    """Normalize text for consistent processing."""
    return re.sub(r"[^\w\s]", "", text.lower().strip())

def refine_required_skills(skills: list) -> list:
    """Refine skills by filtering noise and standardizing entries."""
    refined = []
    for skill in skills:
        skill = skill.strip()
        if skill and len(skill) > 1 and not skill.isdigit():  # Filter out single letters and numbers
            refined.append(skill)
    return list(set(refined))  # Remove duplicates

def refine_experience(experience: list) -> list:
    """Refine experience by standardizing phrases."""
    refined = []
    for exp in experience:
        exp = exp.strip("-").strip()
        # Transform into clean phrases
        exp = re.sub(r"\s+", " ", exp).capitalize()
        if exp and exp not in refined:
            refined.append(exp)
    return refined

def refine_qualifications(qualifications: list) -> list:
    """Refine qualifications by standardizing entries."""
    refined = []
    for qual in qualifications:
        qual = qual.strip("-").strip()
        # Transform into clean phrases
        qual = re.sub(r"\s+", " ", qual).capitalize()
        if qual and qual not in refined:
            refined.append(qual)
    return refined

@app.post("/parse-job-description")
async def parse_job_description(data: JobDescription):
    if not data.text:
        raise HTTPException(status_code=400, detail="Job description text is required")

    doc = nlp(data.text)

    # Define output structure
    parsed_data = {
        "requiredSkills": [],
        "experience": [],
        "qualifications": []
    }

    # Dynamically parse sentences into categories
    for sentence in doc.sents:
        normalized_sentence = normalize_text(sentence.text)

        # Identify qualifications based on degree-related terms and structured patterns
        if re.search(r"(bachelor|master|phd|degree|certification|certified)", normalized_sentence):
            parsed_data["qualifications"].append(sentence.text.strip())
        # Identify experience using patterns like years, projects, or specific experiences
        elif re.search(r"(\d+\+?\s?(years|yrs)|experience|proven track|hands-on)", normalized_sentence):
            parsed_data["experience"].append(sentence.text.strip())
        # Identify skills using entities and context (proper nouns, tools, or technologies)
        else:
            for token in nlp(sentence.text):
                if token.pos_ in ["NOUN", "PROPN"] and token.text.lower() not in parsed_data["requiredSkills"]:
                    parsed_data["requiredSkills"].append(token.text.lower())

    # Post-processing: Clean and refine parsed data
    parsed_data["requiredSkills"] = refine_required_skills(parsed_data["requiredSkills"])
    parsed_data["experience"] = refine_experience(parsed_data["experience"])
    parsed_data["qualifications"] = refine_qualifications(parsed_data["qualifications"])

    # Return the structured data
    return {"jobDescriptionData": parsed_data}

