<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Benefit } from '../types'
import BaseCard from './BaseCard.vue'
import ProgressBar from './ProgressBar.vue'
import StatusBadge from './StatusBadge.vue'
defineProps<{ benefit: Benefit }>()
defineEmits<{ save: [id: string] }>()
</script>
<template>
  <BaseCard class="benefit-card">
    <template #header
      ><span class="eyebrow">{{ benefit.category }}</span>
      <h2>{{ benefit.title }}</h2></template
    >
    <template #actions><StatusBadge :status="benefit.status" /></template>
    <p>{{ benefit.summary }}</p>
    <div class="progress-row">
      <span>Application progress</span><strong>{{ benefit.progress }}%</strong>
    </div>
    <ProgressBar :value="benefit.progress" aria-label="Application progress" />
    <footer>
      <RouterLink class="details-link" :to="`/benefits/${benefit.id}`">View details</RouterLink>
      <button
        type="button"
        class="save-button"
        :aria-pressed="benefit.saved"
        @click="$emit('save', benefit.id)"
      >
        {{ benefit.saved ? 'Saved' : 'Save' }}
      </button>
    </footer>
  </BaseCard>
</template>
<style scoped>
.benefit-card {
  display: flex;
  flex-direction: column;
  min-height: 285px;
}
h2 {
  margin: 0.2rem 0 0;
  font-size: 1.05rem;
}
p {
  color: var(--muted);
  line-height: 1.55;
}
.progress-row {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1.4rem;
  font-size: 0.78rem;
  color: var(--muted);
}
.progress-row strong {
  color: var(--ink);
}
.benefit-card :deep(.progress-track) {
  margin-top: 0.5rem;
}
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
}
.details-link {
  color: var(--green);
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: none;
}
.save-button {
  border: 0;
  background: none;
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
.save-button[aria-pressed='true'] {
  color: var(--green);
}
</style>
