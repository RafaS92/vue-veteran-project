<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()
</script>
<template>
  <Teleport to="body">
    <div v-if="open" class="backdrop" role="presentation" @click.self="$emit('close')" @keydown.esc="$emit('close')">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header><div><slot name="header" /></div><button type="button" aria-label="Close dialog" @click="$emit('close')">×</button></header>
        <div class="content"><slot /></div>
        <footer><slot name="actions"><button class="button" type="button" @click="$emit('close')">Got it</button></slot></footer>
      </section>
    </div>
  </Teleport>
</template>
<style scoped>
.backdrop { position: fixed; z-index: 50; inset: 0; padding: 1rem; display: grid; place-items: center; background: rgba(12,32,28,.62); }.modal { width: min(520px,100%); padding: 1.4rem; border-radius: 16px; background: white; box-shadow: 0 24px 80px rgba(0,0,0,.2); }.modal header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }.modal header button { width: 36px; height: 36px; border: 0; border-radius: 50%; background: var(--green-soft); color: var(--ink); font-size: 1.35rem; cursor: pointer; }.content { color: var(--muted); line-height: 1.65; }.modal footer { display: flex; justify-content: flex-end; margin-top: 1.25rem; }
</style>
