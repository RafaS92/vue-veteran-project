<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BaseInput from '../components/BaseInput.vue'
import BaseModal from '../components/BaseModal.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BenefitCard from '../components/BenefitCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { useBenefits } from '../composables/useBenefits'
import { useNotifications } from '../composables/useNotifications'
import { useVeteranStore } from '../stores/veteran'

const store = useVeteranStore()
const { benefits, isLoading } = storeToRefs(store)
const { search, category, status, categories, filteredBenefits, clearFilters } =
  useBenefits(benefits)
const { notify } = useNotifications()
const statusOptions = ['All', 'eligible', 'applied', 'approved', 'action-needed']
const hasRestoredPreferences = ref(false)
const isAboutOpen = ref(false)

onMounted(async () => {
  await store.loadData()
  const saved = localStorage.getItem('service-compass-benefit-filters')
  if (saved) {
    const filters = JSON.parse(saved)
    category.value = filters.category ?? 'All'
    status.value = filters.status ?? 'All'
  }
  hasRestoredPreferences.value = true
})

watch([category, status], ([nextCategory, nextStatus]) => {
  if (hasRestoredPreferences.value)
    localStorage.setItem(
      'service-compass-benefit-filters',
      JSON.stringify({ category: nextCategory, status: nextStatus }),
    )
})

function saveBenefit(id: string) {
  store.toggleSaved(id)
  const benefit = benefits.value.find((item) => item.id === id)
  notify(
    benefit?.saved ? 'Benefit saved to your dashboard' : 'Benefit removed from saved items',
    'info',
  )
}
</script>
<template>
  <div>
    <div class="page-heading">
      <div>
        <span class="eyebrow">Resource library</span>
        <h1>Explore benefits</h1>
        <p>
          Browse fictional programs, review application progress, and save the resources you want to
          revisit.
        </p>
      </div>
      <div class="heading-actions">
        <span class="result-count">{{ filteredBenefits.length }} results</span
        ><button class="text-button" type="button" @click="isAboutOpen = true">
          About this data
        </button>
      </div>
    </div>
    <section class="filters" aria-label="Benefit filters">
      <BaseInput
        id="search"
        v-model="search"
        label="Search benefits"
        placeholder="Try education or housing"
      />
      <BaseSelect id="category" v-model="category" label="Category" :options="categories" />
      <BaseSelect id="status" v-model="status" label="Status" :options="statusOptions" />
    </section>
    <BaseModal :open="isAboutOpen" @close="isAboutOpen = false">
      <template #header
        ><div>
          <span class="eyebrow">Demonstration content</span>
          <h2 id="modal-title">About this benefit data</h2>
        </div></template
      >
      <p>
        Every benefit, application status, deadline, and person in Service Compass is fictional. The
        content exists only to demonstrate Vue application patterns and should not be used for real
        eligibility decisions.
      </p>
    </BaseModal>
    <div v-if="isLoading" class="loading-state"><div class="spinner" /></div>
    <section v-else class="benefits-grid">
      <BenefitCard
        v-for="benefit in filteredBenefits"
        :key="benefit.id"
        :benefit="benefit"
        @save="saveBenefit"
      />
      <EmptyState v-if="filteredBenefits.length === 0"
        ><template #title>No benefits match</template>Adjust the search or filters to see more
        demonstration benefits.<template #action
          ><button class="button button-secondary" type="button" @click="clearFilters">
            Clear filters
          </button></template
        ></EmptyState
      >
    </section>
  </div>
</template>
<style scoped>
.result-count {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 700;
}
.heading-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1.5rem;
  padding: 1.1rem;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: white;
}
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}
.empty-state .button {
  margin-top: 1rem;
}
@media (max-width: 1050px) {
  .benefits-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 680px) {
  .filters,
  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>
