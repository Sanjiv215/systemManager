from fastapi import APIRouter

router = APIRouter()


@router.post("/{quotation_id}/convert-to-invoice")
def convert_to_invoice(quotation_id: int) -> dict[str, int]:
    return {"quotation_id": quotation_id}
