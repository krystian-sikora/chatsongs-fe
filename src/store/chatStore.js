import { defineStore } from 'pinia'
import { ref } from "vue";
import {createChat, getChats} from "@/api/api.js";

export const useChatStore = defineStore('chats', {
    state: () => {
        return {
            chats: ref([])
        }
    },
    actions: {
        getChats(token) {
            getChats(token).then(
                (res) => {
                    this.chats = res.data
                }
            )
        },
        createChat(token, users) {
            createChat(token, users).then(
                (res) => {
                    console.log(res)
                    this.chats.push(res.data)
                }
            )
        }
    },
})