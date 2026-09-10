<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <div class="loading-state" role="status" aria-live="polite">
    <div>
      <div class="spinner" aria-hidden="true" />
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.loading-state {
  min-height: 300px;
  display: grid;
  place-items: center;
  color: var(--muted);
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  margin: 0 auto 0.7rem;
  border: 3px solid var(--green-soft);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
