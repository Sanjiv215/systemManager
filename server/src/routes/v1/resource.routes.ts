import { Router } from 'express'
import { crudController } from '../../controllers/crud.controller'
import {
  convertQuotation,
  createInvoice,
  createQuotation,
  dashboard,
  exportReport,
  generateInvoicePdf,
  generateQuotationPdf,
  generateSalary,
} from '../../controllers/business.controller'
import { authenticate, authorize } from '../../middleware/auth'
import { validate } from '../../middleware/validate'
import { Attendance } from '../../models/Attendance'
import { Customer } from '../../models/Customer'
import { Employee } from '../../models/Employee'
import { Transaction } from '../../models/Finance'
import { InventoryItem } from '../../models/Inventory'
import { Invoice } from '../../models/Invoice'
import { Quotation } from '../../models/Quotation'
import { SalaryPayment, SalaryRun } from '../../models/Salary'
import {
  attendanceSchema,
  customerSchema,
  employeeSchema,
  inventorySchema,
  invoiceSchema,
  quotationSchema,
  salaryGenerateSchema,
  transactionSchema,
} from '../../validators/business'
import { idParamSchema, listQuerySchema } from '../../validators/common'

export const resourceRoutes = Router()

const employee = crudController(Employee, 'Employee', ['name', 'phone', 'position'])
const customer = crudController(Customer, 'Customer', ['name', 'phone', 'email', 'gstNumber'])
const attendance = crudController(Attendance, 'Attendance')
const transaction = crudController(Transaction, 'Transaction', ['category', 'description'])
const inventory = crudController(InventoryItem, 'InventoryItem', ['name', 'sku', 'category'])
const quotation = crudController(Quotation, 'Quotation', ['quotationNumber'])
const invoice = crudController(Invoice, 'Invoice', ['invoiceNumber'])
const salaryRun = crudController(SalaryRun, 'SalaryRun')
const salaryPayment = crudController(SalaryPayment, 'SalaryPayment')

resourceRoutes.use(authenticate)

resourceRoutes.get('/dashboard', dashboard)

resourceRoutes.route('/employees')
  .get(validate(listQuerySchema), employee.list)
  .post(authorize('admin', 'manager'), validate(employeeSchema), employee.create)
resourceRoutes.route('/employees/:id')
  .put(authorize('admin', 'manager'), validate(idParamSchema.merge(employeeSchema.partial())), employee.update)
  .delete(authorize('admin'), validate(idParamSchema), employee.remove)

resourceRoutes.route('/customers')
  .get(validate(listQuerySchema), customer.list)
  .post(authorize('admin', 'manager'), validate(customerSchema), customer.create)
resourceRoutes.route('/customers/:id')
  .put(authorize('admin', 'manager'), validate(idParamSchema.merge(customerSchema.partial())), customer.update)
  .delete(authorize('admin'), validate(idParamSchema), customer.remove)

resourceRoutes.route('/attendance')
  .get(validate(listQuerySchema), attendance.list)
  .post(authorize('admin', 'manager'), validate(attendanceSchema), attendance.create)
resourceRoutes.route('/attendance/:id')
  .put(authorize('admin', 'manager'), validate(idParamSchema.merge(attendanceSchema.partial())), attendance.update)
  .delete(authorize('admin'), validate(idParamSchema), attendance.remove)

resourceRoutes.route('/transactions')
  .get(validate(listQuerySchema), transaction.list)
  .post(authorize('admin', 'manager'), validate(transactionSchema), transaction.create)
resourceRoutes.route('/transactions/:id')
  .put(authorize('admin', 'manager'), validate(idParamSchema.merge(transactionSchema.partial())), transaction.update)
  .delete(authorize('admin'), validate(idParamSchema), transaction.remove)

resourceRoutes.route('/inventory')
  .get(validate(listQuerySchema), inventory.list)
  .post(authorize('admin', 'manager'), validate(inventorySchema), inventory.create)
resourceRoutes.route('/inventory/:id')
  .put(authorize('admin', 'manager'), validate(idParamSchema.merge(inventorySchema.partial())), inventory.update)
  .delete(authorize('admin'), validate(idParamSchema), inventory.remove)

resourceRoutes.get('/quotations', validate(listQuerySchema), quotation.list)
resourceRoutes.post('/quotations', authorize('admin', 'manager'), validate(quotationSchema), createQuotation)
resourceRoutes.put('/quotations/:id', authorize('admin', 'manager'), validate(idParamSchema.merge(quotationSchema.partial())), quotation.update)
resourceRoutes.delete('/quotations/:id', authorize('admin'), validate(idParamSchema), quotation.remove)
resourceRoutes.post('/quotations/:id/convert-to-invoice', authorize('admin', 'manager'), validate(idParamSchema), convertQuotation)
resourceRoutes.post('/quotations/:id/pdf', authorize('admin', 'manager'), validate(idParamSchema), generateQuotationPdf)

resourceRoutes.get('/invoices', validate(listQuerySchema), invoice.list)
resourceRoutes.post('/invoices', authorize('admin', 'manager'), validate(invoiceSchema), createInvoice)
resourceRoutes.put('/invoices/:id', authorize('admin', 'manager'), validate(idParamSchema.merge(invoiceSchema.partial())), invoice.update)
resourceRoutes.delete('/invoices/:id', authorize('admin'), validate(idParamSchema), invoice.remove)
resourceRoutes.post('/invoices/:id/pdf', authorize('admin', 'manager'), validate(idParamSchema), generateInvoicePdf)

resourceRoutes.get('/salary-runs', validate(listQuerySchema), salaryRun.list)
resourceRoutes.post('/salary-runs/generate', authorize('admin', 'manager'), validate(salaryGenerateSchema), generateSalary)
resourceRoutes.get('/salary-payments', validate(listQuerySchema), salaryPayment.list)

resourceRoutes.get('/reports/export.xlsx', authorize('admin', 'manager'), exportReport)
