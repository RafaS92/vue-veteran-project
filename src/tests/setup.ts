import { afterEach, vi } from 'vitest'

window.scrollTo = vi.fn()

afterEach(() => {
  localStorage.clear()
})
