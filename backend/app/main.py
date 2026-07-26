from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import attendance, auth, customers, employees, finance, inventory, invoices, quotations, reports, salaries

app = FastAPI(title="WoodWise API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(employees.router, prefix="/api/employees", tags=["employees"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["attendance"])
app.include_router(salaries.router, prefix="/api/salaries", tags=["salaries"])
app.include_router(customers.router, prefix="/api/customers", tags=["customers"])
app.include_router(quotations.router, prefix="/api/quotations", tags=["quotations"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["invoices"])
app.include_router(finance.router, prefix="/api/finance", tags=["finance"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["inventory"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
