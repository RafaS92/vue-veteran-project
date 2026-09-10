<script setup lang="ts">defineProps<{ elevated?: boolean }>()</script>
<template>
  <section class="card" :class="{ elevated }">
    <header v-if="$slots.header || $slots.actions" class="card-header">
      <div><slot name="header" /></div><div><slot name="actions" /></div>
    </header>
    <slot />
  </section>
</template>
<style scoped>
.card { padding: 1.4rem; border: 1px solid var(--line); border-radius: 16px; background: var(--paper); }
.elevated { box-shadow: var(--shadow); }
.card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.1rem; }
.card-header :deep(h2), .card-header :deep(h3), .card-header :deep(p) { margin-bottom: 0; }
</style>
