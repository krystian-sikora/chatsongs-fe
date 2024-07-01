import { defineStore } from 'pinia'
import { ref } from "vue";
import { refreshSpotifyCredentials } from "@/api/api.js";

export const useSpotifyStore = defineStore('spotify', {
    state: () => {
        return {
            isLoggedIn: ref(false),
        }
    },
    actions: {
        refresh(token) {
            refreshSpotifyCredentials(token)
                .then(
                    () => {
                        this.isLoggedIn = true
                    })
                .catch(
                    (res) => {
                        console.warn('could not refresh token', res)
                        this.isLoggedIn = false
                })
        },
    },
})