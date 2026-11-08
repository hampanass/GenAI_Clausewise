import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware

from app.models import AnalysisResult
from app.services.analyzer import analyze_documents
from app.services.pdf import extract_pdf

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "20"))
MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024
PDF_SIGNATURE = b"%PDF-"


@asynccontextmanager
async def lifespan(_: FastAPI):
    if MAX_UPLOAD_SIZE_MB <= 0:
        raise RuntimeError("MAX_UPLOAD_SIZE_MB must be a positive integer.")
    yield


app = FastAPI(
    title="ClauseWise API",
    description="Tender amendment comparison and compliance impact analysis.",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


async def read_pdf(file: UploadFile, label: str) -> bytes:
    filename = file.filename or ""
    if Path(filename).suffix.lower() != ".pdf":
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"The {label} file must have a .pdf extension.",
        )

    content = await file.read(MAX_UPLOAD_SIZE_BYTES + 1)
    if len(content) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Each PDF must be {MAX_UPLOAD_SIZE_MB} MB or smaller.",
        )
    if not content.startswith(PDF_SIGNATURE):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"The {label} file is not a PDF.",
        )
    return content


@app.get("/api/v1/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/amendments/analyze", response_model=AnalysisResult)
async def analyze_amendment(
    original_file: UploadFile = File(...),
    amended_file: UploadFile = File(...),
) -> AnalysisResult:
    original_bytes = await read_pdf(original_file, "original")
    amended_bytes = await read_pdf(amended_file, "amended")
    original_document = extract_pdf(original_bytes, "original")
    amended_document = extract_pdf(amended_bytes, "amended")
    return await analyze_documents(original_document, amended_document)
