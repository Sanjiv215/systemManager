from fastapi import APIRouter

router = APIRouter()


@router.get("/monthly")
def monthly_reports() -> dict[str, list[dict[str, str]]]:
    return {"items": []}
