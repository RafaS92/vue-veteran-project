# Service Compass

A small, frontend-only Veteran Benefits Dashboard built as a focused Vue 3 learning project. Every person, benefit, application status, and deadline is fictional.

## Run locally

```bash
npm install
npm run dev
```

Use the prefilled demonstration account on the sign-in screen. No real authentication or personal data is involved.

## Checks

```bash
npm test
npm run build
```

## Vue concepts demonstrated

- Single File Components with `<template>`, `<script setup lang="ts">`, and scoped styles
- Composition API using `ref`, `reactive`, `computed`, `watch`, `watchEffect`, and `onMounted`
- Typed props, emits, custom `v-model`, slots, and Vue directives
- Reusable `useBenefits` and `useProfileForm` composables
- Pinia state, getters, and actions
- Vue Router, global and per-route guards, and lazy-loaded views
- Forms, `provide`/`inject` notifications, and an async component with `Suspense`
- Vitest and Vue Test Utils coverage for composables, stores, components, views, and route guards

## Project structure

- `src/data`: fictional JSON fixtures
- `src/repositories`: simulated asynchronous data access
- `src/stores`: shared Pinia state
- `src/composables`: reusable Composition API logic
- `src/components`: reusable interface components
- `src/views`: lazy-loaded route views
- `src/__tests__`: focused learning-oriented test suite

This application is educational and is not affiliated with or endorsed by any government agency.

# vue-veteran-project
