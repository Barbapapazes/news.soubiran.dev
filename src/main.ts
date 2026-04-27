import ui from '@nuxt/ui/vue-plugin'
import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PiniaColada)
app.use(ui)

app.mount('#app')
