import { createRouter, createWebHistory } from 'vue-router'
import { useVeteranStore } from '../stores/veteran'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { public: true, title: 'Sign in' } },
    { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: 'Overview' } },
    { path: '/benefits', name: 'benefits', component: () => import('../views/BenefitsView.vue'), meta: { title: 'Benefits' } },
    {
      path: '/benefits/:id', name: 'benefit-detail', component: () => import('../views/BenefitDetailView.vue'), meta: { title: 'Benefit details' },
      beforeEnter: async (to) => {
        const store = useVeteranStore()
        await store.loadData()
        return store.benefits.some((benefit) => benefit.id === to.params.id) || { name: 'not-found' }
      },
    },
    { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { title: 'Profile' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { public: true, title: 'Page not found' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const store = useVeteranStore()
  if (!to.meta.public && !store.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && store.isAuthenticated) return { name: 'dashboard' }
})

export default router
