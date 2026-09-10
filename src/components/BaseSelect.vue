<script setup lang="ts">
const model = defineModel<string>({ required: true })
defineProps<{ label: string; id: string; options: string[] }>()
</script>
<template><label class="field" :for="id"><span>{{ label }}</span><select :id="id" v-model="model"><option v-for="option in options" :key="option" :value="option">{{ option }}</option></select></label></template>
<style scoped>
.field { display: grid; gap: .45rem; color: var(--ink); font-size: .85rem; font-weight: 700; }
select { min-height: 46px; padding: .7rem 2rem .7rem .8rem; border: 1px solid #cfd8d3; border-radius: 9px; background: white; color: var(--ink); }
</style>
