import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { IndianRupee, ReceiptText, TrendingUp, UsersRound } from 'lucide-react'
import { api } from '../api/client'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews'
import type { DashboardSummary } from '../types/api'

function currency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      setData(await api<DashboardSummary>('/dashboard'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const chartData = useMemo(() => {
    const days = new Map<number, { day: string; income: number; expenses: number }>()
    data?.cashflow.forEach((row) => {
      const current = days.get(row._id.day) || { day: String(row._id.day), income: 0, expenses: 0 }
      if (row._id.type === 'income') current.income = row.amount
      if (row._id.type === 'expense') current.expenses = row.amount
      days.set(row._id.day, current)
    })
    return [...days.values()]
  }, [data])

  if (loading) return <LoadingState label="Loading dashboard" />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!data) return <EmptyState title="Dashboard is ready when data is added" />

  const metrics = [
    { label: 'Total Revenue', value: currency(data.metrics.totalRevenue), icon: IndianRupee },
    { label: 'Monthly Revenue', value: currency(data.metrics.monthlyRevenue), icon: TrendingUp },
    { label: 'Monthly Profit', value: currency(data.metrics.monthlyProfit), icon: TrendingUp },
    { label: 'Pending Payments', value: currency(data.metrics.pendingPayments), icon: ReceiptText },
    { label: 'Workers', value: String(data.metrics.workerCount), icon: UsersRound },
    { label: 'Attendance', value: `${data.metrics.attendancePercentage}%`, icon: UsersRound },
    { label: 'Salary Expenses', value: currency(data.metrics.salaryExpenses), icon: IndianRupee },
    { label: 'Customers', value: String(data.metrics.totalCustomers), icon: UsersRound },
    { label: 'Active Quotations', value: String(data.metrics.activeQuotations), icon: ReceiptText },
  ]

  return (
    <>
      <section className="hero-row">
        <div>
          <p className="eyebrow">{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
          <h1>Business dashboard</h1>
          <p>Live operational metrics calculated from MongoDB.</p>
        </div>
      </section>

      <section className="metric-grid">
        {metrics.map((metric) => (
          <article className="metric-card blue" key={metric.label}>
            <div className="metric-head">
              <span className="metric-icon"><metric.icon size={18} /></span>
            </div>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel wide">
          <div className="panel-title">
            <div>
              <h2>Income vs expenses</h2>
              <span>Current month ledger movement.</span>
            </div>
          </div>
          {chartData.length ? (
            <div className="chart-tall">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => currency(Number(value))} />
                  <Area type="monotone" dataKey="income" stroke="#2563eb" fill="#dbeafe" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#fee2e2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No financial transactions recorded yet" />
          )}
        </article>

        <article className="panel">
          <div className="panel-title">
            <div>
              <h2>Recent transactions</h2>
              <span>Latest income and expense records.</span>
            </div>
          </div>
          {data.recentTransactions.length ? (
            <div className="transactions">
              {data.recentTransactions.map((transaction) => (
                <div className="transaction" key={transaction._id}>
                  <div>
                    <strong>{transaction.category}</strong>
                    <span>{transaction.description || transaction.mode}</span>
                  </div>
                  <b className={transaction.type}>{currency(transaction.amount)}</b>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No transactions yet" />
          )}
        </article>
      </section>
    </>
  )
}
