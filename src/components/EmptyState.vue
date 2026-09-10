<template><div class="empty-state"><div class="empty-mark" aria-hidden="true">?</div><h2><slot name="title">Nothing here yet</slot></h2><p><slot>Try changing your filters.</slot></p><slot name="action" /></div></template>
<style scoped>
.empty-state { grid-column: 1 / -1; padding: 3rem 1.5rem; border: 1px dashed #bdcbc5; border-radius: 16px; text-align: center; background: rgba(255,255,255,.55); }.empty-mark { width: 42px; height: 42px; margin: 0 auto 1rem; border-radius: 50%; display: grid; place-items: center; background: var(--green-soft); color: var(--green); font-weight: 800; } h2 { margin-bottom: .4rem; } p { color: var(--muted); }
</style>
