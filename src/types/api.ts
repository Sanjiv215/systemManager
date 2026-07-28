export type Role = 'admin' | 'manager' | 'worker'

export type User = {
  id: string
  name: string
  email: string
  role: Role
}

export type DashboardSummary = {
  metrics: {
    totalRevenue: number
    monthlyRevenue: number
    monthlyProfit: number
    pendingPayments: number
    workerCount: number
    attendancePercentage: number
    salaryExpenses: number
    totalCustomers: number
    activeQuotations: number
  }
  recentTransactions: Transaction[]
  cashflow: Array<{ _id: { day: number; type: 'income' | 'expense' }; amount: number }>
}

export type Employee = {
  _id: string
  name: string
  phone: string
  email?: string
  position: string
  monthlySalary: number
  status: string
  joiningDate: string
}

export type Customer = {
  _id: string
  name: string
  phone: string
  email?: string
  address: string
  gstNumber?: string
}

export type Transaction = {
  _id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  mode: string
  occurredAt: string
  description?: string
}
