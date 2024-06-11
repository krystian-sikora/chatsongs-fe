import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'

import HomeView from "@/views/ChatView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import Contacts from "@/components/Contacts.vue";
import { useAuthStore } from "@/store/authStore.js";

const routes = [
    { path: '/', component: HomeView },
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
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        auth.returnUrl = to.fullPath;
        return '/login';
    }
});
