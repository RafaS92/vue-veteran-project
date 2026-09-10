# Vue.js Application Architecture

## Overview

Service Compass is a client-side single-page application built with Vue 3 and TypeScript. Vite provides the development and production build pipeline, Vue Router controls navigation, and Pinia owns shared application state.

The application uses Vue Single-File Components (SFCs) with the Composition API and `<script setup lang="ts">`. It currently reads fictional application data from local JSON files and persists selected user preferences in browser `localStorage`.

## Technology Stack

- **Vue 3** for the user interface and reactivity system
- **TypeScript** for application types and compile-time checks
- **Vite** for local development, bundling, and production builds
- **Vue Router** for client-side routing and navigation guards
- **Pinia** for shared state and derived state
- **Vitest**, **Vue Test Utils**, and **jsdom** for automated tests

## Application Bootstrap

The browser loads `index.html`, which provides the `#app` mount element and imports `src/main.ts` as an ES module.

`src/main.ts` creates the Vue application and installs the two application-wide plugins before mounting the root component:

1. Pinia is installed for shared state management.
2. Vue Router is installed for route resolution and navigation.
3. `App.vue` is mounted to `#app`.
4. The global stylesheet in `src/style.css` is loaded.

```text
index.html
    -> src/main.ts
        -> Pinia
        -> Vue Router
        -> App.vue
            -> active route view
```

## Source Organization

```text
src/
├── assets/          Static assets imported by the application
├── components/      Reusable presentation and interaction components
├── composables/     Reusable Composition API state and behavior
├── data/            Local JSON fixtures
├── repositories/    Data-access boundary
├── router/          Route definitions and navigation guards
├── stores/          Pinia application state
├── tests/           Shared test setup
├── __tests__/       Component, composable, store, and router tests
├── types/           Shared TypeScript domain types
├── views/           Route-level components
├── App.vue          Root layout and application-wide UI
├── main.ts          Application entry point
└── style.css        Global styles and design tokens
```

## Root Layout

`App.vue` is the root component. It selects one of two layouts from route metadata:

- Public pages render only the active `RouterView` inside a public layout.
- Protected pages render the sidebar, top bar, page container, and active `RouterView` inside the main application shell.

The root component also:

- updates the browser document title from each route's `meta.title` value;
- provides the notification service to descendant components;
- reads the signed-in user's name from the Pinia store;
- handles sign-out and redirects the user to the login page; and
- displays the application-wide notification toast.

## Routing

`src/router/index.ts` uses HTML5 history through `createWebHistory`. Route components are dynamically imported, so Vite can split them into separate chunks.

| Path | View | Access | Purpose |
| --- | --- | --- | --- |
| `/` | Redirect | Public entry | Redirects to `/dashboard` |
| `/login` | `LoginView.vue` | Public | Demonstration sign-in |
| `/dashboard` | `DashboardView.vue` | Protected | Summary, applications, and action items |
| `/benefits` | `BenefitsView.vue` | Protected | Searchable and filterable benefits list |
| `/benefits/:id` | `BenefitDetailView.vue` | Protected | Details for one benefit |
| `/profile` | `ProfileView.vue` | Protected | Editable profile form |
| Any unmatched path | `NotFoundView.vue` | Public | Not-found state |

A global navigation guard checks `store.isAuthenticated`. Signed-out users attempting to enter protected routes are redirected to `/login`, with the intended path stored in the `redirect` query parameter. Signed-in users who visit `/login` are redirected to `/dashboard`.

The benefit-detail route has an additional route guard. It loads the store data and verifies that the requested benefit ID exists before allowing navigation; unknown IDs resolve to the not-found route.

## State Management

`src/stores/veteran.ts` defines the central `veteran` Pinia store. It owns:

- the current fictional veteran profile;
- the benefits collection;
- the action-items collection;
- loading and error state;
- authentication state; and
- a flag that prevents fixture data from being loaded more than once.

The store exposes getters for saved benefits, incomplete actions, action completion percentage, and benefit counts grouped by status.

Store actions perform the application's shared mutations:

- `signIn` and `signOut` update the demonstration session;
- `loadData` retrieves and initializes dashboard data;
- `toggleSaved` changes a benefit's saved state;
- `toggleAction` changes an action item's completion state; and
- `updateProfile` replaces the active profile.

Authentication, saved benefit IDs, and completed action IDs are persisted in `localStorage`. The profile update itself remains in memory, while the preferred-contact selection is also stored separately by the profile view.

## Data Access

`src/repositories/dataRepository.ts` is the data-access boundary. Its `fetchDashboardData` function imports the JSON fixtures from `src/data`, simulates an asynchronous request, and returns a structured clone.

```text
JSON fixtures
    -> dataRepository
        -> Pinia store
            -> route views and components
                -> user interaction
                    -> store actions and localStorage
```

Keeping fixture access behind a repository gives the Vue application a single place to replace local data with an HTTP API later. Views do not import fixture files directly.

Shared data contracts live in `src/types/index.ts`. They define the veteran profile, benefits, action items, status/category unions, and the combined dashboard response.

## Views and Components

Files in `src/views` are route-level components. They coordinate routing, store access, composables, lifecycle hooks, and page-specific presentation.

Files in `src/components` are reusable UI building blocks. They receive data through typed props and communicate user actions through typed emits or `v-model`. Examples include:

- base components such as `BaseCard`, `BaseInput`, `BaseSelect`, and `BaseModal`;
- domain components such as `BenefitCard`, `BenefitDetailsPanel`, `ActionItem`, and `StatusBadge`; and
- shared feedback components such as `EmptyState` and `NotificationToast`.

Most child components do not mutate the Pinia store directly. They emit an intent to their parent view, and the view calls the appropriate store action. This keeps reusable components focused on display and interaction.

`BenefitDetailsPanel` is loaded with `defineAsyncComponent` and rendered inside `Suspense`, demonstrating component-level lazy loading in addition to route-level code splitting.

## Composables

Reusable reactive behavior is kept in `src/composables`:

- `useBenefits` owns benefit search and filter state and derives the filtered result list.
- `useProfileForm` creates reactive form state, validation, reset behavior, and conversion back to a profile object.
- `provideNotifications` and `useNotifications` implement an application-scoped notification service with Vue's `provide`/`inject` API.

Composables keep view components smaller and make stateful UI behavior testable independently of complete pages.

## Styling

`src/style.css` contains global styles, shared layout rules, and CSS custom properties used as design tokens. Components and views add locally scoped styles in their `.vue` files.

The styling approach therefore has two levels:

- global tokens and shared application patterns; and
- component-scoped styles for local layout and presentation.

Responsive layouts are implemented with CSS grid, flexbox, and component-level media queries.

## Testing

Vitest is configured in `vite.config.ts` with the `jsdom` environment and shared setup from `src/tests/setup.ts`. Tests live in `src/__tests__` and currently cover:

- reusable component events and `v-model` behavior;
- benefit filtering composable behavior;
- Pinia loading, mutations, and derived state;
- route authentication guards; and
- dashboard loading and populated states.

Vue Test Utils mounts components, while tests create isolated Pinia instances to avoid sharing state between cases. Repository and notification dependencies are mocked where isolation is useful.

## Build Configuration

Vite configuration is defined in `vite.config.ts`. It enables the Vue plugin, maps `@` to the `src` directory, and contains the Vitest configuration.

The main project commands are:

- `npm run dev` — start the Vite development server;
- `npm run build` — run Vue TypeScript checks and create a production bundle;
- `npm run preview` — serve the production bundle locally;
- `npm test` — run the Vitest test suite once; and
- `npm run test:watch` — run tests in watch mode.

TypeScript configuration includes `.ts`, `.tsx`, and `.vue` source files, supports JSON module imports, and enables checks for unused code and unsafe switch fall-through.

## Architectural Boundaries

The current dependency direction is:

```text
Views
├── reusable components
├── composables
├── Pinia store
└── Vue Router

Pinia store
├── repository
└── shared types

Repository
├── JSON fixtures
└── shared types

Components and composables
└── shared types, when domain data is required
```

This structure separates page orchestration, reusable UI, shared reactive behavior, application state, and data access while remaining lightweight for the current Vue application.
