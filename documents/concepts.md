# Vue Concepts Used in This Project

## Introduction

This document explains the main Vue concepts used by Service Compass and points to the files where each concept appears. It is intended as a guide for reading the current codebase rather than as a general reference for every Vue feature.

## 1. Vue Application Instance

A Vue application begins with `createApp`. The application instance connects the root Vue component to an element in the HTML page.

**Location:** `src/main.ts`

```ts
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

The code creates an application whose root component is `App.vue`, installs Pinia and Vue Router, and mounts the result in the `<div id="app">` element from `index.html`.

## 2. Single-File Components

Vue Single-File Components use the `.vue` extension and keep a component's logic, template, and scoped styles together.

**Locations:** `src/App.vue`, `src/views/*.vue`, and `src/components/*.vue`

A component can contain:

- `<script setup lang="ts">` for TypeScript logic;
- `<template>` for rendered HTML; and
- `<style scoped>` for styles limited to that component.

For example, `src/components/BenefitCard.vue` declares its props and events in its script, renders a benefit card in its template, and defines the card's local presentation in its scoped style block.

## 3. Composition API and `<script setup>`

The project uses Vue's Composition API rather than the Options API. Composition API features are imported as functions such as `ref`, `reactive`, `computed`, `onMounted`, and `watch`.

The `<script setup>` syntax makes top-level imports, variables, and functions directly available to the component template. No explicit `setup()` method or return object is required.

**Locations:** all Vue components that contain logic, especially:

- `src/App.vue`
- `src/views/DashboardView.vue`
- `src/views/BenefitsView.vue`
- `src/views/ProfileView.vue`
- `src/views/BenefitDetailView.vue`

## 4. Reactive Primitive State with `ref`

`ref` creates reactive state for a single value. In TypeScript code, the value is read or changed through `.value`; Vue automatically unwraps refs inside templates.

**Locations:**

- `src/views/LoginView.vue` — email, password, and submission state
- `src/views/BenefitsView.vue` — modal and restored-preference state
- `src/composables/useBenefits.ts` — search, category, and status filters
- `src/composables/useNotifications.ts` — current notification

Example from `useBenefits.ts`:

```ts
const search = ref('')
```

The composable uses `search.value` in TypeScript. A consuming template can bind the same ref directly with `v-model="search"`.

## 5. Reactive Objects with `reactive`

`reactive` makes an object's properties reactive while preserving object-style access without `.value`.

**Location:** `src/composables/useProfileForm.ts`

```ts
const form = reactive<Veteran>({ ...profile })
```

The profile form edits properties such as `form.name` and `form.email`. Vue tracks those changes and updates validation and the rendered form automatically.

## 6. Derived State with `computed`

A computed ref derives a value from reactive dependencies. Vue caches the result and recalculates it when a dependency changes.

**Locations:**

- `src/App.vue` — determines whether the current route uses the public layout
- `src/views/DashboardView.vue` — derives the first name, active applications, and next actions
- `src/views/BenefitDetailView.vue` — finds the benefit matching the route parameter
- `src/components/ActionItem.vue` — formats an action's due date
- `src/components/StatusBadge.vue` — maps a status to a display label
- `src/composables/useBenefits.ts` — derives categories and filtered benefits
- `src/composables/useProfileForm.ts` — derives form validity

Pinia getters in `src/stores/veteran.ts` serve a similar purpose for shared state. They derive saved benefits, upcoming actions, completion percentage, and counts by status.

## 7. Templates and Declarative Rendering

Vue templates describe what the interface should look like for the current state. Vue keeps the DOM synchronized when that state changes.

**Locations:** the `<template>` section of every `.vue` file.

This project uses several template features:

### Text interpolation

Double braces display JavaScript values as text.

```vue
<h2>{{ benefit.title }}</h2>
```

**Location:** `src/components/BenefitCard.vue`

### Attribute binding with `v-bind`

The `:` shorthand binds an HTML attribute or component prop to a JavaScript expression.

```vue
<StatusBadge :status="benefit.status" />
```

**Location:** `src/components/BenefitCard.vue`

### Event handling with `v-on`

The `@` shorthand listens for browser or component events.

```vue
<button @click="toggleSaved">Save benefit</button>
```

**Location:** `src/views/BenefitDetailView.vue`

### Conditional rendering

`v-if`, `v-else-if`, and `v-else` select which elements or components are rendered.

```vue
<div v-if="isLoading">...</div>
<p v-else-if="error">{{ error }}</p>
<template v-else-if="veteran">...</template>
```

**Location:** `src/views/DashboardView.vue`

### List rendering

`v-for` renders one element or component for every item in a collection. A stable `:key` helps Vue efficiently track each item.

```vue
<BenefitCard
  v-for="benefit in filteredBenefits"
  :key="benefit.id"
  :benefit="benefit"
/>
```

**Location:** `src/views/BenefitsView.vue`

## 8. Props

Props pass data from a parent component to a child component. They create an explicit input contract for reusable components.

The project declares typed props with `defineProps`.

**Locations:**

- `src/components/BenefitCard.vue` — receives a `Benefit`
- `src/components/BenefitDetailsPanel.vue` — receives a `Benefit`
- `src/components/ActionItem.vue` — receives an `ActionItem`
- `src/components/StatusBadge.vue` — receives a `BenefitStatus`
- `src/components/NotificationToast.vue` — receives a `Notification`
- all `Base*` components — receive reusable UI configuration

Example:

```ts
defineProps<{ benefit: Benefit }>()
```

The parent supplies the value with `:benefit="benefit"`.

## 9. Component Events

Child components emit events to notify their parents that something happened. This project uses typed events declared with `defineEmits`.

**Locations:**

- `src/components/BenefitCard.vue` — emits `save` with a benefit ID
- `src/components/ActionItem.vue` — emits `toggle` with an action ID
- `src/components/BaseModal.vue` — emits `close`

Example flow:

```text
BenefitCard button
    -> emits save(id)
        -> BenefitsView handles @save
            -> Pinia store toggles the saved state
```

This keeps the child component reusable because it reports user intent without deciding how shared state should be updated.

## 10. Two-Way Binding with `v-model`

`v-model` combines a value binding and an update event. It is used for form controls and custom input components.

**Locations:**

- `src/views/LoginView.vue` — binds login fields
- `src/views/BenefitsView.vue` — binds search and filter controls
- `src/views/ProfileView.vue` — binds profile fields
- `src/components/BaseInput.vue` — implements a custom model with `defineModel`
- `src/components/BaseSelect.vue` — implements a custom model with `defineModel`

For example, the parent can write:

```vue
<BaseInput v-model="search" ... />
```

Inside `BaseInput.vue`, `defineModel<string>()` creates the `modelValue` prop and `update:modelValue` event expected by `v-model`.

## 11. Slots

Slots let a parent provide markup to a reusable child component. They are useful when a component controls layout but the parent controls some of its content.

**Locations:**

- `src/components/BaseCard.vue` — default, `header`, and `actions` slots
- `src/components/BaseModal.vue` — default, `header`, and `actions` slots
- `src/components/EmptyState.vue` — default, `title`, and `action` slots

Example from a view:

```vue
<BaseCard>
  <template #header><h2>Service record</h2></template>
  <!-- Default slot content -->
</BaseCard>
```

**Location:** `src/views/ProfileView.vue`

## 12. Lifecycle Hooks

Lifecycle hooks run logic at particular stages in a component's lifetime. This project uses `onMounted` to start work after a view has been mounted.

**Locations:**

- `src/views/DashboardView.vue` — loads dashboard data
- `src/views/BenefitsView.vue` — loads data and restores filters
- `src/views/BenefitDetailView.vue` — ensures data is loaded
- `src/views/ProfileView.vue` — loads data and creates form state

The store's `hasLoaded` and `isLoading` flags prevent multiple mounted views from causing duplicate loads.

## 13. Watchers and Reactive Side Effects

Watchers run side effects in response to reactive changes.

### `watch`

`watch` observes specific reactive sources.

**Locations:**

- `src/views/BenefitsView.vue` — saves category and status filters to `localStorage`
- `src/views/ProfileView.vue` — initializes form state when the profile becomes available

### `watchEffect`

`watchEffect` runs immediately and automatically tracks every reactive value read during the effect.

**Location:** `src/App.vue`

It watches the current route metadata and updates `document.title` whenever navigation changes the page title.

## 14. Composables

A composable is a function that uses Vue's reactive APIs to package reusable state and behavior. By convention, its name starts with `use`.

**Locations:** `src/composables`

- `useBenefits.ts` packages benefit filtering state and logic.
- `useProfileForm.ts` packages profile editing and validation.
- `useNotifications.ts` packages the notification service.

Views call these functions inside `<script setup>` and use the returned state and methods in their templates.

## 15. Dependency Injection with `provide` and `inject`

`provide` makes a value available to all descendant components without passing it through every intermediate component as a prop. `inject` retrieves that value.

**Locations:**

- `src/composables/useNotifications.ts` — defines the provider, injection key, and consumer
- `src/App.vue` — calls `provideNotifications`
- `src/views/DashboardView.vue`, `BenefitsView.vue`, `BenefitDetailView.vue`, and `ProfileView.vue` — call `useNotifications`

The project uses a typed `InjectionKey` so TypeScript knows the shape of the notification service. The exposed notification ref is wrapped with `readonly`, allowing consumers to trigger notifications through `notify` without mutating the notification state directly.

## 16. Global State with Pinia

Pinia stores reactive data that must be shared across unrelated views and components.

**Location:** `src/stores/veteran.ts`

The store is created with `defineStore` and contains:

- `state` for mutable shared data;
- `getters` for derived data; and
- `actions` for state changes and asynchronous work.

Views access it by calling:

```ts
const store = useVeteranStore()
```

### `storeToRefs`

Destructuring a reactive store normally risks losing reactivity. Pinia's `storeToRefs` converts reactive store state and getters into refs that can be safely destructured.

**Locations:**

- `src/views/DashboardView.vue`
- `src/views/BenefitsView.vue`
- `src/views/ProfileView.vue`

Actions remain methods on the original `store` object and do not need `storeToRefs`.

## 17. Vue Router

Vue Router maps URLs to route-level components without requesting a new HTML document from the server.

**Location:** `src/router/index.ts`

Important router concepts in the project include:

- `createRouter` to create the router;
- `createWebHistory` for normal-looking browser URLs;
- route records containing paths, names, components, and metadata;
- redirects from `/` to `/dashboard`;
- dynamic parameters in `/benefits/:id`;
- a catch-all not-found route;
- global navigation guards with `beforeEach`; and
- a route-specific guard with `beforeEnter`.

### Router components

- `RouterView` renders the component for the active route in `src/App.vue`.
- `RouterLink` performs client-side navigation throughout the root layout, views, and components.

### Router composables

- `useRoute` reads the current route in `App.vue`, `LoginView.vue`, and `BenefitDetailView.vue`.
- `useRouter` performs programmatic navigation in `App.vue` and `LoginView.vue`.

## 18. Route Metadata

Route metadata stores application-specific information on route definitions.

**Locations:** `src/router/index.ts` and `src/App.vue`

This project uses:

- `meta.public` to choose the public layout and bypass authentication; and
- `meta.title` to build the browser document title.

The metadata does not render anything by itself. `App.vue` and the global route guard interpret it.

## 19. Lazy Loading and Code Splitting

Dynamic imports allow code to be downloaded only when it is needed.

### Route-level lazy loading

Every route view is dynamically imported in `src/router/index.ts`:

```ts
component: () => import('../views/DashboardView.vue')
```

Vite can place these views in separate production chunks.

### Component-level lazy loading

`src/views/BenefitDetailView.vue` uses `defineAsyncComponent` to load `BenefitDetailsPanel.vue` asynchronously. It renders the component inside `Suspense` and supplies a loading fallback while the component resolves.

## 20. Teleport

`Teleport` renders part of a component somewhere else in the DOM while keeping it in the same Vue component hierarchy.

**Location:** `src/components/BaseModal.vue`

The modal teleports its backdrop and dialog to `<body>`. This helps the overlay escape layout or stacking constraints from parent elements while preserving its props, events, and slots.

## 21. Dynamic Classes and Styles

Vue can calculate class names and inline styles from reactive state.

**Examples:**

- `src/components/StatusBadge.vue` binds a class based on benefit status.
- `src/components/ActionItem.vue` adds the `completed` class conditionally.
- `src/components/BenefitCard.vue` sets the progress-bar width from `benefit.progress`.
- `src/views/DashboardView.vue` sets the completion-bar width from a Pinia getter.

```vue
<span :style="{ width: `${benefit.progress}%` }" />
```

When the underlying state changes, Vue updates the corresponding class or style.

## 22. Scoped Styles and Deep Selectors

Adding `scoped` to a component's style block limits its selectors to that component's rendered markup.

**Locations:** the `<style scoped>` blocks in views and components.

When a parent needs to style content rendered inside a child component, the project uses Vue's `:deep()` selector. For example, `DashboardView.vue` uses `:deep(.card)` to affect the root card rendered by `BaseCard`.

Global styles and CSS custom properties remain in `src/style.css` because they are intentionally shared by the entire application.

## 23. TypeScript with Vue

TypeScript supplies contracts for component props, emitted events, reactive state, store data, and composable inputs and outputs.

**Key locations:**

- `src/types/index.ts` — shared domain interfaces and union types
- `src/stores/veteran.ts` — typed Pinia state
- `src/components/*.vue` — typed props, emits, and models
- `src/composables/*.ts` — typed reactive utilities
- `tsconfig.app.json` — Vue application compiler settings

Type-only imports use `import type`, which makes the intent explicit and prevents those imports from becoming runtime JavaScript.

## 24. Browser State and Vue Reactivity

`localStorage` is a browser API, not a Vue feature, but the project connects it to reactive Vue state.

**Locations:**

- `src/stores/veteran.ts` — demonstration session, saved benefits, and completed actions
- `src/views/BenefitsView.vue` — selected benefit filters
- `src/views/ProfileView.vue` — preferred contact setting

The usual flow is:

```text
user event
    -> component or view method
        -> reactive state or Pinia action
            -> Vue updates the interface
            -> selected value is written to localStorage
```

Because `localStorage` is not reactive, the application explicitly reads it during store creation or view mounting and explicitly writes it after mutations.

## 25. Testing Vue Code

The project tests Vue behavior with Vitest and Vue Test Utils.

**Locations:** `src/__tests__` and `src/tests/setup.ts`

Examples of tested Vue concepts include:

- mounting a component and inspecting rendered text;
- changing an input and checking its emitted `update:modelValue` event;
- checking custom component events;
- testing computed composable results after ref changes;
- activating an isolated Pinia instance for each test; and
- navigating with Vue Router to verify route guards.

`src/tests/setup.ts` provides test-environment behavior shared by the suite and clears `localStorage` after each test to maintain isolation.

## How the Concepts Work Together

The benefits page is a useful end-to-end example:

1. Vue Router renders `BenefitsView.vue` inside the root `RouterView`.
2. `onMounted` asks the Pinia store to load data.
3. The store calls the repository and places the returned benefits in reactive state.
4. `storeToRefs` exposes the reactive benefits list to the view.
5. `useBenefits` combines refs and computed values to filter the list.
6. `v-model` connects filter components to the composable's state.
7. `v-for` renders a `BenefitCard` for every computed result.
8. Each card receives data through props and emits `save` when its button is clicked.
9. The view handles the event, calls a Pinia action, and triggers the injected notification service.
10. Vue reacts to the state changes and updates the card and notification toast.

This flow demonstrates the main architecture of the project: routes choose views, views coordinate behavior, composables package local reactive logic, Pinia owns shared state, and reusable components render data and emit user intent.
