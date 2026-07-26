# WoodWise Backend

FastAPI/PostgreSQL foundation for the furniture manufacturing management system.

## Modules

- Auth with JWT and role-based access for admin, manager, and worker users.
- Employees, attendance, salary generation, advances, bonuses, deductions, and salary slips.
- Customers, quotations, invoices, partial payments, QR metadata, GST/tax fields, and PDF output.
- Expenses, income, cash/bank transactions, inventory, suppliers, audit logs, reports, and exports.
- File storage for company logos, worker documents, and generated PDFs.

## Run Locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Use `docker-compose.yml` from the project root to start PostgreSQL.
