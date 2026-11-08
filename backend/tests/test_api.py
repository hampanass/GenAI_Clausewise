import pymupdf as fitz
import pytest
import httpx
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch

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


def test_demo_scenario_turnover_returns_valid_data() -> None:
    response = client.get("/api/v1/demo/turnover")
    assert response.status_code == 200
    data = response.json()
    assert data["counts"]["modified"] == 1
    assert data["changes"][0]["original_value"] == "₹50 Lakh"
    assert data["changes"][0]["amended_value"] == "₹1 Crore"


def test_demo_scenario_evaluates_company_profile() -> None:
    # Company with turnover ₹75 Lakh vs amended ₹1 Crore -> should flag INELIGIBLE / NOT_MET
    response = client.get(
        "/api/v1/demo/turnover?turnover=75%20Lakh&experience_years=4"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["company_assessment"] is not None
    assert data["company_assessment"]["verdict"] == "ineligible"
    checks = data["company_assessment"]["compliance_checks"]
    assert any(c["status"] == "not_met" and "turnover" in c["requirement"].lower() for c in checks)


def _post_pdfs(monkeypatch, mock_response: httpx.Response) -> "requests.Response":
    """Helper: post two minimal PDFs with a mocked Groq response."""
    monkeypatch.setenv("GROQ_API_KEY", "test-key")
    pdf = make_pdf("Minimum turnover: ₹50 Lakh.")
    with patch("httpx.AsyncClient.post", new_callable=AsyncMock, return_value=mock_response):
        return client.post(
            "/api/v1/amendments/analyze",
            files={
                "original_file": ("original.pdf", pdf, "application/pdf"),
                "amended_file": ("amended.pdf", pdf, "application/pdf"),
            },
        )


def test_groq_rate_limit_returns_429(monkeypatch) -> None:
    mock = httpx.Response(429, headers={"Retry-After": "30"}, text="rate limited")
    response = _post_pdfs(monkeypatch, mock)
    assert response.status_code == 429
    assert "rate limit" in response.json()["detail"].lower()
    assert "30s" in response.json()["detail"]


def test_groq_auth_error_returns_503(monkeypatch) -> None:
    for status_code in (401, 403):
        mock = httpx.Response(status_code, text="unauthorized")
        response = _post_pdfs(monkeypatch, mock)
        assert response.status_code == 503
        assert "GROQ_API_KEY" in response.json()["detail"]


def test_groq_413_returns_413(monkeypatch) -> None:
    mock = httpx.Response(413, text="payload too large")
    response = _post_pdfs(monkeypatch, mock)
    assert response.status_code == 413
    assert "too large" in response.json()["detail"].lower()


def test_groq_tpm_exceeded_in_body_returns_413(monkeypatch) -> None:
    mock = httpx.Response(
        400,
        json={"error": {"message": "Rate limit exceeded: tokens per minute (TPM) limit reached."}},
    )
    response = _post_pdfs(monkeypatch, mock)
    assert response.status_code == 413
    assert "too large" in response.json()["detail"].lower()


def test_groq_other_error_returns_502(monkeypatch) -> None:
    mock = httpx.Response(500, text="internal server error")
    response = _post_pdfs(monkeypatch, mock)
    assert response.status_code == 502


def test_groq_successful_response_includes_usage(monkeypatch) -> None:
    groq_json = {
        "choices": [
            {
                "message": {
                    "content": '{"summary":"No major changes","counts":{"added":0,"modified":0,"removed":0},"changes":[],"items_to_review":[],"warnings":[]}'
                }
            }
        ],
        "usage": {
            "prompt_tokens": 150,
            "completion_tokens": 40,
            "total_tokens": 190,
        },
    }
    mock = httpx.Response(200, json=groq_json)
    response = _post_pdfs(monkeypatch, mock)
    assert response.status_code == 200
    data = response.json()
    assert "usage" in data
    assert data["usage"]["total_tokens"] == 190
