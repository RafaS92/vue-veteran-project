<script setup lang="ts">
import { computed } from 'vue'
import type { ActionItem } from '../types'
const props = defineProps<{ item: ActionItem }>()
defineEmits<{ toggle: [id: string] }>()
const formattedDate = computed(() =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(`${props.item.dueDate}T12:00:00`),
  ),
)
</script>
<template>
  <label class="action" :class="{ completed: item.completed }"
    ><input type="checkbox" :checked="item.completed" @change="$emit('toggle', item.id)" /><span
      ><strong>{{ item.title }}</strong
      ><small>Due {{ formattedDate }}</small></span
    ></label
  >
</template>
<style scoped>
.action {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
}
.action:last-child {
  border-bottom: 0;
}
.action input {
  width: 19px;
  height: 19px;
  accent-color: var(--green);
}
.action span {
  display: grid;
  gap: 0.2rem;
}
.action strong {
  color: var(--ink);
  font-size: 0.88rem;
}
.action small {
  color: var(--muted);
}
.completed strong {
  color: var(--muted);
  text-decoration: line-through;
}
</style>
