<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LoadingState from '../components/LoadingState.vue'
import PageHeader from '../components/PageHeader.vue'
import { useNotifications } from '../composables/useNotifications'
import { useVeteranStore } from '../stores/veteran'
const BenefitDetailsPanel = defineAsyncComponent(
  () => import('../components/BenefitDetailsPanel.vue'),
)
const route = useRoute()
const store = useVeteranStore()
const { notify } = useNotifications()
const benefit = computed(() => store.benefits.find((item) => item.id === route.params.id))
onMounted(() => store.loadData())
function toggleSaved() {
  if (benefit.value) {
    store.toggleSaved(benefit.value.id)
    notify(benefit.value.saved ? 'Benefit saved' : 'Benefit removed', 'info')
  }
}
</script>
<template>
  <div v-if="benefit">
    <RouterLink class="back-link" to="/benefits">← Back to benefits</RouterLink>
    <PageHeader eyebrow="Fictional benefit" :title="benefit.title" :description="benefit.summary">
      <template #actions>
        <button class="button button-secondary" type="button" @click="toggleSaved">
          {{ benefit.saved ? 'Remove saved benefit' : 'Save benefit' }}
        </button>
      </template>
    </PageHeader>
    <Suspense
      ><BenefitDetailsPanel :benefit="benefit" /><template #fallback><LoadingState /></template
    ></Suspense>
    <p class="legal-note">
      <strong>Educational notice:</strong> This content is fictional and does not determine
      eligibility or replace official guidance.
    </p>
  </div>
</template>
<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 1.4rem;
  color: var(--green);
  font-size: 0.85rem;
  font-weight: 800;
  text-decoration: none;
}
.legal-note {
  margin-top: 1.25rem;
  padding: 1rem;
  border-left: 3px solid var(--gold);
  color: var(--muted);
  background: #fffaf0;
  font-size: 0.82rem;
  line-height: 1.55;
}
</style>
