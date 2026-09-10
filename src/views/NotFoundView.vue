<template>
  <main class="not-found">
    <span class="eyebrow">404</span>
    <h1>This page is off course.</h1>
    <p>The demonstration page you requested could not be found.</p>
    <RouterLink class="button" to="/dashboard">Return to dashboard</RouterLink>
  </main>
</template>
<style scoped>
.not-found {
  min-height: 100vh;
  padding: 2rem;
  display: grid;
  place-content: center;
  justify-items: start;
  background: var(--cream);
}
.not-found p {
  color: var(--muted);
}
.not-found .button {
  margin-top: 1rem;
}
</style>
