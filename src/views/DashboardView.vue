<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import ActionItem from '../components/ActionItem.vue'
import BaseCard from '../components/BaseCard.vue'
import PageHeader from '../components/PageHeader.vue'
import ProgressBar from '../components/ProgressBar.vue'
import LoadingState from '../components/LoadingState.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useNotifications } from '../composables/useNotifications'
import { useVeteranStore } from '../stores/veteran'

const store = useVeteranStore()
const { veteran, benefits, actionItems, isLoading, error } = storeToRefs(store)
const { notify } = useNotifications()
const firstName = computed(() => veteran.value?.name.split(' ')[0] ?? 'there')
const activeApplications = computed(() =>
  benefits.value.filter((item) => ['applied', 'action-needed'].includes(item.status)),
)
const nextActions = computed(() => actionItems.value.filter((item) => !item.completed).slice(0, 3))

onMounted(() => store.loadData())

function toggleAction(id: string) {
  store.toggleAction(id)
  notify('Action item updated')
}
</script>
<template>
  <div>
    <PageHeader
      eyebrow="Thursday, September 10"
      :title="`Good morning, ${firstName}.`"
      description="Here is a clear view of your fictional benefit activity and the next steps that need attention."
    >
      <template #actions>
        <RouterLink class="button button-secondary" to="/benefits">Explore benefits</RouterLink>
      </template>
    </PageHeader>

    <LoadingState v-if="isLoading" message="Preparing your dashboard…" />
    <p v-else-if="error" class="error-text" role="alert">{{ error }}</p>
    <template v-else-if="veteran">
      <section class="summary-grid" aria-label="Benefit summary">
        <BaseCard
          ><span class="stat-label">Saved benefits</span
          ><strong class="stat-value">{{ store.savedBenefits.length }}</strong
          ><small
            >Across {{ new Set(benefits.map((item) => item.category)).size }} categories</small
          ></BaseCard
        >
        <BaseCard
          ><span class="stat-label">Active applications</span
          ><strong class="stat-value">{{ activeApplications.length }}</strong
          ><small>{{ store.statusCounts['action-needed'] }} needs your attention</small></BaseCard
        >
        <BaseCard class="progress-card"
          ><span class="stat-label">Actions completed</span
          ><strong class="stat-value">{{ store.completionPercentage }}%</strong>
          <ProgressBar
            :value="store.completionPercentage"
            tone="gold"
            thick
            aria-label="Actions completed"
          />
        </BaseCard>
      </section>

      <section class="dashboard-grid">
        <BaseCard elevated>
          <template #header
            ><div>
              <span class="eyebrow">Your priorities</span>
              <h2>Upcoming actions</h2>
            </div></template
          >
          <template #actions
            ><span class="count">{{ store.upcomingActions.length }} open</span></template
          >
          <ActionItem
            v-for="item in nextActions"
            :key="item.id"
            :item="item"
            @toggle="toggleAction"
          />
        </BaseCard>
        <BaseCard class="profile-card">
          <template #header
            ><div>
              <span class="eyebrow">Service profile</span>
              <h2>{{ veteran.name }}</h2>
            </div></template
          >
          <dl>
            <div>
              <dt>Branch</dt>
              <dd>{{ veteran.branch }}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>{{ veteran.servicePeriod }}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{{ veteran.location }}</dd>
            </div>
          </dl>
          <RouterLink class="profile-link" to="/profile">Review profile →</RouterLink>
        </BaseCard>
      </section>

      <section class="applications">
        <div class="section-heading">
          <div>
            <span class="eyebrow">In progress</span>
            <h2>Active applications</h2>
          </div>
          <RouterLink to="/benefits">View all benefits</RouterLink>
        </div>
        <div class="application-list">
          <RouterLink
            v-for="benefit in activeApplications"
            :key="benefit.id"
            :to="`/benefits/${benefit.id}`"
            class="application-row"
          >
            <div>
              <strong>{{ benefit.title }}</strong
              ><span>Next: {{ benefit.nextStep }}</span>
            </div>
            <StatusBadge :status="benefit.status" /><strong>{{ benefit.progress }}%</strong>
          </RouterLink>
        </div>
      </section>
    </template>
  </div>
</template>
<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
.summary-grid :deep(.card) {
  min-height: 150px;
}
.stat-label {
  display: block;
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 700;
}
.stat-value {
  display: block;
  margin: 0.5rem 0 0.25rem;
  color: var(--ink);
  font-family: 'Manrope';
  font-size: 2.15rem;
}
.summary-grid small {
  color: var(--muted);
}
.progress-card :deep(.progress-track) {
  margin-top: 0.8rem;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.8fr);
  gap: 1.25rem;
}
.count {
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  background: var(--green-soft);
  color: var(--green);
  font-size: 0.72rem;
  font-weight: 800;
}
.profile-card {
  background: var(--ink);
  border-color: var(--ink);
  color: white;
}
.profile-card :deep(h2),
.profile-card .eyebrow {
  color: white;
}
.profile-card .eyebrow {
  color: #f0c876;
}
.profile-card dl {
  margin: 1.5rem 0;
}
.profile-card dl div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.profile-card dt {
  color: #9fb0aa;
}
.profile-card dd {
  margin: 0;
  font-weight: 700;
}
.profile-link {
  color: #f0c876;
  font-weight: 800;
  text-decoration: none;
}
.applications {
  margin-top: 2.2rem;
}
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.section-heading h2 {
  margin-bottom: 0;
}
.section-heading a {
  color: var(--green);
  font-size: 0.85rem;
  font-weight: 800;
  text-decoration: none;
}
.application-list {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: white;
}
.application-row {
  display: grid;
  grid-template-columns: 1fr auto 55px;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
}
.application-row:last-child {
  border-bottom: 0;
}
.application-row:hover {
  background: #f8faf8;
}
.application-row div {
  display: grid;
  gap: 0.25rem;
}
.application-row span {
  color: var(--muted);
  font-size: 0.8rem;
}
@media (max-width: 850px) {
  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }
  .progress-card {
    grid-column: 1 / -1;
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
  .progress-card {
    grid-column: auto;
  }
  .application-row {
    grid-template-columns: 1fr auto;
  }
  .application-row > strong {
    display: none;
  }
}
</style>
