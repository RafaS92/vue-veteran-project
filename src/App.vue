<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import NotificationToast from './components/NotificationToast.vue'
import { provideNotifications } from './composables/useNotifications'
import { useVeteranStore } from './stores/veteran'

const route = useRoute()
const router = useRouter()
const store = useVeteranStore()
const { notification } = provideNotifications()
const isPublicPage = computed(() => route.meta.public === true)

watchEffect(() => {
  const routeTitle = typeof route.meta.title === 'string' ? route.meta.title : 'Dashboard'
  document.title = `${routeTitle} | Service Compass`
})

function signOut() {
  store.signOut()
  router.push('/login')
}
</script>

<template>
  <div v-if="isPublicPage" class="public-layout"><RouterView /></div>
  <div v-else class="app-shell">
    <aside class="sidebar">
      <RouterLink class="brand" to="/dashboard" aria-label="Service Compass home">
        <span class="brand-mark">SC</span>
        <span><strong>Service Compass</strong><small>Veteran support demo</small></span>
      </RouterLink>
      <nav aria-label="Primary navigation">
        <RouterLink to="/dashboard">Overview</RouterLink>
        <RouterLink to="/benefits">Benefits</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
      </nav>
      <div class="sidebar-note">
        <span class="eyebrow">Learning project</span>
        <p>All people and benefit records shown here are fictional.</p>
      </div>
    </aside>
    <div class="app-main">
      <header class="topbar">
        <span class="mobile-brand">Service Compass</span>
        <div class="user-menu">
          <div class="avatar" aria-hidden="true">JB</div>
          <span>{{ store.veteran?.name ?? 'Jordan Brooks' }}</span>
          <button class="text-button" type="button" @click="signOut">Sign out</button>
        </div>
      </header>
      <main class="page-container"><RouterView /></main>
    </div>
    <NotificationToast v-if="notification" :notification="notification" />
  </div>
</template>
