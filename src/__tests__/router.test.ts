import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import router from '../router'
import { useVeteranStore } from '../stores/veteran'

describe('route guards', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    await router.push('/login')
  })

  it('redirects signed-out users to login', async () => {
    await router.push('/profile')
    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/profile')
  })

  it('allows signed-in users to visit protected routes', async () => {
    useVeteranStore().signIn()
    await router.push('/profile')
    expect(router.currentRoute.value.name).toBe('profile')
  })
})
