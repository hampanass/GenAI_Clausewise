from app.models import AnalysisResult
from app.services.analyzer import verify_evidence
from app.services.pdf import ExtractedDocument


def test_evidence_is_verified_against_its_document_and_page() -> None:
    result = AnalysisResult.model_validate(
        {
            "summary": "The bid security period changed.",
            "counts": {"added": 0, "modified": 1, "removed": 0},
            "changes": [
                {
                    "category": "modified",
                    "requirement": "Bid security validity",
                    "original_value": "90 days",
                    "amended_value": "120 days",
                    "explanation": "The validity period was extended.",
                    "compliance_impact": "Confirm the bank guarantee covers the longer period.",
                    "evidence_original": [{"quote": "Security valid for 90 days", "page": 1}],
                    "evidence_amended": [
                        {"quote": "Security valid for 120 days", "page": 2},
                        {"quote": "invented citation", "page": 1},
                    ],
                    "review_documents": ["Bank guarantee"],
                    "needs_review": False,
                }
            ],
            "items_to_review": [],
            "warnings": [],
        }
    )

    checked = verify_evidence(
        result,
        ExtractedDocument(pages=["Security valid for 90 days"]),
        ExtractedDocument(pages=["A different clause", "Security valid for 120 days"]),
    )

    assert len(checked.changes[0].evidence_original) == 1
    assert len(checked.changes[0].evidence_amended) == 1
    assert checked.changes[0].evidence_amended[0].page == 2
    assert len(checked.warnings) == 1
