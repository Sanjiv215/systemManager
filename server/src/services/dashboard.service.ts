import { Attendance } from '../models/Attendance'
import { Customer } from '../models/Customer'
import { Employee } from '../models/Employee'
import { Transaction } from '../models/Finance'
import { Invoice } from '../models/Invoice'
import { Quotation } from '../models/Quotation'
import { SalaryPayment } from '../models/Salary'

function monthBounds(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  return { start, end }
}

async function sum(model: typeof Transaction | typeof Invoice | typeof SalaryPayment, match: Record<string, unknown>, field: string) {
  const [row] = await model.aggregate([
    { $match: match },
    { $group: { _id: null, value: { $sum: `$${field}` } } },
  ])
  return row?.value || 0
}

export async function dashboardSummary() {
  const { start, end } = monthBounds()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(todayStart)
  todayEnd.setDate(todayEnd.getDate() + 1)

  const [
    totalRevenue,
    monthlyRevenue,
    monthlyExpenses,
    pendingPayments,
    workerCount,
    totalCustomers,
    activeQuotations,
    salaryExpenses,
    attendanceTotal,
    attendancePresent,
    recentTransactions,
    cashflow,
  ] = await Promise.all([
    sum(Transaction, { type: 'income', deletedAt: null }, 'amount'),
    sum(Transaction, { type: 'income', occurredAt: { $gte: start, $lt: end }, deletedAt: null }, 'amount'),
    sum(Transaction, { type: 'expense', occurredAt: { $gte: start, $lt: end }, deletedAt: null }, 'amount'),
    Invoice.aggregate([
      { $match: { status: { $in: ['unpaid', 'partial'] }, deletedAt: null } },
      { $group: { _id: null, value: { $sum: { $subtract: ['$total', '$paidAmount'] } } } },
    ]).then(([row]) => row?.value || 0),
    Employee.countDocuments({ deletedAt: null, status: 'active' }),
    Customer.countDocuments({ deletedAt: null }),
    Quotation.countDocuments({ deletedAt: null, status: { $in: ['draft', 'sent', 'accepted'] } }),
    sum(SalaryPayment, { createdAt: { $gte: start, $lt: end }, status: 'paid' }, 'netPay'),
    Attendance.countDocuments({ date: { $gte: todayStart, $lt: todayEnd } }),
    Attendance.countDocuments({ date: { $gte: todayStart, $lt: todayEnd }, status: { $in: ['present', 'half_day'] } }),
    Transaction.find({ deletedAt: null }).sort({ occurredAt: -1 }).limit(10).lean(),
    Transaction.aggregate([
      { $match: { occurredAt: { $gte: start, $lt: end }, deletedAt: null } },
      {
        $group: {
          _id: { day: { $dayOfMonth: '$occurredAt' }, type: '$type' },
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.day': 1 } },
    ]),
  ])

  return {
    metrics: {
      totalRevenue,
      monthlyRevenue,
      monthlyProfit: monthlyRevenue - monthlyExpenses - salaryExpenses,
      pendingPayments,
      workerCount,
      attendancePercentage: attendanceTotal ? Math.round((attendancePresent / attendanceTotal) * 100) : 0,
      salaryExpenses,
      totalCustomers,
      activeQuotations,
    },
    recentTransactions,
    cashflow,
  }
}
