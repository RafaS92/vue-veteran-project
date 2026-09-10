<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description?: string
}>()
</script>

<template>
  <header class="page-heading">
    <div>
      <span class="eyebrow">{{ eyebrow }}</span>
      <h1>{{ title }}</h1>
      <slot name="description">
        <p v-if="description">{{ description }}</p>
      </slot>
    </div>
    <slot name="actions" />
  </header>
</template>

<style scoped>
.page-heading {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.page-heading p {
  max-width: 640px;
  margin-bottom: 0;
  color: var(--muted);
  line-height: 1.65;
}

@media (max-width: 620px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
