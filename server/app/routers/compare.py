from fastapi import APIRouter
from app.schemas.compare import CompareRequest, CompareResponse, DiffItem
from app.services.compare_service import CompareService

router = APIRouter(prefix="/compare", tags=["Compare"])

@router.post("", response_model=CompareResponse)
def compare_labels(request: CompareRequest):
    result = CompareService.compare_labels(
        baseline_gtin=request.baseline_gtin,
        candidate_gtin=request.candidate_gtin,
        baseline_exp=request.baseline_exp,
        candidate_exp=request.candidate_exp,
        baseline_lot=request.baseline_lot,
        candidate_lot=request.candidate_lot,
        baseline_text=request.baseline_text,
        candidate_text=request.candidate_text,
    )

    diff_items = [DiffItem(**d) for d in result["diffs"]]

    return CompareResponse(
        risk_level=result["risk_level"],
        verdict=result["verdict"],
        diffs=diff_items,
        text_similarity_ratio=result["text_similarity_ratio"],
    )
