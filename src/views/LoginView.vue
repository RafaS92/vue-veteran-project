<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseInput from '../components/BaseInput.vue'
import { useVeteranStore } from '../stores/veteran'

const email = ref('jordan.brooks@example.com')
const password = ref('demopassword')
const isSubmitting = ref(false)
const router = useRouter()
const route = useRoute()
const store = useVeteranStore()

async function submit() {
  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 350))
  store.signIn()
  const destination = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  await router.push(destination)
}
</script>
<template>
  <main class="login-page">
    <section class="login-story">
      <div class="story-content">
        <span class="brand-mark">SC</span><span class="eyebrow">Vue learning project</span>
        <h1>Your benefits.<br />One clear path.</h1>
        <p>
          A focused dashboard for understanding services, applications, and next steps after
          military service.
        </p>
      </div>
      <p class="disclaimer">Educational demo only. All information is fictional.</p>
    </section>
    <section class="login-form-wrap">
      <form class="login-form" @submit.prevent="submit">
        <span class="eyebrow">Welcome back</span>
        <h2>Sign in to your dashboard</h2>
        <p>Use the prefilled demonstration account to explore the app.</p>
        <BaseInput id="email" v-model="email" label="Email address" type="email" required />
        <BaseInput id="password" v-model="password" label="Password" type="password" required />
        <button class="button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Opening dashboard…' : 'Open demo dashboard' }}
        </button>
        <small>No account or personal information is created.</small>
      </form>
    </section>
  </main>
</template>
<style scoped>
.login-page {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.85fr);
  min-height: 100vh;
}
.login-story {
  padding: clamp(2rem, 7vw, 6rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--ink);
  color: white;
  position: relative;
  overflow: hidden;
}
.login-story::after {
  content: '';
  position: absolute;
  width: 380px;
  height: 380px;
  right: -120px;
  bottom: -150px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  box-shadow:
    0 0 0 60px rgba(255, 255, 255, 0.025),
    0 0 0 120px rgba(255, 255, 255, 0.02);
}
.brand-mark {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  margin-bottom: 4rem;
  border-radius: 13px;
  background: var(--gold);
  color: var(--ink);
  font-family: 'Manrope';
  font-weight: 800;
}
.login-story .eyebrow {
  color: #f0c876;
}
.login-story h1 {
  max-width: 600px;
  margin: 0.5rem 0 1.2rem;
  color: white;
  font-size: clamp(2.8rem, 6vw, 5.5rem);
}
.story-content > p {
  max-width: 560px;
  color: #b9c7c2;
  font-size: 1.05rem;
  line-height: 1.7;
}
.disclaimer {
  position: absolute;
  bottom: 2rem;
  color: #8fa39b;
  font-size: 0.75rem;
}
.login-form-wrap {
  display: grid;
  place-items: center;
  padding: 2rem;
  background: white;
}
.login-form {
  width: min(400px, 100%);
  display: grid;
  gap: 1.2rem;
}
.login-form h2 {
  margin: 0;
  font-size: 1.7rem;
}
.login-form > p,
.login-form small {
  color: var(--muted);
  line-height: 1.5;
}
.login-form .button {
  width: 100%;
  margin-top: 0.4rem;
}
.login-form small {
  text-align: center;
}
@media (max-width: 820px) {
  .login-page {
    grid-template-columns: 1fr;
  }
  .login-story {
    min-height: 38vh;
    padding: 2rem;
  }
  .brand-mark {
    margin-bottom: 2rem;
  }
  .login-story h1 {
    font-size: 2.6rem;
  }
  .disclaimer {
    display: none;
  }
  .login-form-wrap {
    padding: 3rem 1.5rem;
  }
}
</style>
