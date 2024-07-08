<script setup>

import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button/index.js";
import { nextTick, onMounted, onUnmounted, onUpdated, ref, watch } from "vue";
import Message from "@/components/Message.vue";
import { ScrollArea } from "@/components/ui/scroll-area/index.js";
import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { useContactStore } from "@/store/contactStore.js";
import { Stomp } from "@stomp/stompjs";
import { useChatStore } from "@/store/chatStore.js";
import IconThreeDots from "@/components/icons/IconThreeDots.vue";
import IconMusicNote from "@/components/icons/IconMusicNote.vue";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet/index.js";
import { spotifyLogin } from "@/api/api.js";
import { usePlaybackStore } from "@/store/playbackStore.js";
import WebPlayback from "@/components/WebPlayback.vue";
import IconPreviousSong from "@/components/icons/IconPreviousSong.vue";
import IconPauseSong from "@/components/icons/IconPauseSong.vue";
import IconResumeSong from "@/components/icons/IconResumeSong.vue";

const props = defineProps(['currentChat'])

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)
const token = authRefs.tokens.value['access_token']

const chatStore = useChatStore()
const chatRefs = storeToRefs(chatStore)

const contactStore = useContactStore()
const contactRefs = storeToRefs(contactStore)

const playbackStore = usePlaybackStore()
const playbackRefs = storeToRefs(playbackStore)

const chatInput = ref('')
const contentRef = ref(null)
const scrollAreaRef = ref(null)

let stompClient = null

function initWebSocketConnection() {
  let socket = new SockJS('http://localhost:8080/chat');
  stompClient = Stomp.over(socket);
  stompClient.connect({ 'Authorization': `Bearer ${ token }` }, function (frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/messages', function (messageOutput) {
      console.log(messageOutput.body)
    });
    stompClient.subscribe(`/user/${ authRefs.user.value['id'] }/queue/messages`, (message) => {
      // console.log(`Received direct msg: ${message.body}`)
      let json = JSON.parse(message.body)
      chatRefs.chats.value.find(c => c['id'] === json['chatId']).messages.push(json)

      if (getPercentScrolled() !== 1) return
      scrollToBottom()
    });
  });
}

function sendMessage() {
  stompClient.publish({
    destination: "/app/chat",
    body:
        `{
          "chat_id": ${ props.currentChat.id },
          "content": "${ chatInput.value }"
        }`
  })
  chatInput.value = ''
}

onMounted(() => {
  scrollToBottom()
  contactStore.getContacts(token)
  playbackStore.refresh(authRefs.tokens.value['access_token'])
  initWebSocketConnection()
})

onUnmounted(() => {
  if (stompClient) stompClient.disconnect()
})

onUpdated(() => {
  if (getPercentScrolled() !== 1) return
  scrollToBottom()
})

watch(
    () => props.currentChat.messages,
    () => scrollToBottom()
)

function getPercentScrolled() {
  if (props.currentChat.messages.length === 0) return 1
  const scrollAreaElement = contentRef.value[contentRef.value.length - 1].parentElement.parentElement
  const scrollTop = scrollAreaElement.scrollTop
  const offsetHeight = scrollAreaElement.scrollHeight - scrollAreaElement.offsetHeight

  return scrollTop / offsetHeight
}

function scrollToBottom() {
  if (props.currentChat.messages.length === 0) return
  nextTick(() => {
    if (contentRef.value === null) return
    const latestMessage = contentRef.value[contentRef.value.length - 1];
    latestMessage.scrollIntoView(false)
  })
}

function spotifyLoginRedirect() {
  spotifyLogin(authRefs.tokens.value['access_token']).then((response) => {
    console.log(response)
    window.location = response.data
  }).catch((error) => {
    console.error(error)
  })
}

function isCurrentPlayback() {
  return playbackRefs.currentPlayback.value && playbackRefs.currentPlayback.value.chat_id === props.currentChat.id
}

</script>

<template>
  <div class="relative">
    <Sheet>
    <ScrollArea ref="scrollAreaRef" class="h-[100%] px-6">
      <div v-for="message in props.currentChat.messages" ref="contentRef" class="first:pt-20 last:pb-16">
        <Message :authRefs="authRefs" :contactRefs="contactRefs" :message="message"/>
      </div>
      <div v-if="props.currentChat.messages.length === 0">
        <p class="text-gray-400 text-center m-auto absolute bottom-20 w-full">
          Looks like this chat has no messages yet!
        </p>
      </div>
    </ScrollArea>
    <div
        class="border-b rounded-t px-6 h-16 absolute top-0 w-full backdrop-blur drop-shadow flex justify-center flex-col">
      <div>
        <h1 class="inline-block">Selected chat: {{ props.currentChat.name }}</h1>
        <div class="*:inline-block *:w-6 *:ml-5 *:hover:cursor-pointer float-end">
          <IconPreviousSong v-if="isCurrentPlayback()" @click="playbackStore.action(token, props.currentChat.id, 'PREVIOUS')"/>
          <IconPauseSong v-if="isCurrentPlayback()" @click="playbackStore.action(token, props.currentChat.id, 'PAUSE')"/>
          <IconResumeSong v-if="isCurrentPlayback()" @click="playbackStore.action(token, props.currentChat.id, 'PLAY')"/>
          <IconPreviousSong v-if="isCurrentPlayback()" @click="playbackStore.action(token, props.currentChat.id, 'NEXT')" class="rotate-180"/>
          <SheetTrigger as-child>
            <IconMusicNote/>
          </SheetTrigger>
          <IconThreeDots/>
        </div>
      </div>
    </div>
    <div class="absolute bottom-[2vh] px-5 flex w-full bg-transparent">
      <Input v-model="chatInput" class="inline-block w-[100%] mx-2 drop-shadow" type="text"/>
      <Button class="inline-block drop-shadow" @click="sendMessage()">Send</Button>
    </div>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Spotify</SheetTitle>
        </SheetHeader>
        <Button v-if="playbackRefs.isLoggedIn.value === false" @click="spotifyLoginRedirect()">login to spotify</Button>
        <div v-else>
          You are logged in!
          <WebPlayback :playbackStore="playbackStore" :authToken="token" :chatId="props.currentChat.id"/>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
