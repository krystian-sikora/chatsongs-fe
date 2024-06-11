<script setup>

import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/store/chatStore.js";
import { computed, onMounted, onUnmounted, ref } from "vue";
import ChatPreview from "@/components/ChatPreview.vue";
import { Button } from "@/components/ui/button/index.js";
import Chat from "@/components/Chat.vue";
import { Stomp } from "@stomp/stompjs";
import { ScrollArea } from "@/components/ui/scroll-area/index.js";
import CreateChat from "@/components/CreateChat.vue";
import router from "@/router/router.js";

const props = defineProps(['id'])

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
const isCreatingNewChat = ref(true)
let stompClient = null

onMounted(() => {
  if (!token) return

  currentChat.value = props.id

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
    stompClient.subscribe(`/user/${authRefs.user.value['id']}/queue/messages`, (message) => {
      // console.log(`Received direct msg: ${message.body}`)
      let json = JSON.parse(message.body)
      chatRefs.chats.value.find(c => c['id'] === json['chatId']).messages.push(json)
    });
  });
}

function createDummyChat() {
  const id = authRefs.user.value['id']
  chatStore.createChat(token, [id, id+1])
}

function viewChat(chat) {
  isCreatingNewChat.value = false
  currentChat.value = chat
  router.push({path: `/chat/${chat.id}`})
}

</script>

<template>
  <div class="h-screen">
    <h1 v-if="authRefs.tokens.value['access_token']">Hello, {{ authRefs.user.value['nickname']}}</h1>
    <div class="grid grid-cols-12 h-5/6">

      <ScrollArea class="col-span-3 p-6 border rounded-md mx-5 pt-20">
        <Button @click="isCreatingNewChat=!isCreatingNewChat" class="absolute top-5">Create new chat</Button>
        <div v-if="chats" v-for="chat in chatRefs.chats.value" @click="viewChat(chat)" class="cursor-pointer">
          <ChatPreview v-bind:chat="chat"></ChatPreview>
        </div>
      </ScrollArea>

      <div class="col-span-8 p-6 border rounded-md mx-5">
        <CreateChat v-if="isCreatingNewChat" v-bind:currentChat="currentChat" v-bind:isCreatingNewChat="isCreatingNewChat"></CreateChat>
        <Chat v-else v-bind:currentChat="currentChat" v-bind:stompClient="stompClient"></Chat>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>