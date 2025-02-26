# Resume Review

Elevate your recruitment game with a tool that combines automation and precision, making the hiring process faster, smarter, and effortlessly effective.

## Project Overview

This project helps you shortlist the best resumes based on the job description you provide. It checks for matching skills from the given job description and the resumes, and based on the matching skills, it assigns a similarity score that helps determine the most relevant resume among all.

## Demo Video

Watch the demo video to see Resume Review in action:

[![Resume Review Demo](/public/resume-shortlist.mp4)](/public/resume-shortlist.mp4)

## Tech Stack

- **Frontend:**

  - Next.js & TypeScript
  - Next.js API Routes
  - Shad CN for UI components

- **Backend:**
  - FastAPI
  - SpaCy NLP for parsing job descriptions
  - Formidable for storing resumes locally and parsing them into a JSON structured object
  - Sentence-BERT for semantic similarity comparison

## Features

- Upload resumes and job descriptions.
- Parse job descriptions to identify required skills, experience, and qualifications.
- Compare resumes against the job description to calculate a similarity score.
- Display the most relevant resumes based on the similarity score.

## Getting Started

### Prerequisites

- Node.js
- Python 3.x

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/resume-review.git
   cd resume-review
   ```
2. Install frontend dependencies:

```sh
npm install
```

3. Install backend dependencies:

```
pip install -r backend/requirements.txt
```

### Running the Application

1. Start the backend server:

```
uvicorn main:app --reload --host 127.0.0.1 --port 8000
uvicorn compare:app --reload --host 127.0.0.1 --port 8001
```

2. Start the frontend server:

```
npm run dev
```

3. Open your browser and navigate to

```
http://localhost:3000.
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License.
