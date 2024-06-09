<script setup>

import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/store/chatStore.js";
import {computed, onMounted, onUnmounted, ref} from "vue";
import ChatPreview from "@/components/ChatPreview.vue";
import { Button } from "@/components/ui/button/index.js";
import Chat from "@/components/Chat.vue";
import {Stomp} from "@stomp/stompjs";

const apiUrl = import.meta.env.VITE_API_URL;

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const token = authRefs.tokens.value['access_token']

const chatStore = useChatStore()
const chatRefs = storeToRefs(chatStore)

const chats = computed(() => {
  return !!chatRefs.chats.value;
})

const currentChat = ref(chatRefs.chats.value[0])
let stompClient = null

onMounted(() => {
  if (!token) return
  chatStore.getChats(token)
  initWebSocketConnection()
})

onUnmounted(() => {
  if (stompClient) stompClient.disconnect()
})

function initWebSocketConnection() {
  let socket = new SockJS('http://localhost:8080/chat');
  stompClient = Stomp.over(socket);
  stompClient.connect({'Authorization': `Bearer ${token}`}, function(frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/messages', function(messageOutput) {
      console.log(messageOutput.body)
    });
    stompClient.publish({
      destination: "/app/chat",
      body:
        `{
          "chat_id": 1,
          "content": "hello"
        }`
    });
    stompClient.subscribe(`/user/${authRefs.user.value['id']}/queue/messages`, (message) => {
      console.log(`Received direct msg: ${message.body}`);
    });
  });
}

function createDummyChat() {
  const id = authRefs.user.value['id']
  chatStore.createChat(token, [id, id+1])
}

</script>

<template>
  <div class="h-screen">
    <h1 v-if="authRefs.tokens.value['access_token']">Hello, {{ authRefs.user.value['nickname']}}</h1>
    <Button @click="createDummyChat">
      create dummy chat
    </Button>
    <div class="grid grid-cols-4 h-5/6">
      <div class="col-span-1 overflow-scroll">
        <div v-if="chats" v-for="chat in chatRefs.chats.value" @click="currentChat = chat" class="cursor-pointer">
          <ChatPreview v-bind:chat="chat"></ChatPreview>
        </div>
      </div>
      <div class="col-span-3">
        <Chat v-bind:chat="currentChat" v-bind:stompClient="stompClient"></Chat>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>