import { defineStore } from 'pinia'
import {login, register} from '@/api/api.js'
import {ref} from "vue";

export const useAuthStore = defineStore('counter', {
    state: () => ({ auth: ref('') }),
    actions: {
        login(email, password) {
           login(email, password).then(
               (res) => {
                   console.log(res)
               }
           )
        },
        register(email, username, password) {
            register(email, username, password).then(
                (res) => {
                    console.log(res)
                }
            )
        },
    },
})