<script setup>

import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button/index.js";
import {nextTick, onMounted, onUnmounted, onUpdated, ref, watch} from "vue";
import Message from "@/components/Message.vue";
import {ScrollArea} from "@/components/ui/scroll-area/index.js";
import {useAuthStore} from "@/store/authStore.js";
import {storeToRefs} from "pinia";
import {useContactStore} from "@/store/contactStore.js";
import {Stomp} from "@stomp/stompjs";
import {useChatStore} from "@/store/chatStore.js";

const props = defineProps(['currentChat'])

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)
const token = authRefs.tokens.value['access_token']

const chatStore = useChatStore()
const chatRefs = storeToRefs(chatStore)

const contactStore = useContactStore()
const contactRefs = storeToRefs(contactStore)

const chatInput = ref('')
const contentRef = ref(null)

let stompClient = null

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
      scrollToBottom()
    });
  });
}

function sendMessage() {
  stompClient.publish({
    destination: "/app/chat",
    body:
      `{
        "chat_id": ${props.currentChat.id},
        "content": "${chatInput.value}"
      }`
  })
  chatInput.value = ''
}

onMounted(() => {
  scrollToBottom()
  contactStore.getContacts(token)
  initWebSocketConnection()
})

onUnmounted(() => {
  if (stompClient) stompClient.disconnect()
})

onUpdated(() => {
  scrollToBottom()
})

watch(
    () => props.currentChat.messages,
    () => scrollToBottom()
)

function scrollToBottom() {
  if (props.currentChat.messages.length === 0) return
  nextTick(() => {
    if (contentRef.value === null) return
    contentRef.value[contentRef.value.length - 1].scrollIntoView(false)
  })
}

</script>

<template>
  <div class="relative">
    <h1>Selected chat: {{ props.currentChat.name }}</h1>
    <ScrollArea ref="scrollAreaRef" class="h-[700px]">
        <div v-for="message in props.currentChat.messages" ref="contentRef">
          <Message v-bind:message="message" v-bind:authRefs="authRefs" v-bind:contactRefs="contactRefs"></Message>
        </div>
    </ScrollArea>
    <div class="absolute bottom-[-3.25rem] flex w-full">
      <Input type="text" v-model="chatInput" class="inline-block w-[100%] mx-2"></Input>
      <Button class="inline-block" @click="sendMessage()">Send</Button>
    </div>
  </div>
</template>

<style scoped>

</style>