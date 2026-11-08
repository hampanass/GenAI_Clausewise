# ClauseWise

**AI-Powered Tender Amendment Analysis and Compliance Impact Assessment**

Track Changes. Understand Impact. Stay Compliant.

ClauseWise compares an original government tender PDF with its amended version. It extracts document text, asks Groq's `openai/gpt-oss-120b` model for a structured comparison, validates the response, and checks quoted evidence against the correct source PDF before returning results.

## Project layout

```text
backend/    FastAPI API, PDF extraction, Groq analysis, and tests
frontend/   Next.js, TypeScript, Tailwind CSS, and Lucide UI
.env.example
```

## Requirements

- Node.js 20.9+
- Python 3.10+
- A Groq API key

## Configure and run the backend

From the project root:

```bash
cp .env.example backend/.env
```

Add your Groq API key to `backend/.env`. Keep this file private; it is ignored by git.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`; its interactive docs are at `http://localhost:8000/docs`.

## Configure and run the frontend

In another terminal, from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. To use a non-default API URL, set `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local` (for example, `http://localhost:8000`).

## Run backend tests

From `backend/`, with the virtual environment active:

```bash
pytest
```

## API

`POST /api/v1/amendments/analyze` accepts multipart form data with:

- `original_file`: original tender PDF
- `amended_file`: amended tender or corrigendum PDF

The endpoint enforces the configured upload limit, extracts page-numbered text with PyMuPDF, sends that text to Groq from the backend, validates the response with Pydantic, and removes source evidence that cannot be verified against its cited document and page. ClauseWise does not persist uploaded PDFs or analyses; review Groq's data-handling terms before sending sensitive tender documents.

## Current scope and follow-up

- Implemented: responsive dashboard, sign-in/registration screen, PDF comparison workspace, result display, upload validation, PDF extraction, Groq analysis, structured response validation, evidence verification, API error handling, and focused backend tests.
- Not connected: user authentication, persistent analysis history, and production deployment. The sign-in screen explicitly indicates that authentication is not configured.
- Requires your environment: a valid Groq API key and a live backend for real analyses. No API key is included in this project.
