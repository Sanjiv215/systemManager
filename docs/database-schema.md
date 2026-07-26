# Database Schema Overview

Core PostgreSQL tables:

- `users`: login identity, password hash, admin/manager/worker role.
- `employees`: worker profile, contact details, joining date, salary, document URL.
- `attendance`: daily status with present, absent, half day, and leave values.
- `salary_runs`: monthly salary generation batch.
- `salary_payments`: salary, advances, bonuses, deductions, payment history, PDF slip URL.
- `customers`: customer contact information, address, and outstanding payment rollups.
- `quotations`: quotation header, validity, totals, notes, and conversion status.
- `quotation_items`: furniture item name, size/detail, quantity, unit price, tax, discount.
- `invoices`: invoice header, QR metadata, payment status, paid amount, PDF URL.
- `expenses`: material, transport, electricity, worker payment, miscellaneous categories.
- `transactions`: income/expense ledger with cash/bank mode.
- `inventory_items`: wood, hardware, material stock levels and low stock threshold.
- `suppliers`: supplier contacts and purchase history.
- `audit_logs`: actor, action, entity, timestamp, and diff metadata.

Recommended indexes:

- `attendance(employee_id, work_date)`
- `invoices(customer_id, status)`
- `transactions(happened_on, kind, mode)`
- `inventory_items(category, quantity)`
- `audit_logs(entity_type, entity_id, created_at)`
