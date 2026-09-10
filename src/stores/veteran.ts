import { defineStore } from 'pinia'
import { fetchDashboardData } from '../repositories/dataRepository'
import type { ActionItem, Benefit, BenefitStatus, Veteran } from '../types'

interface VeteranState {
  veteran: Veteran | null
  benefits: Benefit[]
  actionItems: ActionItem[]
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  hasLoaded: boolean
}

function readSession(): boolean {
  return (
    typeof localStorage !== 'undefined' &&
    localStorage.getItem('service-compass-session') === 'active'
  )
}

function readStoredIds(key: string): string[] {
  if (typeof localStorage === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as string[]
  } catch {
    return []
  }
}

export const useVeteranStore = defineStore('veteran', {
  state: (): VeteranState => ({
    veteran: null,
    benefits: [],
    actionItems: [],
    isLoading: false,
    error: null,
    isAuthenticated: readSession(),
    hasLoaded: false,
  }),
  getters: {
    savedBenefits: (state) => state.benefits.filter((benefit) => benefit.saved),
    upcomingActions: (state) => state.actionItems.filter((item) => !item.completed),
    completionPercentage: (state) => {
      if (!state.actionItems.length) return 0
      const completed = state.actionItems.filter((item) => item.completed).length
      return Math.round((completed / state.actionItems.length) * 100)
    },
    statusCounts: (state): Record<BenefitStatus, number> =>
      state.benefits.reduce(
        (counts, benefit) => ({ ...counts, [benefit.status]: counts[benefit.status] + 1 }),
        { eligible: 0, applied: 0, approved: 0, 'action-needed': 0 },
      ),
  },
  actions: {
    signIn() {
      this.isAuthenticated = true
      localStorage.setItem('service-compass-session', 'active')
    },
    signOut() {
      this.isAuthenticated = false
      localStorage.removeItem('service-compass-session')
    },
    async loadData() {
      if (this.hasLoaded || this.isLoading) return
      this.isLoading = true
      this.error = null
      try {
        const data = await fetchDashboardData()
        this.veteran = data.veteran
        this.benefits = data.benefits
        this.actionItems = data.actionItems
        const savedIds = readStoredIds('service-compass-saved-benefits')
        const completedIds = readStoredIds('service-compass-completed-actions')
        if (savedIds.length)
          this.benefits.forEach((benefit) => {
            benefit.saved = savedIds.includes(benefit.id)
          })
        if (completedIds.length)
          this.actionItems.forEach((action) => {
            action.completed = completedIds.includes(action.id)
          })
        this.hasLoaded = true
      } catch {
        this.error = 'We could not load the demonstration data. Please try again.'
      } finally {
        this.isLoading = false
      }
    },
    toggleSaved(id: string) {
      const benefit = this.benefits.find((item) => item.id === id)
      if (benefit) benefit.saved = !benefit.saved
      localStorage.setItem(
        'service-compass-saved-benefits',
        JSON.stringify(this.benefits.filter((item) => item.saved).map((item) => item.id)),
      )
    },
    toggleAction(id: string) {
      const action = this.actionItems.find((item) => item.id === id)
      if (action) action.completed = !action.completed
      localStorage.setItem(
        'service-compass-completed-actions',
        JSON.stringify(this.actionItems.filter((item) => item.completed).map((item) => item.id)),
      )
    },
    updateProfile(profile: Veteran) {
      this.veteran = { ...profile }
    },
  },
})
