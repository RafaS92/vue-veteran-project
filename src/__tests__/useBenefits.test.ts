import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useBenefits } from '../composables/useBenefits'
import type { Benefit } from '../types'

const benefits: Benefit[] = [
  {
    id: 'one',
    title: 'Education Support',
    category: 'Education',
    summary: 'Training help',
    description: '',
    status: 'applied',
    progress: 50,
    nextStep: '',
    saved: false,
  },
  {
    id: 'two',
    title: 'Health Enrollment',
    category: 'Health',
    summary: 'Care access',
    description: '',
    status: 'approved',
    progress: 100,
    nextStep: '',
    saved: true,
  },
]

describe('useBenefits', () => {
  it('filters by search, category, and status', () => {
    const result = useBenefits(ref(benefits))
    result.search.value = 'training'
    expect(result.filteredBenefits.value.map((item) => item.id)).toEqual(['one'])
    result.search.value = ''
    result.category.value = 'Health'
    result.status.value = 'approved'
    expect(result.filteredBenefits.value.map((item) => item.id)).toEqual(['two'])
  })

  it('clears all filters', () => {
    const result = useBenefits(ref(benefits))
    result.search.value = 'health'
    result.category.value = 'Health'
    result.clearFilters()
    expect(result.filteredBenefits.value).toHaveLength(2)
  })
})
