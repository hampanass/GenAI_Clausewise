"""
Generate professional sample Government Tender PDFs and Corrigenda
covering all scenarios: Added, Modified, and Removed requirements.
"""

from pathlib import Path
import pymupdf as fitz


def create_page_with_text(doc: fitz.Document, title: str, subtitle: str, sections: list[dict], page_num: int, total_pages: int):
    page = doc.new_page(width=595, height=842)  # A4 size

    # Header bar
    rect_header = fitz.Rect(36, 30, 559, 65)
    page.draw_rect(rect_header, color=(0.07, 0.16, 0.25), fill=(0.07, 0.16, 0.25))
    page.insert_text((48, 52), "GOVERNMENT OF INDIA · PUBLIC WORKS DEPARTMENT", fontname="helv", fontsize=11, color=(1, 1, 1))

    # Title & Subtitle
    page.insert_text((36, 90), title, fontname="helv", fontsize=14, color=(0.07, 0.16, 0.25))
    page.insert_text((36, 108), subtitle, fontname="helv", fontsize=9.5, color=(0.3, 0.35, 0.4))
    page.draw_line(fitz.Point(36, 118), fitz.Point(559, 118), color=(0.85, 0.88, 0.9), width=1)

    y = 140
    for section in sections:
        # Section header
        page.insert_text((36, y), section["heading"], fontname="helv", fontsize=11, color=(0.09, 0.54, 0.51))
        y += 18

        for clause in section["clauses"]:
            tag = clause.get("tag", "")
            text = clause["text"]
            
            # Box/card background
            rect_clause = fitz.Rect(36, y - 10, 559, y + 28)
            page.draw_rect(rect_clause, color=(0.88, 0.91, 0.93), fill=(0.97, 0.98, 0.99))

            if tag:
                page.insert_text((44, y + 5), f"[{tag}]", fontname="helv", fontsize=8.5, color=(0.85, 0.4, 0.1))
                page.insert_text((95, y + 5), text, fontname="helv", fontsize=9, color=(0.1, 0.15, 0.2))
            else:
                page.insert_text((44, y + 5), text, fontname="helv", fontsize=9, color=(0.1, 0.15, 0.2))
            
            y += 44

        y += 12

    # Footer
    page.draw_line(fitz.Point(36, 800), fitz.Point(559, 800), color=(0.85, 0.88, 0.9), width=1)
    page.insert_text((36, 815), "Official Tender Document · ClauseWise Test Harness", fontname="helv", fontsize=8, color=(0.5, 0.55, 0.6))
    page.insert_text((500, 815), f"Page {page_num} of {total_pages}", fontname="helv", fontsize=8, color=(0.5, 0.55, 0.6))


def generate_all_samples(output_dirs: list[Path]):
    for d in output_dirs:
        d.mkdir(parents=True, exist_ok=True)

    # -------------------------------------------------------------
    # 1. ORIGINAL TENDER (NIT No. PWD/CIVIL/2026/088)
    # -------------------------------------------------------------
    doc_orig = fitz.open()

    # Page 1: General Info & Tender Notice
    p1_sections = [
        {
            "heading": "1. NOTICE INVITING TENDER & PROJECT SCOPE",
            "clauses": [
                {"tag": "Ref", "text": "Tender Notice No: PWD/CIVIL/2026/088 for Modernization of Integrated Administrative Complex."},
                {"tag": "Scope", "text": "Scope of work includes civil construction, structural glazing, electrical works, and allied infrastructure."},
                {"tag": "Value", "text": "Estimated Contract Value: Rs. 8,50,00,000 (Rupees Eight Crore Fifty Lakh only)."}
            ]
        },
        {
            "heading": "2. FINANCIAL ELIGIBILITY REQUIREMENTS",
            "clauses": [
                {"tag": "Clause 1.1", "text": "Solvency Certificate of at least Rs. 2 Crore issued by a scheduled commercial bank within 6 months."},
                {"tag": "Clause 1.2", "text": "The bidder must have an average annual financial turnover of at least Rs. 50 Lakh during the last three financial years."},
                {"tag": "Clause 1.3", "text": "Audited Profit and Loss accounts with balance sheets certified by a CA with UDIN must be enclosed."}
            ]
        }
    ]
    create_page_with_text(doc_orig, "TENDER NOTICE No. PWD/CIVIL/2026/088", "Civil Works Division · State Project Unit", p1_sections, 1, 2)

    # Page 2: Technical Criteria & Submission Schedule
    p2_sections = [
        {
            "heading": "3. TECHNICAL QUALIFICATION & EXPERIENCE CRITERIA",
            "clauses": [
                {"tag": "Clause 2.1", "text": "The agency must have at least 3 (three) years of experience in executing similar civil construction projects."},
                {"tag": "Clause 2.2", "text": "Must have successfully completed at least one single work of value not less than Rs. 4 Crore in the last 5 years."},
                {"tag": "Clause 2.4", "text": "Submission of ISO 14001:2015 certificate is mandatory for technical pre-qualification."}
            ]
        },
        {
            "heading": "4. BID SUBMISSION SCHEDULE & EMD",
            "clauses": [
                {"tag": "Clause 3.1", "text": "Last date and time of submission of bids: 15.12.2026 up to 15:00 hrs."},
                {"tag": "Clause 3.2", "text": "Earnest Money Deposit (EMD) of Rs. 2,00,000 via online challan or Bank Guarantee with 90-day validity."}
            ]
        }
    ]
    create_page_with_text(doc_orig, "TENDER NOTICE No. PWD/CIVIL/2026/088", "Technical Criteria & Bid Conditions", p2_sections, 2, 2)

    # -------------------------------------------------------------
    # 2. AMENDED TENDER / CORRIGENDUM (Corrigendum No. 01)
    # -------------------------------------------------------------
    doc_corr = fitz.open()

    p1_corr_sections = [
        {
            "heading": "1. OFFICIAL CORRIGENDUM & AMENDMENT NOTICE",
            "clauses": [
                {"tag": "Notice", "text": "Corrigendum No. 01 to Tender No: PWD/CIVIL/2026/088 pursuant to pre-bid meeting recommendations."},
                {"tag": "Validity", "text": "All other terms and conditions of the original tender remain unchanged unless modified herein."}
            ]
        },
        {
            "heading": "2. AMENDMENTS TO FINANCIAL & TECHNICAL QUALIFICATIONS",
            "clauses": [
                {"tag": "Modified", "text": "Clause 3.1.2: Minimum average annual turnover is revised to Rs. 1 Crore (One Crore) for the last three financial years."},
                {"tag": "Modified", "text": "Clause 4.1: Experience requirement is enhanced from 3 years to 5 (five) years in similar government works."},
                {"tag": "Added", "text": "Bidder must possess a valid ISO 9001:2015 certification in quality management as on the date of bid submission."}
            ]
        }
    ]
    create_page_with_text(doc_corr, "CORRIGENDUM No. 01 · AMENDMENT ORDER", "Ref: PWD/CIVIL/2026/088/CORR-1", p1_corr_sections, 1, 2)

    p2_corr_sections = [
        {
            "heading": "3. DELETIONS AND EXTENSION OF SUBMISSION TIMELINE",
            "clauses": [
                {"tag": "Removed", "text": "Requirement of ISO 14001 certification under original Clause 2.4 is hereby deleted and withdrawn."},
                {"tag": "Modified", "text": "The bid submission closing date is hereby extended up to 20.12.2026, 17:00 hrs."},
                {"tag": "Guideline", "text": "Bank Guarantee / EMD validity must be extended to ensure compliance with the revised 20 December deadline."}
            ]
        }
    ]
    create_page_with_text(doc_corr, "CORRIGENDUM No. 01 · AMENDMENT ORDER", "Timeline Extensions & Revised Requirements", p2_corr_sections, 2, 2)

    # Save to all target folders
    files = [
        ("Original_Tender_NIT_2026_PWD.pdf", doc_orig),
        ("Corrigendum_01_Amendments.pdf", doc_corr),
    ]

    for fname, pdf in files:
        for d in output_dirs:
            target = d / fname
            pdf.save(str(target))
            print(f"Created: {target}")


if __name__ == "__main__":
    base = Path(__file__).resolve().parent.parent
    sample_dirs = [
        base / "sample_documents",
        base / "frontend" / "public" / "samples",
    ]
    generate_all_samples(sample_dirs)
