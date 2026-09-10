import { computed, ref, type Ref } from 'vue'
import type { Benefit, BenefitCategory, BenefitStatus } from '../types'

export function useBenefits(benefits: Ref<Benefit[]>) {
  const search = ref('')
  const category = ref<'All' | BenefitCategory>('All')
  const status = ref<'All' | BenefitStatus>('All')
  const categories = computed(() => [
    'All',
    ...new Set(benefits.value.map((item) => item.category)),
  ])
  const filteredBenefits = computed(() => {
    const term = search.value.trim().toLowerCase()
    return benefits.value.filter((benefit) => {
      const matchesSearch =
        !term || `${benefit.title} ${benefit.summary}`.toLowerCase().includes(term)
      const matchesCategory = category.value === 'All' || benefit.category === category.value
      const matchesStatus = status.value === 'All' || benefit.status === status.value
      return matchesSearch && matchesCategory && matchesStatus
    })
  })
  function clearFilters() {
    search.value = ''
    category.value = 'All'
    status.value = 'All'
  }
  return { search, category, status, categories, filteredBenefits, clearFilters }
}
