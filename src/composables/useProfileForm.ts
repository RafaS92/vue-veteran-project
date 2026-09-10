import { computed, reactive } from 'vue'
import type { Veteran } from '../types'

export function useProfileForm(profile: Veteran) {
  const form = reactive<Veteran>({ ...profile })
  const isValid = computed(() =>
    Boolean(form.name.trim() && form.email.includes('@') && form.location.trim()),
  )
  function reset(nextProfile: Veteran = profile) {
    Object.assign(form, nextProfile)
  }
  function toProfile(): Veteran {
    return { ...form }
  }
  return { form, isValid, reset, toProfile }
}
