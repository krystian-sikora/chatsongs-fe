import { defineStore } from 'pinia'
import { login, refresh, register } from '@/api/api.js'
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
        refresh() {
            refresh(this.tokens['access_token']).then(
                (res) => {
                    this.tokens = {
                        'access_token': res.data.access_token,
                        'refresh_token': res.data.refresh_token
                    }
                    this.user = res.data.user
                }
            ).catch(
                (res) => {
                    console.warn('could not refresh token', res)
                    this.tokens = null
                    this.user = null
                }
            )
        },
    },
})