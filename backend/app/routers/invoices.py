from fastapi import APIRouter

router = APIRouter()


@router.get("")
def list_invoices() -> dict[str, list[dict[str, str]]]:
    return {"items": []}
