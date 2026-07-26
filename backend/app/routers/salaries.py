from fastapi import APIRouter

router = APIRouter()


@router.post("/generate")
def generate_salary() -> dict[str, str]:
    return {"status": "queued"}
