from app.models import (
    AnalysisResult,
    ChangeCategory,
    ChangeCounts,
    Evidence,
    GroqUsage,
    RequirementChange,
)

DEMO_SCENARIOS: dict[str, AnalysisResult] = {
    "turnover": AnalysisResult(
        summary="The amended tender (Corrigendum 1) modifies the financial eligibility criteria, raising the minimum average annual turnover requirement from ₹50 Lakh to ₹1 Crore for the last three financial years.",
        counts=ChangeCounts(added=0, modified=1, removed=0),
        changes=[
            RequirementChange(
                category=ChangeCategory.MODIFIED,
                requirement="Minimum Average Annual Turnover",
                original_value="₹50 Lakh",
                amended_value="₹1 Crore",
                explanation="The financial eligibility bar has doubled from ₹50 Lakh to ₹1 Crore across the preceding three audited financial years.",
                compliance_impact="Bidders with turnover between ₹50 Lakh and ₹1 Crore are no longer eligible as sole bidders and may need to explore a Consortium or Joint Venture structure.",
                evidence_original=[
                    Evidence(quote="The bidder must have an average annual financial turnover of at least Rs. 50 Lakh during the last three financial years.", page=4)
                ],
                evidence_amended=[
                    Evidence(quote="Clause 3.1.2: Minimum average annual turnover is revised to Rs. 1 Crore (One Crore) for the last three financial years.", page=1)
                ],
                review_documents=[
                    "Audited Balance Sheets (last 3 financial years)",
                    "CA Turnover Certificate with UDIN",
                    "Joint Venture / Consortium Agreement (if applicable)"
                ],
                needs_review=False,
            )
        ],
        items_to_review=[
            "Verify Chartered Accountant (CA) turnover certificate against the revised ₹1 Crore threshold.",
            "Assess whether Joint Venture (JV) or Consortium formation is permitted under Section 4."
        ],
        warnings=[],
        usage=GroqUsage(prompt_tokens=1240, completion_tokens=310, total_tokens=1550),
    ),
    "iso-added": AnalysisResult(
        summary="Corrigendum 2 introduces a mandatory quality certification requirement: bidders must now submit a valid ISO 9001:2015 accreditation certificate.",
        counts=ChangeCounts(added=1, modified=0, removed=0),
        changes=[
            RequirementChange(
                category=ChangeCategory.ADDED,
                requirement="Quality Management Certification (ISO 9001)",
                original_value=None,
                amended_value="Mandatory ISO 9001:2015 certification",
                explanation="A newly introduced requirement makes valid ISO 9001:2015 accreditation mandatory for technical bid eligibility.",
                compliance_impact="Bidders without an active ISO 9001 certification will be disqualified during the technical evaluation stage.",
                evidence_original=[],
                evidence_amended=[
                    Evidence(quote="Bidder must possess a valid ISO 9001:2015 certification in quality management as on the date of bid submission.", page=2)
                ],
                review_documents=[
                    "Valid ISO 9001:2015 Certificate copy",
                    "NABCB / IAF accreditation check proof"
                ],
                needs_review=False,
            )
        ],
        items_to_review=[
            "Check validity date of existing ISO 9001 certificate to ensure it covers the entire bid validity window.",
            "Confirm certificate issuer is accredited by IAF or NABCB."
        ],
        warnings=[],
        usage=GroqUsage(prompt_tokens=1480, completion_tokens=390, total_tokens=1870),
    ),
    "iso-removed": AnalysisResult(
        summary="Corrigendum 3 removes the mandatory ISO 9001 certification requirement originally listed under technical criteria, easing qualification constraints for general bidders.",
        counts=ChangeCounts(added=0, modified=0, removed=1),
        changes=[
            RequirementChange(
                category=ChangeCategory.REMOVED,
                requirement="ISO 9001 Certification Requirement",
                original_value="Mandatory ISO 9001:2015 certification",
                amended_value=None,
                explanation="The ISO 9001 certification condition specified in Section 2.4 of the original tender document has been withdrawn.",
                compliance_impact="Bidders are no longer disqualified for lacking ISO certification, lowering the barrier to entry.",
                evidence_original=[
                    Evidence(quote="Submission of ISO 9001:2015 certificate is mandatory for technical pre-qualification.", page=7)
                ],
                evidence_amended=[],
                review_documents=[
                    "Technical qualification checklist"
                ],
                needs_review=True,
            )
        ],
        items_to_review=[
            "Confirm with the tendering authority whether the omission applies unconditionally or if alternative quality accreditations still earn evaluation preference points."
        ],
        warnings=[
            "Requirement removal inferred from deletion in Corrigendum 3. Verify that no addendum re-instates quality evaluation marks."
        ],
        usage=GroqUsage(prompt_tokens=1120, completion_tokens=280, total_tokens=1400),
    ),
    "multi-change": AnalysisResult(
        summary="Corrigendum 4 issues sweeping amendments affecting financial eligibility, technical experience requirements, and bid submission timelines.",
        counts=ChangeCounts(added=0, modified=3, removed=0),
        changes=[
            RequirementChange(
                category=ChangeCategory.MODIFIED,
                requirement="Minimum Average Annual Turnover",
                original_value="₹50 Lakh",
                amended_value="₹1 Crore",
                explanation="Turnover eligibility threshold increased by 100% to ₹1 Crore for the last 3 financial years.",
                compliance_impact="Financial documentation must be recertified with CA certificates verifying the ₹1 Crore threshold.",
                evidence_original=[
                    Evidence(quote="The bidder must have an average annual financial turnover of at least Rs. 50 Lakh during the last three financial years.", page=4)
                ],
                evidence_amended=[
                    Evidence(quote="Clause 3.1.2: Minimum average annual turnover is revised to Rs. 1 Crore (One Crore) for the last three financial years.", page=1)
                ],
                review_documents=[
                    "Audited Financial Statements",
                    "CA Certificate with UDIN"
                ],
                needs_review=False,
            ),
            RequirementChange(
                category=ChangeCategory.MODIFIED,
                requirement="Relevant Past Project Experience",
                original_value="3 years",
                amended_value="5 years",
                explanation="Minimum required sectoral experience has been increased from 3 years to 5 continuous years.",
                compliance_impact="Work completion certificates and client satisfaction letters must demonstrate at least 5 years of completed relevant works.",
                evidence_original=[
                    Evidence(quote="The agency must have at least 3 (three) years of experience in executing similar civil construction projects.", page=6)
                ],
                evidence_amended=[
                    Evidence(quote="Clause 4.1: Experience requirement is enhanced from 3 years to 5 (five) years in similar government works.", page=2)
                ],
                review_documents=[
                    "Client Completion Certificates spanning past 5 years",
                    "Work Order copies with completion milestones"
                ],
                needs_review=False,
            ),
            RequirementChange(
                category=ChangeCategory.MODIFIED,
                requirement="Bid Submission Deadline & EMD Validity",
                original_value="15 December 2026",
                amended_value="20 December 2026",
                explanation="The last date for submission of online bids has been extended by 5 days, from 15 December to 20 December 2026.",
                compliance_impact="Provides an additional 5 days for bid preparation; ensure Earnest Money Deposit (EMD) and Bank Guarantee validity are extended accordingly.",
                evidence_original=[
                    Evidence(quote="Last date and time of submission of bids: 15.12.2026 up to 15:00 hrs.", page=2)
                ],
                evidence_amended=[
                    Evidence(quote="The bid submission closing date is hereby extended up to 20.12.2026, 17:00 hrs.", page=3)
                ],
                review_documents=[
                    "Bank Guarantee (BG) validity extension",
                    "Earnest Money Deposit (EMD) challan"
                ],
                needs_review=False,
            )
        ],
        items_to_review=[
            "Request bank to issue BG extension ensuring minimum 90-day coverage from the revised 20 December 2026 deadline.",
            "Re-aggregate 5-year work completion records and CA turnover statements."
        ],
        warnings=[],
        usage=GroqUsage(prompt_tokens=2180, completion_tokens=640, total_tokens=2820),
    )
}

