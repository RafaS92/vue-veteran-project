import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useVeteranStore } from '../stores/veteran'
import type { DashboardData } from '../types'

const data: DashboardData = {
  veteran: {
    id: 'v1',
    name: 'Jordan Brooks',
    email: 'j@example.com',
    phone: '',
    branch: 'Navy',
    servicePeriod: '2012–2020',
    dischargeStatus: 'Honorable',
    location: 'Austin',
    preferredContact: 'Email',
  },
  benefits: [
    {
      id: 'b1',
      title: 'Education',
      category: 'Education',
      summary: '',
      description: '',
      status: 'approved',
      progress: 100,
      nextStep: '',
      saved: false,
    },
    {
      id: 'b2',
      title: 'Health',
      category: 'Health',
      summary: '',
      description: '',
      status: 'eligible',
      progress: 0,
      nextStep: '',
      saved: true,
    },
  ],
  actionItems: [
    { id: 'a1', title: 'First', benefitId: 'b1', dueDate: '2026-09-10', completed: true },
    { id: 'a2', title: 'Second', benefitId: 'b2', dueDate: '2026-09-11', completed: false },
  ],
}

vi.mock('../repositories/dataRepository', () => ({
  fetchDashboardData: vi.fn(async () => structuredClone(data)),
}))

describe('veteran store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('loads fixture data and calculates summary getters', async () => {
    const store = useVeteranStore()
    await store.loadData()
    expect(store.veteran?.name).toBe('Jordan Brooks')
    expect(store.savedBenefits).toHaveLength(1)
    expect(store.completionPercentage).toBe(50)
    expect(store.statusCounts.approved).toBe(1)
  })

  it('updates saved benefits and actions', async () => {
    const store = useVeteranStore()
    await store.loadData()
    store.toggleSaved('b1')
    store.toggleAction('a2')
    expect(store.benefits[0]?.saved).toBe(true)
    expect(store.completionPercentage).toBe(100)
  })
})
