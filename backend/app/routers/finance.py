from fastapi import APIRouter

router = APIRouter()


@router.get("/transactions")
def list_transactions() -> dict[str, list[dict[str, str]]]:
    return {"items": []}
