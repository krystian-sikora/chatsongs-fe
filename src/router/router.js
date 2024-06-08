import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from "@/components/HomeView.vue";
import LoginView from "@/components/LoginView.vue";
import RegisterView from "@/components/RegisterView.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default {
    router
}