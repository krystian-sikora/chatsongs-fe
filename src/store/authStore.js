import { defineStore } from 'pinia'
import { login, refresh, register } from '@/api/api.js'
import { ref } from "vue";
import router from "@/router/router.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        tokens: ref(),
        user: ref(),
        error: ref(null)
    }),
    actions: {
        login(email, password) {
            login(email, password).then(
                (res) => {
                    this.setTokens(res.data)
                }
            ).catch(
                (res) => {
                    // console.warn('could not login', res)
                    this.tokens = null
                    this.user = null
                    this.error = res
                }
            )
        },
        logout() {
            localStorage.clear()
            router.push({ path: '/login' })
        },
        register(email, username, password) {
            register(email, username, password).then(
                (res) => {
                    this.setTokens(res.data)
                }
            ).catch((error) => {
                // console.warn('could not register', error)
                this.tokens = null
                this.user = null
                this.error = error
            })
        },
        refresh() {
            return refresh(localStorage.getItem('refresh_token')).then(
                (res) => {
                    this.setTokens(res.data)
                    return true
                }
            ).catch(
                (res) => {
                    console.warn('could not refresh token', res)
                    this.tokens = null
                    this.user = null
                    return false
                }
            )
        },
        setTokens(data) {
            this.user = data.user
            this.tokens = {
                'access_token': data.access_token,
                'refresh_token': data.refresh_token
            }
            localStorage.setItem('access_token', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token)
        },
        isAuthenticated() {
            const access_token = localStorage.getItem('access_token')
            const refresh_token = localStorage.getItem('refresh_token')

            this.tokens = {
                'access_token': access_token,
                'refresh_token': refresh_token
            }

            if (access_token === null || refresh_token === null) return false

            return this.refresh()
        }
    },
})