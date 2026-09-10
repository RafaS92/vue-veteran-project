<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Benefit } from '../types'
import BaseCard from './BaseCard.vue'
import StatusBadge from './StatusBadge.vue'
defineProps<{ benefit: Benefit }>()
defineEmits<{ save: [id: string] }>()
</script>
<template>
  <BaseCard class="benefit-card">
    <template #header><span class="eyebrow">{{ benefit.category }}</span><h2>{{ benefit.title }}</h2></template>
    <template #actions><StatusBadge :status="benefit.status" /></template>
    <p>{{ benefit.summary }}</p>
    <div class="progress-row"><span>Application progress</span><strong>{{ benefit.progress }}%</strong></div>
    <div class="progress-track" aria-hidden="true"><span :style="{ width: `${benefit.progress}%` }" /></div>
    <footer>
      <RouterLink class="details-link" :to="`/benefits/${benefit.id}`">View details</RouterLink>
      <button type="button" class="save-button" :aria-pressed="benefit.saved" @click="$emit('save', benefit.id)">{{ benefit.saved ? 'Saved' : 'Save' }}</button>
    </footer>
  </BaseCard>
</template>
<style scoped>
.benefit-card { display: flex; flex-direction: column; min-height: 285px; } h2 { margin: .2rem 0 0; font-size: 1.05rem; } p { color: var(--muted); line-height: 1.55; }
.progress-row { display: flex; justify-content: space-between; margin-top: auto; padding-top: 1.4rem; font-size: .78rem; color: var(--muted); }.progress-row strong { color: var(--ink); }
.progress-track { height: 6px; margin-top: .5rem; border-radius: 999px; overflow: hidden; background: #e8ece9; }.progress-track span { display: block; height: 100%; border-radius: inherit; background: var(--green); }
footer { display: flex; align-items: center; justify-content: space-between; margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid var(--line); }.details-link { color: var(--green); font-size: .82rem; font-weight: 800; text-decoration: none; }
.save-button { border: 0; background: none; color: var(--muted); font-size: .8rem; font-weight: 700; cursor: pointer; }.save-button[aria-pressed='true'] { color: var(--green); }
</style>
