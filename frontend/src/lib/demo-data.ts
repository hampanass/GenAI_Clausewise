import type { AnalysisResult, CompanyProfile } from "@/lib/types";

export interface DemoScenario {
  id: string;
  title: string;
  badge: string;
  description: string;
  defaultProfile?: CompanyProfile;
  result: AnalysisResult;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "turnover",
    title: "Turnover Doubled (₹50 Lakh → ₹1 Crore)",
    badge: "Financial Barrier",
    description: "Corrigendum 1 increases the minimum annual turnover threshold from ₹50 Lakh to ₹1 Crore.",
    defaultProfile: {
      turnover: "₹75 Lakh",
      experience_years: "4",
      certifications: ["ISO 9001:2015"],
      notes: "MSME Registered contractor",
    },
    result: {
      summary: "The amended tender (Corrigendum 1) modifies the financial eligibility criteria, raising the minimum average annual turnover requirement from ₹50 Lakh to ₹1 Crore for the last three financial years.",
      counts: { added: 0, modified: 1, removed: 0 },
      changes: [
        {
          category: "modified",
          requirement: "Minimum Average Annual Turnover",
          original_value: "₹50 Lakh",
          amended_value: "₹1 Crore",
          explanation: "The financial eligibility bar has doubled from ₹50 Lakh to ₹1 Crore across the preceding three audited financial years.",
          compliance_impact: "Bidders with turnover between ₹50 Lakh and ₹1 Crore are no longer eligible as sole bidders and may need to explore a Consortium or Joint Venture structure.",
          evidence_original: [
            { quote: "The bidder must have an average annual financial turnover of at least Rs. 50 Lakh during the last three financial years.", page: 4 }
          ],
          evidence_amended: [
            { quote: "Clause 3.1.2: Minimum average annual turnover is revised to Rs. 1 Crore (One Crore) for the last three financial years.", page: 1 }
          ],
          review_documents: [
            "Audited Balance Sheets (last 3 financial years)",
            "CA Turnover Certificate with UDIN",
            "Joint Venture / Consortium Agreement (if applicable)"
          ],
          needs_review: false,
        }
      ],
      items_to_review: [
        "Verify Chartered Accountant (CA) turnover certificate against the revised ₹1 Crore threshold.",
        "Assess whether Joint Venture (JV) or Consortium formation is permitted under Section 4."
      ],
      warnings: [],
      company_profile: {
        turnover: "₹75 Lakh",
        experience_years: "4",
        certifications: ["ISO 9001:2015"],
      },
      company_assessment: {
        verdict: "ineligible",
        summary: "Critical eligibility barriers detected against the amended conditions: company turnover (₹75 Lakh) is below the revised threshold of ₹1 Crore.",
        compliance_checks: [
          {
            requirement: "Minimum Average Annual Turnover",
            status: "not_met",
            reason: "Company turnover (₹75 Lakh) is below the amended requirement (₹1 Crore).",
            recommendation: "Form a Consortium or Joint Venture (JV) with a partner firm to satisfy aggregate turnover.",
          }
        ]
      },
      usage: {
        prompt_tokens: 1240,
        completion_tokens: 310,
        total_tokens: 1550,
      },
    }
  },
  {
    id: "iso-added",
    title: "Mandatory ISO 9001:2015 Added",
    badge: "New Quality Mandate",
    description: "Corrigendum 2 introduces a mandatory quality certification requirement before technical bid opening.",
    defaultProfile: {
      turnover: "₹1.5 Crore",
      experience_years: "5",
      certifications: ["ISO 9001:2015"],
    },
    result: {
      summary: "Corrigendum 2 introduces a mandatory quality certification requirement: bidders must now submit a valid ISO 9001:2015 accreditation certificate.",
      counts: { added: 1, modified: 0, removed: 0 },
      changes: [
        {
          category: "added",
          requirement: "Quality Management Certification (ISO 9001)",
          original_value: null,
          amended_value: "Mandatory ISO 9001:2015 certification",
          explanation: "A newly introduced requirement makes valid ISO 9001:2015 accreditation mandatory for technical bid eligibility.",
          compliance_impact: "Bidders without an active ISO 9001 certification will be disqualified during technical qualification.",
          evidence_original: [],
          evidence_amended: [
            { quote: "Bidder must possess a valid ISO 9001:2015 certification in quality management as on the date of bid submission.", page: 2 }
          ],
          review_documents: [
            "Valid ISO 9001:2015 Certificate copy",
            "NABCB / IAF accreditation check proof"
          ],
          needs_review: false,
        }
      ],
      items_to_review: [
        "Check validity date of existing ISO 9001 certificate to ensure it covers the entire bid validity window.",
        "Confirm certificate issuer is accredited by IAF or NABCB."
      ],
      warnings: [],
      company_profile: {
        turnover: "₹1.5 Crore",
        experience_years: "5",
        certifications: ["ISO 9001:2015"],
      },
      company_assessment: {
        verdict: "eligible",
        summary: "Your company holds a valid ISO 9001:2015 certification and meets the newly introduced quality mandate.",
        compliance_checks: [
          {
            requirement: "Quality Management Certification (ISO 9001)",
            status: "met",
            reason: "Company profile contains matching certification (ISO 9001:2015).",
          }
        ]
      },
      usage: {
        prompt_tokens: 1480,
        completion_tokens: 390,
        total_tokens: 1870,
      },
    }
  },
  {
    id: "multi-change",
    title: "Turnover, Experience & Deadline Revisions",
    badge: "Triple Amendment",
    description: "Comprehensive corrigendum modifying financial turnover, technical experience, and extending bid submission deadline.",
    defaultProfile: {
      turnover: "₹1.2 Crore",
      experience_years: "4",
      certifications: ["ISO 9001:2015"],
    },
    result: {
      summary: "Corrigendum 4 issues sweeping amendments affecting financial eligibility, technical experience requirements, and bid submission timelines.",
      counts: { added: 0, modified: 3, removed: 0 },
      changes: [
        {
          category: "modified",
          requirement: "Minimum Average Annual Turnover",
          original_value: "₹50 Lakh",
          amended_value: "₹1 Crore",
          explanation: "Turnover eligibility threshold increased by 100% to ₹1 Crore for the last 3 financial years.",
          compliance_impact: "Financial documentation must be recertified with CA certificates verifying the ₹1 Crore threshold.",
          evidence_original: [
            { quote: "The bidder must have an average annual financial turnover of at least Rs. 50 Lakh during the last three financial years.", page: 4 }
          ],
          evidence_amended: [
            { quote: "Clause 3.1.2: Minimum average annual turnover is revised to Rs. 1 Crore (One Crore) for the last three financial years.", page: 1 }
          ],
          review_documents: [
            "Audited Financial Statements",
            "CA Certificate with UDIN"
          ],
          needs_review: false,
        },
        {
          category: "modified",
          requirement: "Relevant Past Project Experience",
          original_value: "3 years",
          amended_value: "5 years",
          explanation: "Minimum required sectoral experience has been increased from 3 years to 5 continuous years.",
          compliance_impact: "Work completion certificates and client satisfaction letters must demonstrate at least 5 years of completed relevant works.",
          evidence_original: [
            { quote: "The agency must have at least 3 (three) years of experience in executing similar civil construction projects.", page: 6 }
          ],
          evidence_amended: [
            { quote: "Clause 4.1: Experience requirement is enhanced from 3 years to 5 (five) years in similar government works.", page: 2 }
          ],
          review_documents: [
            "Client Completion Certificates spanning past 5 years",
            "Work Order copies with completion milestones"
          ],
          needs_review: false,
        },
        {
          category: "modified",
          requirement: "Bid Submission Deadline & EMD Validity",
          original_value: "15 December 2026",
          amended_value: "20 December 2026",
          explanation: "The last date for submission of online bids has been extended by 5 days, from 15 December to 20 December 2026.",
          compliance_impact: "Provides an additional 5 days for bid preparation; ensure Earnest Money Deposit (EMD) and Bank Guarantee validity are extended accordingly.",
          evidence_original: [
            { quote: "Last date and time of submission of bids: 15.12.2026 up to 15:00 hrs.", page: 2 }
          ],
          evidence_amended: [
            { quote: "The bid submission closing date is hereby extended up to 20.12.2026, 17:00 hrs.", page: 3 }
          ],
          review_documents: [
            "Bank Guarantee (BG) validity extension",
            "Earnest Money Deposit (EMD) challan"
          ],
          needs_review: false,
        }
      ],
      items_to_review: [
        "Request bank to issue BG extension ensuring minimum 90-day coverage from the revised 20 December 2026 deadline.",
        "Re-aggregate 5-year work completion records and CA turnover statements."
      ],
      warnings: [],
      company_profile: {
        turnover: "₹1.2 Crore",
        experience_years: "4",
        certifications: ["ISO 9001:2015"],
      },
      company_assessment: {
        verdict: "conditionally_eligible",
        summary: "Turnover condition (₹1.2 Cr vs ₹1 Cr) is met. However, your 4 years of experience falls 1 year short of the revised 5-year requirement — verify if past projects of partner firms can be counted.",
        compliance_checks: [
          {
            requirement: "Minimum Average Annual Turnover",
            status: "met",
            reason: "Company turnover (₹1.2 Crore) exceeds the revised threshold of ₹1 Crore.",
          },
          {
            requirement: "Relevant Past Project Experience",
            status: "not_met",
            reason: "Company has 4 years of experience, but amended tender requires 5 years.",
            recommendation: "Evaluate Consortium option or seek pre-bid clarification on aggregate JV experience.",
          },
          {
            requirement: "Bid Submission Deadline & EMD Validity",
            status: "needs_verification",
            reason: "Verify that Bank Guarantee validity period covers 90 days from the extended 20 Dec 2026 deadline.",
            recommendation: "Submit BG extension amendment request to your issuing bank.",
          }
        ]
      },
      usage: {
        prompt_tokens: 2180,
        completion_tokens: 640,
        total_tokens: 2820,
      },
    }
  },
  {
    id: "iso-removed",
    title: "ISO Certification Removed / Relaxed",
    badge: "Relaxation",
    description: "Corrigendum 3 deletes the ISO 9001 mandate, easing criteria for small bidders.",
    result: {
      summary: "Corrigendum 3 removes the mandatory ISO 9001 certification requirement originally listed under technical criteria, easing qualification constraints for general bidders.",
      counts: { added: 0, modified: 0, removed: 1 },
      changes: [
        {
          category: "removed",
          requirement: "ISO 9001 Certification Requirement",
          original_value: "Mandatory ISO 9001:2015 certification",
          amended_value: null,
          explanation: "The ISO 9001 certification condition specified in Section 2.4 of the original tender document has been withdrawn.",
          compliance_impact: "Bidders are no longer disqualified for lacking ISO certification, lowering the barrier to entry.",
          evidence_original: [
            { quote: "Submission of ISO 9001:2015 certificate is mandatory for technical pre-qualification.", page: 7 }
          ],
          evidence_amended: [],
          review_documents: [
            "Technical qualification checklist"
          ],
          needs_review: true,
        }
      ],
      items_to_review: [
        "Confirm with the tendering authority whether the omission applies unconditionally or if alternative quality accreditations still earn evaluation preference points."
      ],
      warnings: [
        "Requirement removal inferred from deletion in Corrigendum 3. Verify that no addendum re-instates quality evaluation marks."
      ],
      usage: {
        prompt_tokens: 1120,
        completion_tokens: 280,
        total_tokens: 1400,
      },
    }
  }
];
