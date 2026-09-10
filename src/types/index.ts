export type BenefitStatus = 'eligible' | 'applied' | 'approved' | 'action-needed'
export type BenefitCategory = 'Health' | 'Education' | 'Housing' | 'Career' | 'Family'

export interface Veteran {
  id: string
  name: string
  email: string
  phone: string
  branch: string
  servicePeriod: string
  dischargeStatus: string
  location: string
  preferredContact: 'Email' | 'Phone' | 'Text'
}

export interface Benefit {
  id: string
  title: string
  category: BenefitCategory
  summary: string
  description: string
  status: BenefitStatus
  progress: number
  nextStep: string
  deadline?: string
  saved: boolean
}

export interface ActionItem {
  id: string
  title: string
  benefitId: string
  dueDate: string
  completed: boolean
}

export interface DashboardData {
  veteran: Veteran
  benefits: Benefit[]
  actionItems: ActionItem[]
}
