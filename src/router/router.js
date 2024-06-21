import { createRouter, createWebHistory } from 'vue-router'

import HomeView from "@/views/ChatView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import Contacts from "@/components/Contacts.vue";
import { useAuthStore } from "@/store/authStore.js";

const routes = [
    { path: '/', redirect: '/chat' },
    { path: '/chat', component: HomeView },
    { path: '/chat/:id', component: HomeView, props: true },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/contacts', component: Contacts }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/register']
    const authRequired = !publicPages.includes(to.path)
    const auth = useAuthStore()
    let loggedIn

    if (!auth.user) loggedIn = auth.isAuthenticated()
    else loggedIn = true

    if (authRequired && loggedIn === false) {
        auth.returnUrl = to.fullPath
        return '/login'
    }
});
