import { useState } from 'react'
import {
  Activity,
  Boxes,
  CalendarCheck,
  ContactRound,
  FileText,
  Home,
  LogOut,
  Menu,
  Moon,
  ReceiptText,
  Search,
  Sun,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import { clearToken, getToken } from './api/client'
import { ToastStack, type ToastMessage } from './components/Toast'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { ResourcePage, type ResourceConfig } from './pages/ResourcePage'
import type { User } from './types/api'
import './App.css'

const navigation = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'employees', label: 'Employees', icon: UsersRound },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { key: 'salary-runs', label: 'Salary', icon: WalletCards },
  { key: 'customers', label: 'Customers', icon: ContactRound },
  { key: 'quotations', label: 'Quotations', icon: ReceiptText },
  { key: 'invoices', label: 'Invoices', icon: FileText },
  { key: 'transactions', label: 'Transactions', icon: Activity },
  { key: 'inventory', label: 'Inventory', icon: Boxes },
] as const

const resourceConfigs: Record<string, ResourceConfig> = {
  employees: {
    title: 'Employees',
    description: 'Worker profiles, joining details, salary basis and status.',
    endpoint: '/employees',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'position', label: 'Position' },
      { key: 'phone', label: 'Phone' },
      { key: 'monthlySalary', label: 'Monthly Salary', render: moneyCell },
      { key: 'status', label: 'Status' },
    ],
  },
  attendance: {
    title: 'Attendance',
    description: 'Daily attendance records used for salary calculation.',
    endpoint: '/attendance',
    columns: [
      { key: 'date', label: 'Date', render: dateCell },
      { key: 'status', label: 'Status' },
      { key: 'note', label: 'Note' },
    ],
  },
  'salary-runs': {
    title: 'Salary',
    description: 'Monthly salary generation runs and payment status.',
    endpoint: '/salary-runs',
    columns: [
      { key: 'year', label: 'Year' },
      { key: 'month', label: 'Month' },
      { key: 'totalNet', label: 'Net Pay', render: moneyCell },
      { key: 'status', label: 'Status' },
    ],
  },
  customers: {
    title: 'Customers',
    description: 'Customer contact records and billing identity.',
    endpoint: '/customers',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'gstNumber', label: 'GST' },
    ],
  },
  quotations: {
    title: 'Quotations',
    description: 'Customer estimates with GST, discounts and PDF output.',
    endpoint: '/quotations',
    columns: [
      { key: 'quotationNumber', label: 'Quotation' },
      { key: 'status', label: 'Status' },
      { key: 'total', label: 'Total', render: moneyCell },
      { key: 'validUntil', label: 'Valid Until', render: dateCell },
    ],
  },
  invoices: {
    title: 'Invoices',
    description: 'Billing records, payment status and generated PDFs.',
    endpoint: '/invoices',
    columns: [
      { key: 'invoiceNumber', label: 'Invoice' },
      { key: 'status', label: 'Status' },
      { key: 'total', label: 'Total', render: moneyCell },
      { key: 'paidAmount', label: 'Paid', render: moneyCell },
      { key: 'dueDate', label: 'Due Date', render: dateCell },
    ],
  },
  transactions: {
    title: 'Transactions',
    description: 'Income, expenses, cash, bank and payment history.',
    endpoint: '/transactions',
    columns: [
      { key: 'occurredAt', label: 'Date', render: dateCell },
      { key: 'type', label: 'Type' },
      { key: 'category', label: 'Category' },
      { key: 'mode', label: 'Mode' },
      { key: 'amount', label: 'Amount', render: moneyCell },
    ],
  },
  inventory: {
    title: 'Inventory',
    description: 'Wood, hardware, materials and reorder levels.',
    endpoint: '/inventory',
    columns: [
      { key: 'sku', label: 'SKU' },
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'reorderLevel', label: 'Reorder Level' },
    ],
  },
}

function moneyCell(item: Record<string, unknown>, key?: string) {
  const value = Number(item[key || 'monthlySalary'] || 0)
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

function dateCell(item: Record<string, unknown>, key?: string) {
  const value = item[key || 'date']
  return value ? new Date(String(value)).toLocaleDateString('en-IN') : ''
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [user, setUser] = useState<User | null>(() => (getToken() ? { id: '', name: 'Account', email: '', role: 'admin' } : null))
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  function notify(message: string, tone: ToastMessage['tone'] = 'success') {
    const toast = { id: Date.now(), message, tone }
    setToasts((current) => [...current, toast])
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== toast.id)), 4000)
  }

  function logout() {
    clearToken()
    setUser(null)
    notify('Signed out')
  }

  if (!user) {
    return (
      <>
        <AuthPage onAuth={(nextUser) => { setUser(nextUser); notify('Signed in') }} />
        <ToastStack toasts={toasts} dismiss={(id) => setToasts((current) => current.filter((item) => item.id !== id))} />
      </>
    )
  }

  const activeConfig = resourceConfigs[activeNav]

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">W</div>
          <div>
            <strong>WoodWise</strong>
            <span>Business Management</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          {navigation.map((item) => (
            <button
              className={activeNav === item.key ? 'nav-item active' : 'nav-item'}
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              type="button"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <button className="icon-button mobile-only" type="button" aria-label="Open navigation">
            <Menu size={19} />
          </button>
          <div className="search app-search">
            <Search size={18} />
            <input aria-label="Global search" placeholder="Search inside the selected module" readOnly />
          </div>
          <button className="icon-button" type="button" aria-label="Toggle theme" onClick={() => setDarkMode((value) => !value)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="profile">
            <div className="avatar">{user.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          </div>
          <button className="icon-button" type="button" aria-label="Sign out" onClick={logout}>
            <LogOut size={18} />
          </button>
        </header>

        {activeNav === 'dashboard' ? <DashboardPage /> : <ResourcePage config={activeConfig} />}
      </main>
      <ToastStack toasts={toasts} dismiss={(id) => setToasts((current) => current.filter((item) => item.id !== id))} />
    </div>
  )
}

export default App
