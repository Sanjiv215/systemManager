from fastapi import APIRouter

router = APIRouter()


@router.get("/alerts")
def low_stock_alerts() -> dict[str, list[dict[str, str]]]:
    return {"items": []}
