<script setup lang="ts">
import { computed } from 'vue'
import type { BenefitStatus } from '../types'
const props = defineProps<{ status: BenefitStatus }>()
const label = computed(
  () =>
    ({
      eligible: 'Eligible',
      applied: 'In review',
      approved: 'Approved',
      'action-needed': 'Action needed',
    })[props.status],
)
</script>
<template>
  <span class="badge" :class="`badge-${status}`">{{ label }}</span>
</template>
<style scoped>
.badge {
  display: inline-flex;
  padding: 0.32rem 0.58rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
}
.badge-eligible {
  background: #edf0f8;
  color: #475582;
}
.badge-applied {
  background: #fff1d7;
  color: #825b1f;
}
.badge-approved {
  background: var(--green-soft);
  color: var(--green);
}
.badge-action-needed {
  background: #f9e4e2;
  color: #934036;
}
</style>
