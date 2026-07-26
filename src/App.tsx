import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Download,
  Menu,
  Moon,
  MoreVertical,
  Plus,
  Printer,
  QrCode,
  Search,
  Send,
  Sun,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  apiModules,
  attendanceRows,
  expenseBreakdown,
  metrics,
  navItems,
  notifications,
  quotationItems,
  revenueData,
  transactions,
  workers,
} from './data/business'
import './App.css'

const statusTone = {
  Active: 'success',
  'On leave': 'warning',
  Inactive: 'danger',
} as const

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [query, setQuery] = useState('')

  const filteredWorkers = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    if (!normalized) return workers
    return workers.filter((worker) =>
      [worker.name, worker.role, worker.phone, worker.status].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    )
  }, [query])

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">W</div>
          <div>
            <strong>WoodWise</strong>
            <span>Furniture Solutions</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              className={activeNav === item.label ? 'nav-item active' : 'nav-item'}
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              type="button"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.badge ? <em>{item.badge}</em> : null}
            </button>
          ))}
        </nav>
        <div className="sidebar-card">
          <span>Your Business</span>
          <strong>Overview</strong>
          <div className="chair-shape" />
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <button className="icon-button mobile-only" type="button" aria-label="Open navigation">
            <Menu size={19} />
          </button>
          <div className="search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search employees, invoices, customers..."
            />
          </div>
          <button className="icon-button" type="button" aria-label="Notifications">
            <span className="dot" />
            <CalendarDays size={18} />
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Toggle theme"
            onClick={() => setDarkMode((value) => !value)}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="profile">
            <div className="avatar">VP</div>
            <div>
              <strong>Virendra Prasad</strong>
              <span>Admin</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </header>

        <section className="hero-row">
          <div>
            <p className="eyebrow">27 July, 2026</p>
            <h1>Good morning, Virendra</h1>
            <p>Here is what is happening across revenue, workshop teams, billing, and stock today.</p>
          </div>
          <div className="hero-actions">
            <button className="secondary-button" type="button">
              <Printer size={17} />
              Print
            </button>
            <button className="primary-button" type="button">
              <Plus size={17} />
              New Invoice
            </button>
          </div>
        </section>

        <section className="metric-grid">
          {metrics.map((metric) => (
            <article className={`metric-card ${metric.tone}`} key={metric.label}>
              <div className="metric-head">
                <span className="metric-icon">
                  <metric.icon size={18} />
                </span>
                <MoreVertical size={17} />
              </div>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <small className={metric.trend}>{metric.delta}</small>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel wide">
            <div className="panel-title">
              <div>
                <h2>Income vs Expenses</h2>
                <span>Monthly cashflow with workshop cost movement.</span>
              </div>
              <button className="text-button" type="button">
                View report <ArrowRight size={15} />
              </button>
            </div>
            <div className="chart-tall">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="income" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenses" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}K`} />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                  <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={3} fill="url(#income)" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fill="url(#expenses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel">
            <div className="panel-title">
              <div>
                <h2>Today's Attendance</h2>
                <span>26 workers tracked</span>
              </div>
              <button className="text-button" type="button">View all</button>
            </div>
            <div className="attendance-summary">
              <div className="donut-css">
                <strong>26</strong>
                <span>Total</span>
              </div>
              <div className="legend">
                <span><i className="present" />Present <b>20</b></span>
                <span><i className="absent" />Absent <b>4</b></span>
                <span><i className="leave" />Leave <b>2</b></span>
              </div>
            </div>
            <div className="notification-list">
              {notifications.map((item) => (
                <div className="mini-row" key={item.label}>
                  <item.icon size={17} />
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="panel employee-panel">
            <div className="panel-title">
              <div>
                <h2>Employees</h2>
                <span>{filteredWorkers.length} shown from 26 workers</span>
              </div>
              <button className="primary-button compact" type="button">
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Salary</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((worker) => (
                    <tr key={worker.id}>
                      <td>
                        <div className="person">
                          <span>{worker.initials}</span>
                          <div>
                            <strong>{worker.name}</strong>
                            <small>{worker.phone}</small>
                          </div>
                        </div>
                      </td>
                      <td>{worker.role}</td>
                      <td>{worker.salary}</td>
                      <td>
                        <div className="progress"><i style={{ width: `${worker.attendance}%` }} /></div>
                      </td>
                      <td><span className={`status ${statusTone[worker.status]}`}>{worker.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <QuotationPanel />
          <AttendancePanel />
          <SalaryPanel />
          <ReportsPanel />
          <MobilePreview />
          <ArchitecturePanel />
        </section>
      </main>
    </div>
  )
}

function QuotationPanel() {
  return (
    <article className="panel quotation-panel">
      <div className="panel-title">
        <div>
          <h2>Create Quotation</h2>
          <span>Customer, items, preview, invoice conversion.</span>
        </div>
        <button className="secondary-button compact" type="button">
          <Download size={16} /> PDF
        </button>
      </div>
      <div className="quotation-layout">
        <div className="quote-form">
          <label>
            Customer
            <select>
              <option>Raj Interior</option>
              <option>Home Decors</option>
              <option>Wood Craft</option>
            </select>
          </label>
          {quotationItems.map((item) => (
            <div className="quote-line" key={item.item}>
              <div>
                <strong>{item.item}</strong>
                <span>{item.detail}</span>
              </div>
              <small>{item.qty} x {item.unit}</small>
              <b>{item.total}</b>
            </div>
          ))}
          <button className="secondary-button" type="button">
            <Plus size={16} /> Add Item
          </button>
          <dl className="totals">
            <div><dt>Sub Total</dt><dd>₹1,87,000</dd></div>
            <div><dt>GST (18%)</dt><dd>₹33,660</dd></div>
            <div><dt>Discount</dt><dd>-₹10,000</dd></div>
            <div className="grand"><dt>Total Amount</dt><dd>₹2,10,660</dd></div>
          </dl>
        </div>
        <div className="invoice-preview">
          <div className="invoice-head">
            <div>
              <strong>WOODWISE</strong>
              <span>Furniture Solutions</span>
            </div>
            <div>
              <b>Quotation</b>
              <span>#QTN-1024</span>
            </div>
          </div>
          <div className="invoice-meta">
            <span>To: Raj Interior</span>
            <span>Date: 27 July, 2026</span>
            <span>Bangalore, Karnataka</span>
            <span>Valid: 26 Aug, 2026</span>
          </div>
          <div className="invoice-lines">
            {quotationItems.map((item) => (
              <div key={item.item}>
                <span>{item.item}</span>
                <b>{item.total}</b>
              </div>
            ))}
          </div>
          <div className="invoice-total">
            <QrCode size={36} />
            <strong>₹2,10,660</strong>
          </div>
        </div>
      </div>
    </article>
  )
}

function AttendancePanel() {
  return (
    <article className="panel">
      <div className="panel-title">
        <div>
          <h2>Attendance</h2>
          <span>July 2026 calendar report</span>
        </div>
        <button className="text-button" type="button">List</button>
      </div>
      <div className="calendar-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <b key={`${day}-${index}`}>{day}</b>)}
        {attendanceRows.flat().map((day, index) => (
          <span className={day === '27' ? 'selected' : index % 6 === 0 ? 'warn' : index % 5 === 0 ? 'leave' : ''} key={`${day}-${index}`}>
            {day}
          </span>
        ))}
      </div>
      <div className="legend horizontal">
        <span><i className="present" />Present</span>
        <span><i className="absent" />Absent</span>
        <span><i className="leave" />Leave</span>
        <span><i className="half" />Half Day</span>
      </div>
    </article>
  )
}

function SalaryPanel() {
  return (
    <article className="panel">
      <div className="panel-title">
        <div>
          <h2>Salary - July 2026</h2>
          <span>Auto calculated from attendance</span>
        </div>
        <button className="primary-button compact" type="button">Generate</button>
      </div>
      <div className="salary-cards">
        <span><small>Total Salary</small><b>₹4,52,000</b></span>
        <span><small>Paid</small><b>₹3,12,000</b></span>
        <span><small>Pending</small><b>₹1,40,000</b></span>
      </div>
      <div className="salary-list">
        {workers.slice(0, 4).map((worker, index) => (
          <div className="mini-row" key={worker.id}>
            <span className="small-avatar">{worker.initials}</span>
            <div>
              <strong>{worker.name}</strong>
              <small>{worker.role}</small>
            </div>
            <b>{index === 2 ? 'Pending' : 'Paid'}</b>
          </div>
        ))}
      </div>
    </article>
  )
}

function ReportsPanel() {
  return (
    <article className="panel">
      <div className="panel-title">
        <div>
          <h2>Reports</h2>
          <span>Revenue, expense and profit exports.</span>
        </div>
        <button className="secondary-button compact" type="button">
          <Send size={16} /> Export
        </button>
      </div>
      <div className="chart-mid">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
            <Bar dataKey="income" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="report-bottom">
        <div className="pie-box">
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={expenseBreakdown} dataKey="value" innerRadius={34} outerRadius={58} paddingAngle={4}>
                {expenseBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="legend">
          {expenseBreakdown.map((item) => (
            <span key={item.name}><i style={{ background: item.color }} />{item.name} <b>{item.value}%</b></span>
          ))}
        </div>
      </div>
    </article>
  )
}

function MobilePreview() {
  return (
    <article className="phone-frame">
      <div className="phone-screen">
        <div className="phone-top">
          <Menu size={17} />
          <strong>WoodWise</strong>
          <span className="small-avatar">VP</span>
        </div>
        <h3>Hi, Virendra</h3>
        <p>Business summary</p>
        <div className="mobile-revenue">
          <span>Total Revenue</span>
          <strong>₹12,45,000</strong>
          <div className="mini-bars">
            {revenueData.map((item) => <i key={item.month} style={{ height: `${item.income / 5000}px` }} />)}
          </div>
        </div>
        <div className="quick-grid">
          {['Attendance', 'Quotation', 'Invoice', 'Expense'].map((item) => <button key={item}>{item}</button>)}
        </div>
        <div className="phone-list">
          {transactions.slice(0, 3).map((item) => (
            <div key={item.title}>
              <span>{item.title}</span>
              <b className={item.tone}>{item.amount}</b>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function ArchitecturePanel() {
  return (
    <article className="panel architecture-panel">
      <div className="panel-title">
        <div>
          <h2>Full-stack Foundation</h2>
          <span>Ready modules for FastAPI, PostgreSQL, JWT, files, and exports.</span>
        </div>
      </div>
      <div className="module-grid">
        {apiModules.map((module) => <span key={module}>{module}</span>)}
      </div>
      <div className="transactions">
        {transactions.map((transaction) => (
          <div className="transaction" key={transaction.title}>
            <div>
              <strong>{transaction.title}</strong>
              <span>{transaction.meta}</span>
            </div>
            <b className={transaction.tone}>{transaction.amount}</b>
          </div>
        ))}
      </div>
    </article>
  )
}

export default App
