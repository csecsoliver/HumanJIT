import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import type { Socket } from 'socket.io-client'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
