import './assets/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import { createPinia } from "pinia";
import './httpInterceptors.js'

const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
