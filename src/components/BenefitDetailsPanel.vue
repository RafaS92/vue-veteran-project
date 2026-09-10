<script setup lang="ts">
import type { Benefit } from '../types'
import BaseCard from './BaseCard.vue'
import StatusBadge from './StatusBadge.vue'
defineProps<{ benefit: Benefit }>()
</script>
<template>
  <BaseCard elevated>
    <template #header
      ><div>
        <span class="eyebrow">{{ benefit.category }}</span>
        <h2>Benefit overview</h2>
      </div></template
    >
    <template #actions><StatusBadge :status="benefit.status" /></template>
    <p class="description">{{ benefit.description }}</p>
    <dl>
      <div>
        <dt>Current progress</dt>
        <dd>{{ benefit.progress }}%</dd>
      </div>
      <div>
        <dt>Next recommended step</dt>
        <dd>{{ benefit.nextStep }}</dd>
      </div>
      <div v-if="benefit.deadline">
        <dt>Demonstration deadline</dt>
        <dd>{{ benefit.deadline }}</dd>
      </div>
    </dl>
  </BaseCard>
</template>
<style scoped>
.description {
  color: var(--muted);
  line-height: 1.7;
}
dl {
  display: grid;
  gap: 0.9rem;
  margin: 1.5rem 0 0;
}
dl div {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 1rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--line);
}
dt {
  color: var(--muted);
  font-size: 0.82rem;
}
dd {
  margin: 0;
  color: var(--ink);
  font-weight: 700;
}
@media (max-width: 520px) {
  dl div {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style>
