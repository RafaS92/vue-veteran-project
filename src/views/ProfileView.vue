<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BaseCard from '../components/BaseCard.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import { useNotifications } from '../composables/useNotifications'
import { useProfileForm } from '../composables/useProfileForm'
import { useVeteranStore } from '../stores/veteran'
import type { Veteran } from '../types'

const store = useVeteranStore()
const { veteran, isLoading } = storeToRefs(store)
const formState = ref<ReturnType<typeof useProfileForm> | null>(null)
const { notify } = useNotifications()

onMounted(async () => {
  await store.loadData()
  if (veteran.value) formState.value = useProfileForm(veteran.value)
})
watch(veteran, (profile) => {
  if (profile && !formState.value) formState.value = useProfileForm(profile)
})

function save() {
  if (!formState.value?.isValid) return
  store.updateProfile(formState.value.toProfile())
  localStorage.setItem('service-compass-contact-preference', formState.value.form.preferredContact)
  notify('Fictional profile saved')
}
</script>
<template>
  <div>
    <div class="page-heading">
      <div>
        <span class="eyebrow">Account details</span>
        <h1>Your profile</h1>
        <p>
          Keep the fictional service and contact information used throughout this learning project
          up to date.
        </p>
      </div>
    </div>
    <div v-if="isLoading" class="loading-state"><div class="spinner" /></div>
    <form v-else-if="formState" class="profile-layout" @submit.prevent="save">
      <BaseCard elevated>
        <template #header
          ><div>
            <span class="eyebrow">Personal details</span>
            <h2>Contact information</h2>
          </div></template
        >
        <div class="form-grid">
          <BaseInput id="name" v-model="formState.form.name" label="Full name" required />
          <BaseInput
            id="email"
            v-model="formState.form.email"
            label="Email address"
            type="email"
            required
          />
          <BaseInput id="phone" v-model="formState.form.phone" label="Phone number" />
          <BaseInput id="location" v-model="formState.form.location" label="Location" required />
          <BaseSelect
            id="contact"
            v-model="formState.form.preferredContact"
            label="Preferred contact"
            :options="['Email', 'Phone', 'Text']"
          />
        </div>
      </BaseCard>
      <aside>
        <BaseCard>
          <template #header><h2>Service record</h2></template>
          <dl>
            <div>
              <dt>Branch</dt>
              <dd>{{ formState.form.branch }}</dd>
            </div>
            <div>
              <dt>Service period</dt>
              <dd>{{ formState.form.servicePeriod }}</dd>
            </div>
            <div>
              <dt>Discharge</dt>
              <dd>{{ formState.form.dischargeStatus }}</dd>
            </div>
          </dl>
          <p class="note">Service information is read-only in this demonstration.</p>
        </BaseCard>
        <button class="button" type="submit" :disabled="!formState.isValid">Save profile</button>
        <button
          class="button button-secondary"
          type="button"
          @click="formState.reset(veteran as Veteran)"
        >
          Reset changes
        </button>
      </aside>
    </form>
  </div>
</template>
<style scoped>
.profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.7fr);
  gap: 1.25rem;
  align-items: start;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}
.form-grid > :first-child,
.form-grid > :nth-child(2) {
  grid-column: 1 / -1;
}
aside {
  display: grid;
  gap: 0.75rem;
}
dl {
  margin: 0;
}
dl div {
  padding: 0.65rem 0;
  border-bottom: 1px solid var(--line);
}
dt {
  color: var(--muted);
  font-size: 0.75rem;
}
dd {
  margin: 0.2rem 0 0;
  color: var(--ink);
  font-weight: 700;
}
.note {
  margin: 1rem 0 0;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.5;
}
@media (max-width: 800px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-grid > * {
    grid-column: auto !important;
  }
}
</style>
