import {
  Activity,
  BadgeIndianRupee,
  Banknote,
  Bell,
  Boxes,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardList,
  ContactRound,
  FileText,
  Home,
  IndianRupee,
  PackageCheck,
  ReceiptText,
  Settings,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  icon: LucideIcon
  badge?: string
}

export type Metric = {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
  icon: LucideIcon
  tone: 'blue' | 'green' | 'amber' | 'violet' | 'rose' | 'slate'
}

export type Worker = {
  id: number
  name: string
  role: string
  phone: string
  salary: string
  status: 'Active' | 'On leave' | 'Inactive'
  attendance: number
  joined: string
  initials: string
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', icon: Home },
  { label: 'Employees', icon: UsersRound },
  { label: 'Attendance', icon: CalendarCheck },
  { label: 'Salary', icon: WalletCards },
  { label: 'Customers', icon: ContactRound },
  { label: 'Quotations', icon: ClipboardList, badge: '5' },
  { label: 'Invoices', icon: FileText },
  { label: 'Expenses', icon: ReceiptText },
  { label: 'Inventory', icon: Boxes, badge: '3' },
  { label: 'Projects', icon: BriefcaseBusiness },
  { label: 'Reports', icon: Activity },
  { label: 'Settings', icon: Settings },
]

export const metrics: Metric[] = [
  {
    label: 'Total Revenue',
    value: '₹12,45,000',
    delta: '+18.2% vs last month',
    trend: 'up',
    icon: IndianRupee,
    tone: 'blue',
  },
  {
    label: 'Monthly Profit',
    value: '₹2,85,400',
    delta: '+12.4% vs last month',
    trend: 'up',
    icon: TrendingUp,
    tone: 'green',
  },
  {
    label: 'Pending Payments',
    value: '₹1,20,000',
    delta: '-5.1% needs follow-up',
    trend: 'down',
    icon: BadgeIndianRupee,
    tone: 'amber',
  },
  {
    label: 'Total Workers',
    value: '26',
    delta: '+2 joined this month',
    trend: 'up',
    icon: UsersRound,
    tone: 'violet',
  },
  {
    label: 'Active Projects',
    value: '8',
    delta: '3 deliveries this week',
    trend: 'flat',
    icon: PackageCheck,
    tone: 'slate',
  },
  {
    label: 'Monthly Expenses',
    value: '₹1,80,000',
    delta: '+8.2% material cost',
    trend: 'down',
    icon: TrendingDown,
    tone: 'rose',
  },
]

export const revenueData = [
  { month: 'Jan', income: 145000, expenses: 72000 },
  { month: 'Feb', income: 220000, expenses: 132000 },
  { month: 'Mar', income: 190000, expenses: 108000 },
  { month: 'Apr', income: 295000, expenses: 178000 },
  { month: 'May', income: 264000, expenses: 145000 },
  { month: 'Jun', income: 342000, expenses: 228000 },
  { month: 'Jul', income: 320000, expenses: 180000 },
]

export const expenseBreakdown = [
  { name: 'Material', value: 60, color: '#2563eb' },
  { name: 'Salary', value: 20, color: '#06b6d4' },
  { name: 'Transport', value: 10, color: '#f59e0b' },
  { name: 'Others', value: 10, color: '#22c55e' },
]

export const workers: Worker[] = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    role: 'Carpenter',
    phone: '+91 98765 43210',
    salary: '₹18,000',
    status: 'Active',
    attendance: 96,
    joined: '12 Jan 2024',
    initials: 'RK',
  },
  {
    id: 2,
    name: 'Suresh Yadav',
    role: 'Painter',
    phone: '+91 87654 32109',
    salary: '₹16,000',
    status: 'Active',
    attendance: 91,
    joined: '04 Apr 2024',
    initials: 'SY',
  },
  {
    id: 3,
    name: 'Amit Sharma',
    role: 'Supervisor',
    phone: '+91 76543 21098',
    salary: '₹22,000',
    status: 'On leave',
    attendance: 84,
    joined: '18 Sep 2023',
    initials: 'AS',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Helper',
    phone: '+91 65432 10987',
    salary: '₹14,000',
    status: 'Active',
    attendance: 88,
    joined: '02 Feb 2025',
    initials: 'VS',
  },
  {
    id: 5,
    name: 'Manoj Gupta',
    role: 'Carpenter',
    phone: '+91 54321 09876',
    salary: '₹18,000',
    status: 'Inactive',
    attendance: 72,
    joined: '15 Aug 2023',
    initials: 'MG',
  },
]

export const transactions = [
  { title: 'Payment from Raj Interior', meta: 'Invoice INV-1023', amount: '+₹75,000', tone: 'income' },
  { title: 'Salary Paid - July', meta: 'Worker payroll', amount: '-₹1,25,000', tone: 'expense' },
  { title: 'Teak wood purchase', meta: 'Material expense', amount: '-₹48,600', tone: 'expense' },
  { title: 'Advance from Home Decors', meta: 'Quotation QTN-1025', amount: '+₹35,000', tone: 'income' },
]

export const notifications = [
  { label: 'Salary reminders', count: 4, icon: Bell },
  { label: 'Pending payments', count: 7, icon: Banknote },
  { label: 'Due quotations', count: 5, icon: ClipboardList },
  { label: 'Low inventory alerts', count: 3, icon: ShieldCheck },
]

export const attendanceRows = [
  ['1', '2', '3', '4', '5', '6', '7'],
  ['8', '9', '10', '11', '12', '13', '14'],
  ['15', '16', '17', '18', '19', '20', '21'],
  ['22', '23', '24', '25', '26', '27', '28'],
  ['29', '30', '31', '1', '2', '3', '4'],
]

export const quotationItems = [
  { item: 'Modular Kitchen Setup', detail: 'Size: 10x8 ft', qty: 1, unit: '₹85,000', total: '₹85,000' },
  { item: 'Wooden Wardrobe', detail: '6x7 ft', qty: 2, unit: '₹42,000', total: '₹84,000' },
  { item: 'Study Table', detail: '4x2.5 ft', qty: 1, unit: '₹18,000', total: '₹18,000' },
]

export const apiModules = [
  'JWT auth and role guards',
  'Employees, attendance, salary slips',
  'Customers, quotations, invoices',
  'Expenses, transactions, reports',
  'Inventory, suppliers, audit logs',
  'PDF, Excel, CSV exports',
]
