import ui from '@nuxt/ui/vue-plugin'
import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { PiniaColadaRecentlySuccessfulPlugin } from 'pinia-colada-plugin-recently-successful'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { setupSentry } from './sentry'
import './register-sw'
import './style.css'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

setupSentry(app, router)

app
  .use(ui)
  .use(router)
  .use(createPinia())
  .use(PiniaColada, {
    plugins: [PiniaColadaRecentlySuccessfulPlugin()],
  })
  .mount('#app')
