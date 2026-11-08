import fitz
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def make_pdf(text: str) -> bytes:
    document = fitz.open()
    page = document.new_page()
    page.insert_text((72, 72), text)
    content = document.tobytes()
    document.close()
    return content


def test_analyze_rejects_non_pdf_extension() -> None:
    response = client.post(
        "/api/v1/amendments/analyze",
        files={
            "original_file": ("original.txt", b"not a PDF", "text/plain"),
            "amended_file": ("amended.pdf", make_pdf("amended text"), "application/pdf"),
        },
    )

    assert response.status_code == 415
    assert "extension" in response.json()["detail"]


def test_analyze_rejects_invalid_pdf_content() -> None:
    response = client.post(
        "/api/v1/amendments/analyze",
        files={
            "original_file": ("original.pdf", b"%PDF-not a valid document", "application/pdf"),
            "amended_file": ("amended.pdf", make_pdf("amended text"), "application/pdf"),
        },
    )

    assert response.status_code == 422
    assert "readable PDF" in response.json()["detail"]


def test_analyze_reports_missing_groq_configuration(monkeypatch) -> None:
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    pdf = make_pdf("Tender requirement text.")
    response = client.post(
        "/api/v1/amendments/analyze",
        files={
            "original_file": ("original.pdf", pdf, "application/pdf"),
            "amended_file": ("amended.pdf", pdf, "application/pdf"),
        },
    )

    assert response.status_code == 503
    assert "GROQ_API_KEY" in response.json()["detail"]
