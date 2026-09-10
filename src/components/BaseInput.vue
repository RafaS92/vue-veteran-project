<script setup lang="ts">
const model = defineModel<string>({ required: true })
withDefaults(
  defineProps<{
    label: string
    id: string
    type?: string
    placeholder?: string
    required?: boolean
  }>(),
  { type: 'text' },
)
</script>
<template>
  <label class="field" :for="id"
    ><span>{{ label }} <em v-if="required">required</em></span
    ><input :id="id" v-model="model" :type="type" :placeholder="placeholder" :required="required"
  /></label>
</template>
<style scoped>
.field {
  display: grid;
  gap: 0.45rem;
  color: var(--ink);
  font-size: 0.85rem;
  font-weight: 700;
}
.field em {
  margin-left: 0.25rem;
  color: var(--muted);
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 500;
}
input {
  width: 100%;
  min-height: 46px;
  padding: 0.7rem 0.8rem;
  border: 1px solid #cfd8d3;
  border-radius: 9px;
  background: white;
  color: var(--ink);
}
input::placeholder {
  color: #91a099;
}
</style>
