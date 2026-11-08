from dataclasses import dataclass, field

import pymupdf as fitz
from fastapi import HTTPException, status

UNPROCESSABLE_STATUS = getattr(status, "HTTP_422_UNPROCESSABLE_CONTENT", 422)


@dataclass(frozen=True)
class ExtractedDocument:
    pages: list[str]
    scanned_pages: list[int] = field(default_factory=list)

    @property
    def text(self) -> str:
        return "\n\n".join(
            f"[Page {page_number}]\n{page_text}"
            for page_number, page_text in enumerate(self.pages, start=1)
            if page_text.strip()
        )


def _extract_page_text(page, page_num: int) -> tuple[str, bool]:
    text = page.get_text("text")
    if text and text.strip():
        return text, False

    # If no digital text, attempt PyMuPDF OCR if Tesseract is available
    try:
        textpage = page.get_textpage_ocr(language="eng")
        ocr_text = textpage.extractText()
        if ocr_text and ocr_text.strip():
            return ocr_text, False
    except Exception:
        # OCR engine not configured or image not decipherable
        pass

    # Flag as scanned page if it contains embedded images
    images = page.get_images()
    is_scanned = len(images) > 0 or not text.strip()
    return text or "", is_scanned


def extract_pdf(data: bytes, label: str) -> ExtractedDocument:
    try:
        with fitz.open(stream=data, filetype="pdf") as document:
            if document.is_encrypted:
                raise HTTPException(
                    status_code=UNPROCESSABLE_STATUS,
                    detail=f"The {label} PDF is password-protected and cannot be read.",
                )
            
            extracted_pages: list[str] = []
            scanned_pages: list[int] = []

            for idx, page in enumerate(document, start=1):
                page_text, is_scanned = _extract_page_text(page, idx)
                extracted_pages.append(page_text)
                if is_scanned:
                    scanned_pages.append(idx)

    except HTTPException:
        raise
    except (fitz.FileDataError, fitz.EmptyFileError, ValueError) as error:
        raise HTTPException(
            status_code=UNPROCESSABLE_STATUS,
            detail=f"The {label} file is not a readable PDF.",
        ) from error

    if not any(page.strip() for page in extracted_pages):
        raise HTTPException(
            status_code=UNPROCESSABLE_STATUS,
            detail=(
                f"No selectable text was found in the {label} PDF ({len(extracted_pages)} page(s) appear to be scanned images). "
                "Scanned PDFs need OCR (such as Tesseract) before they can be analyzed."
            ),
        )

    return ExtractedDocument(pages=extracted_pages, scanned_pages=scanned_pages)
