<script setup>

import { Input } from '@/components/ui/input/index.js'
import { Button } from "@/components/ui/button/index.js";
import { computed, nextTick, onMounted, onUnmounted, onUpdated, ref, watch } from "vue";
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
  SheetTrigger
} from "@/components/ui/sheet/index.js";
import { spotifyLogin } from "@/api/api.js";
import { usePlaybackStore } from "@/store/playbackStore.js";
import IconBack from "@/components/icons/IconBack.vue";
import FilebasedPlayback from "@/components/filebasedplayback/FilebasedPlayback.vue";
import { useFilebasedPlaybackStore } from "@/store/filebasedPlaybackStore.js";
import PlaybackControls from "@/components/filebasedplayback/PlaybackControls.vue";

const props = defineProps(['currentChat', 'currentlyPlaying', 'globalAudio'])
const emit = defineEmits(['update:showChatPreviews'])

const apiUrl = import.meta.env.VITE_API_URL;

const filebasedPlaybackStore = useFilebasedPlaybackStore()

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
  let socket = new SockJS(apiUrl + '/chat')
  stompClient = Stomp.over(socket)
  stompClient.connect({ 'Authorization': `Bearer ${ token }` }, function (frame) {
    console.log('Connected: ' + frame)
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

const isCurrentPlayback = computed(() => {
  return playbackRefs.currentPlayback.value && playbackRefs.currentPlayback.value.chat_id === props.currentChat.id
})

function updateShowChatPreviews() {
  emit('update:showChatPreviews', true)
}

</script>

<template>
  <div class="relative">
    <Sheet>
    <ScrollArea ref="scrollAreaRef" class="h-[100%] px-1 md:px-6">
      <div v-for="message in props.currentChat.messages" ref="contentRef" class="first:pt-20 last:pb-16">
        <Message :authRefs="authRefs" :contactRefs="contactRefs" :message="message"/>
      </div>
      <div v-if="props.currentChat.messages.length === 0">
        <p class="text-gray-400 text-center m-auto absolute bottom-20 w-full">
          Looks like this chat has no messages yet!
        </p>
      </div>
    </ScrollArea>
    <div class="border-b rounded-t px-2 md:px-6 h-16 absolute top-0 w-full backdrop-blur drop-shadow flex justify-center flex-col">
      <div>
        <IconBack @click="updateShowChatPreviews" class="lg:hidden inline-block w-6 mr-3 hover:cursor-pointer "/>
        <h1 class="inline-block align-middle truncate contain-inline-size"
          :class="isCurrentPlayback ? 'w-[calc(100%-264px-36px)]' : 'w-[calc(100%-88px-36px-116px)] md:w-[calc(100%-88px-36px-116px)]'">
          {{ props.currentChat.name }}
        </h1>
        <div class="float-end relative">
          <PlaybackControls v-if="filebasedPlaybackStore.isInSession" class="float-left" :globalAudio="props.globalAudio"/>
          <div class="*:inline-block inline-block *:w-6 *:ml-5 *:hover:cursor-pointer float-end">
            <SheetTrigger as-child>
              <IconMusicNote/>
            </SheetTrigger>
            <IconThreeDots/>
          </div>
          <div v-if="isCurrentPlayback" class="absolute left-0 top-7">
            <p v-if="props.currentlyPlaying" class="contain-inline-size truncate w-60 ml-5 text-xs text-gray-600"> {{ props.currentlyPlaying }} </p>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute bottom-[2vh] px-5 flex w-full bg-transparent">
      <Input v-model="chatInput" class="inline-block w-[100%] mx-2 drop-shadow" type="text"/>
      <Button class="inline-block drop-shadow" @click="sendMessage()">Send</Button>
    </div>
<!--      <SheetContent>-->
<!--        <SheetHeader>-->
<!--          <SheetTitle>Spotify Playback</SheetTitle>-->
<!--        </SheetHeader>-->
<!--        <div v-if="playbackRefs.isLoggedIn.value === false">-->
<!--          <div class="my-7">-->
<!--            <strong>You are currently not logged in with Spotify.</strong>-->
<!--            <p>In order to connect your <strong>chatsongs</strong> account with Spotify press the button below.</p>-->
<!--          </div>-->
<!--          <Button @click="spotifyLoginRedirect()" class="">login to spotify</Button>-->
<!--        </div>-->
<!--        <div v-else>-->
<!--          <WebPlayback :playbackStore="playbackStore" :authToken="token" :chatId="props.currentChat.id"/>-->
<!--        </div>-->
<!--      </SheetContent>-->
      <SheetContent>
        <SheetHeader>Playback</SheetHeader>
        <FilebasedPlayback :filebasedPlaybackStore="filebasedPlaybackStore"/>
      </SheetContent>
    </Sheet>
  </div>
</template>
