import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DashboardView from '../views/DashboardView.vue'
import { useVeteranStore } from '../stores/veteran'

vi.mock('../composables/useNotifications', () => ({
  useNotifications: () => ({ notify: vi.fn() }),
}))

describe('DashboardView', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('shows the loading state', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useVeteranStore()
    store.isLoading = true
    store.hasLoaded = true
    const wrapper = mount(DashboardView, {
      global: { plugins: [pinia], stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    expect(wrapper.text()).toContain('Preparing your dashboard')
  })

  it('renders a populated dashboard', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useVeteranStore()
    store.hasLoaded = true
    store.veteran = {
      id: 'v1',
      name: 'Jordan Brooks',
      email: 'j@example.com',
      phone: '',
      branch: 'U.S. Navy',
      servicePeriod: '2012–2020',
      dischargeStatus: 'Honorable',
      location: 'Austin',
      preferredContact: 'Email',
    }
    store.benefits = [
      {
        id: 'b1',
        title: 'Education Support',
        category: 'Education',
        summary: '',
        description: '',
        status: 'applied',
        progress: 50,
        nextStep: 'Upload form',
        saved: true,
      },
    ]
    store.actionItems = [
      { id: 'a1', title: 'Upload form', benefitId: 'b1', dueDate: '2026-09-20', completed: false },
    ]
    const wrapper = mount(DashboardView, {
      global: { plugins: [pinia], stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    expect(wrapper.text()).toContain('Good morning, Jordan')
    expect(wrapper.text()).toContain('Education Support')
  })
})
