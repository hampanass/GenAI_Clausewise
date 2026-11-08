from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class ChangeCategory(str, Enum):
    ADDED = "added"
    MODIFIED = "modified"
    REMOVED = "removed"


class Evidence(BaseModel):
    model_config = ConfigDict(extra="forbid")

    quote: str = Field(min_length=1)
    page: int = Field(ge=1)


class RequirementChange(BaseModel):
    model_config = ConfigDict(extra="forbid")

    category: ChangeCategory
    requirement: str = Field(min_length=1)
    original_value: str | None = None
    amended_value: str | None = None
    explanation: str = Field(min_length=1)
    compliance_impact: str = Field(min_length=1)
    evidence_original: list[Evidence] = Field(default_factory=list)
    evidence_amended: list[Evidence] = Field(default_factory=list)
    review_documents: list[str] = Field(default_factory=list)
    needs_review: bool = False


class ChangeCounts(BaseModel):
    added: int = Field(ge=0)
    modified: int = Field(ge=0)
    removed: int = Field(ge=0)


class AnalysisResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    summary: str = Field(min_length=1)
    counts: ChangeCounts
    changes: list[RequirementChange]
    items_to_review: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


def build_counts(changes: list[RequirementChange]) -> ChangeCounts:
    return ChangeCounts(
        added=sum(change.category == ChangeCategory.ADDED for change in changes),
        modified=sum(change.category == ChangeCategory.MODIFIED for change in changes),
        removed=sum(change.category == ChangeCategory.REMOVED for change in changes),
    )
