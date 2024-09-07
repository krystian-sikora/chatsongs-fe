import { defineStore } from 'pinia'
import { ref } from "vue";
import { createChat, getChats } from "@/api/api.js";
import router from '@/router/router.js'

export const useChatStore = defineStore('chats', {
    state: () => {
        return {
            chats: ref([]),
            chatsEmpty: ref(false),
            isLoading: ref(false)
        }
    },
    actions: {
        getChats(token) {
            this.isLoading = true
            getChats(token).then(
                (res) => {
                    this.isLoading = false
                    this.chats = res.data
                    this.chatsEmpty = res.data.length === 0;
                }
            ).catch(
                (err) => {
                    this.isLoading = false
                    console.log(err)
                }
            )
        },
        getLatest() {
            // TODO: implement a way to get the latest chat
            return this.chats[0]
        },
        createChat(token, users) {
            createChat(token, users).then(
                (res) => {
                    console.log(res)
                    this.chats.push(res.data)
                    router.push({ path: `/chat/${ res.data.id }` })
                }
            )
        }
    },
})