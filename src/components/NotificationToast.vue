<script setup lang="ts">
import type { Notification } from '../composables/useNotifications'
defineProps<{ notification: Notification }>()
</script>
<template>
  <div class="toast" :class="notification.tone" role="status">{{ notification.message }}</div>
</template>
<style scoped>
.toast {
  position: fixed;
  z-index: 30;
  right: 1.5rem;
  bottom: 1.5rem;
  max-width: 360px;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  color: white;
  background: var(--ink);
  box-shadow: var(--shadow);
  font-weight: 700;
}
.info {
  background: #475582;
}
@media (max-width: 850px) {
  .toast {
    bottom: 5rem;
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
</style>
