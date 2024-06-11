<script setup>

import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button/index.js";
import {onMounted, ref} from "vue";
import Message from "@/components/Message.vue";
import {ScrollArea} from "@/components/ui/scroll-area/index.js";
import {useAuthStore} from "@/store/authStore.js";
import {storeToRefs} from "pinia";
import {useContactStore} from "@/store/contactStore.js";

const props = defineProps(['currentChat', 'stompClient'])

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const contactStore = useContactStore()
const contactRefs = storeToRefs(contactStore)

const chatInput = ref('')
const scrollAreaRef = ref(null)
const contentRef = ref(null)

function sendMessage() {
  props.stompClient.publish({
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
})

const scrollToBottom = () => {
  const scrollArea = scrollAreaRef.value
  const content = contentRef.value
  console.log(scrollArea)
  console.log(content.scrollHeight)
  if (scrollArea) {
    scrollArea.scrollTop = content.scrollHeight
    console.log('xd?')
  }
};

</script>

<template>
  <div class="relative">
    <h1>Selected chat: {{ props.currentChat.name }}</h1>
    <ScrollArea ref="scrollAreaRef" class="h-[700px]">
      <div ref="contentRef">
        <div v-for="message in props.currentChat.messages">
          <Message v-bind:message="message" v-bind:authRefs="authRefs" v-bind:contactRefs="contactRefs"></Message>
        </div>
      </div>
    </ScrollArea>
    <div class="absolute bottom-[-47px] flex">
      <Input type="text" v-model="chatInput" class="inline-block"></Input>
      <Button class="inline-block" @click="sendMessage()">Send</Button>
    </div>
  </div>
</template>

<style scoped>

</style>