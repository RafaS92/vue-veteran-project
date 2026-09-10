<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    tone?: 'green' | 'gold'
    thick?: boolean
  }>(),
  {
    tone: 'green',
    thick: false,
  },
)

const normalizedValue = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div
    class="progress-track"
    :class="[`progress-track--${tone}`, { 'progress-track--thick': thick }]"
    role="progressbar"
    :aria-valuenow="normalizedValue"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <span :style="{ width: `${normalizedValue}%` }" />
  </div>
</template>

<style scoped>
.progress-track {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #e8ece9;
}

.progress-track--thick {
  height: 7px;
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--green);
}

.progress-track--gold {
  background: #e5ebe7;
}

.progress-track--gold span {
  background: var(--gold);
}
</style>
