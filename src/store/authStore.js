import { defineStore } from 'pinia'
import { login, register } from '@/api/api.js'
import { ref } from "vue";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        tokens: ref(''),
        user: ref('')
    }),
    actions: {
        login(email, password) {
            login(email, password).then(
                (res) => {
                   this.tokens = {
                        'access_token': res.data.access_token,
                        'refresh_token': res.data.refresh_token
                   }
                   this.user = res.data.user
                }
            )
        },
        register(email, username, password) {
            register(email, username, password).then(
                (res) => {
                    this.tokens = {
                        'access_token': res.data.access_token,
                        'refresh_token': res.data.refresh_token
                    }
                    this.user = res.data.user
                }
            )
        },
    },
})