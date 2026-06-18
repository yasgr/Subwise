export type Category =
  | 'Entertainment'
  | 'Productivity'
  | 'Music'
  | 'News'
  | 'Fitness'
  | 'Food'
  | 'Finance'
  | 'Cloud'
  | 'Gaming'
  | 'Other'

export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'

export type SubStatus = 'active' | 'trial' | 'paused'

export interface Subscription {
  id: number
  name: string
  cat: Category
  price: number
  cycle: BillingCycle
  customDays?: number
  date: string
  status: SubStatus
  notes?: string
}

export type Theme = 'light' | 'dark' | 'system'

export interface Settings {
  currency: string
  window: number
  theme: Theme
}

export type ViewMode = 'monthly' | 'yearly'

export const CATEGORIES: Category[] = [
  'Entertainment', 'Productivity', 'Music', 'News',
  'Fitness', 'Food', 'Finance', 'Cloud', 'Gaming', 'Other',
]

export const BILLING_CYCLES: BillingCycle[] = ['weekly', 'monthly', 'quarterly', 'yearly', 'custom']

export const STATUSES: SubStatus[] = ['active', 'trial', 'paused']

export const CAT_COLORS: Record<Category, string> = {
  Entertainment: '#D85A30',
  Productivity: '#378ADD',
  Music: '#7F77DD',
  News: '#888780',
  Fitness: '#639922',
  Food: '#BA7517',
  Finance: '#1D9E75',
  Cloud: '#4F87C0',
  Gaming: '#D4537E',
  Other: '#B4B2A9',
}

export const CAT_TEXT: Record<Category, string> = {
  Entertainment: '#4A1B0C',
  Productivity: '#042C53',
  Music: '#26215C',
  News: '#2C2C2A',
  Fitness: '#173404',
  Food: '#412402',
  Finance: '#04342C',
  Cloud: '#0C447C',
  Gaming: '#4B1528',
  Other: '#444441',
}
