from dataclasses import dataclass

import fitz
from fastapi import HTTPException, status


@dataclass(frozen=True)
class ExtractedDocument:
    pages: list[str]

    @property
    def text(self) -> str:
        return "\n\n".join(
            f"[Page {page_number}]\n{page_text}"
            for page_number, page_text in enumerate(self.pages, start=1)
            if page_text.strip()
        )


def extract_pdf(data: bytes, label: str) -> ExtractedDocument:
    try:
        with fitz.open(stream=data, filetype="pdf") as document:
            if document.is_encrypted:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"The {label} PDF is password-protected and cannot be read.",
                )
            pages = [page.get_text("text") for page in document]
    except HTTPException:
        raise
    except (fitz.FileDataError, fitz.EmptyFileError, ValueError) as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"The {label} file is not a readable PDF.",
        ) from error

    if not any(page.strip() for page in pages):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                f"No selectable text was found in the {label} PDF. "
                "Scanned PDFs need OCR before they can be analyzed."
            ),
        )
    return ExtractedDocument(pages=pages)
