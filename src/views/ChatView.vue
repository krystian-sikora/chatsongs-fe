<script setup>

import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/store/chatStore.js";
import { onMounted, onUpdated, ref, watch } from "vue";
import Chat from "@/components/chat/Chat.vue";
import CreateChat from "@/components/chat/CreateChat.vue";
import router from "@/router/router.js";
import ChatPreviewsArea from "@/components/chat/ChatPreviewsArea.vue";
import { useContactStore } from "@/store/contactStore.js";
import SidebarIcons from "@/components/SidebarIcons.vue";
import DummyChat from "@/components/chat/DummyChat.vue";
import { usePlaybackStore } from "@/store/playbackStore.js";

const props = defineProps(['id'])

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const authToken = authRefs.tokens.value['access_token']

const chatStore = useChatStore()
const chatRefs = storeToRefs(chatStore)

const contactStore = useContactStore()

const currentChat = ref(chatRefs.chats.value[0])
const isCreatingNewChat = ref(false)

const playbackStore = usePlaybackStore()
const { currentPlayback, device, tokens } = storeToRefs(playbackStore)

const currentlyPlaying = ref(null)

function loadChat() {
  if (props.id && chatRefs.chats.value.length !== 0) {
    currentChat.value = chatRefs.chats.value.find(c => c.id === Number(props.id))
    return
  }

  if (props.id) {
    watch(
        () => chatStore.chats,
        (newChats) => {
          if (newChats.length > 0) {
            currentChat.value = chatRefs.chats.value.find(c => c.id === Number(props.id))
          }
        }
    )
    return
  }

  if (chatStore.chats.length !== 0) {
    router.push(`chat/${ chatStore.chats[0].id }`)
    return
  }

  watch(
      () => chatStore.chats,
      (newChats) => {
        if (newChats.length > 0) {
          router.push(`chat/${ newChats[0].id }`)
        }
      }
  )
}

onMounted(() => {
  if (!authToken) return

  chatStore.getChats(authToken)
  contactStore.getContacts(authToken)

  loadChat()
  loadScript()
})

onUpdated(() => {
  loadChat()
})

function updateIsCreatingNewChat(bool) {
  isCreatingNewChat.value = bool
  loadChat()
}

function updateCurrentChat(id) {
  currentChat.value = chatRefs.chats.value.find(c => c.id === id)
}

const showChatPreviews = ref(false)

function updateShowChatPreviews(bool) {
  showChatPreviews.value = bool
  console.log(bool)
}

function loadScript() {
  const script = document.createElement('script')
  script.src = 'https://sdk.scdn.co/spotify-player.js'
  script.async = true
  document.body.appendChild(script)

  window.onSpotifyWebPlaybackSDKReady = () => {
    if (!tokens.value['access_token']) {
      console.log('no token, watching for changes', tokens.value)
      watch(() => tokens.value, (newTokens) => {
        console.log('new token', tokens.value)
        if (!newTokens['access_token']) return
        console.log(tokens.value)
        initPlayer()
      })
    } else {
      console.log('token found', tokens.value)
      initPlayer()
    }
  }
}

function initPlayer() {
  if (device.value['is_active'] === true) return

  const player = new window.Spotify.Player({
    name: 'ChatSongs Player',
    getOAuthToken: cb => { cb(tokens.value['access_token']) },
    volume: 0.5
  });

  player.addListener('ready', ({ device_id }) => {
    playbackStore.setDevice(authToken, device_id, true)
    console.log('Ready with Device ID', device_id);
  });

  player.addListener('not_ready', ({ device_id }) => {
    playbackStore.setDevice(authToken, device_id, false)
    console.log('Device ID has gone offline', device_id);
  });

  player.addListener('player_state_changed', ({position, duration, track_window: { current_track } }) => {
    currentlyPlaying.value = `${current_track.artists[0].name} - ${current_track.name}`
  });

  player.connect();

  watch(() => currentPlayback.value, (newPlayback) => {
    console.log('changed', newPlayback)
    if (!newPlayback) {
      player.pause()
      console.log('paused')
    }
  })
}

function xd() {
  isCreatingNewChat.value = false
  console.log('xd')
}

</script>

<template>
  <div class="lg:mt-3 overflow-x-hidden">
<!--    <h1 v-if="authRefs.tokens.value['access_token']">Hello, {{ authRefs.user.value['nickname'] }}</h1>-->
    <div class="flex lg:*:ml-3 lg:last:mr-3">
      <div class="flex-none bg-secondary border rounded-md hidden lg:block">
        <SidebarIcons class="rounded-md bg-white m-1 py-1 drop-shadow *:p-1 *:w-10 *:m-2 *:hover:cursor-pointer" fillColor="fill-[url(#grad2)]" strokeColor="stroke-[url(#grad2)]"/>
      </div>
      <div class="flex-1 max-w-72 bg-secondary border rounded-md lg:block transition-transform duration-300 fixed top-0 left-0 z-30 w-64 lg:relative lg:ml-3 lg:translate-x-0"
           :class="showChatPreviews ? 'translate-x-0' : '-translate-x-full'">
        <ChatPreviewsArea :id="props.id" :currentChat="currentChat" :isCreatingNewChat="isCreatingNewChat"
                          @update:isCreatingNewChat="updateIsCreatingNewChat"
                          @update:currentChat="updateCurrentChat"
                          @update:showChatPreviews="updateShowChatPreviews">
        </ChatPreviewsArea>
      </div>
<!--      The *:h-[calc(100vh-60px)] subtracts mobile web browser ui so the app won't need scrolling.
          This might not be an issue in PWA?

          The md:*:h-[calc(100vh-1.5rem)] subtracts margins that are only on medium+ screens -->
      <div class="flex-1 transition-transform duration-300 w-[1200px] bg-secondary border rounded-md *:h-[calc(100vh-60px)] lg:*:h-[calc(100vh-1.5rem)] relative"
           :class="showChatPreviews ? 'transform translate-x-64' : 'transform translate-x-0'">
        <CreateChat v-if="isCreatingNewChat" :currentChat="currentChat"
                    :isCreatingNewChat="isCreatingNewChat"
                    @update:isCreatingNewChat="updateIsCreatingNewChat"
                    @update:showChatPreviews="updateShowChatPreviews">
        </CreateChat>
        <Chat v-else-if="props.id && currentChat" :currentChat="currentChat" :currentlyPlaying="currentlyPlaying"
              @update:showChatPreviews="updateShowChatPreviews">
        </Chat>
        <DummyChat v-else-if="!props.id" @update:showChatPreviews="updateShowChatPreviews"/>
      </div>
    </div>
  </div>
</template>
