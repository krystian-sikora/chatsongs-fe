<script setup>

import { Button } from "@/components/ui/button/index.js";
import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { Stomp } from "@stomp/stompjs";
import axios from "axios";
import { onMounted, ref } from "vue";
import { ErrorMessage } from "vee-validate";
import CurrentlyListeningUsers from "@/components/filebasedplayback/CurrentlyListeningUsers.vue";
import SongQueueTable from "@/components/filebasedplayback/MusicTabs.vue";
import FilesInput from "@/components/filebasedplayback/FilesInput.vue";
import { attachListeners } from "@/components/filebasedplayback/playback.js";
import PlaybackControls from "@/components/filebasedplayback/PlaybackControls.vue";

const { chatId, filebasedPlaybackStore } = defineProps(['chatId', 'filebasedPlaybackStore'])
const apiUrl = import.meta.env.VITE_API_URL;

const authStore = useAuthStore()
const { tokens: authTokens } = storeToRefs(authStore)
const { isInSession, playbackData, backtrack } = storeToRefs(filebasedPlaybackStore)

const isError = ref(false)

let stompClient = null

onMounted(() => {
  authStore.isAuthenticated()
})

function joinFilebasedPlayback(chatId) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: apiUrl + '/api' + '/filebased-playback',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ authTokens.value['access_token'] }`
    },
    data: chatId
  }

  axios.request(config)
      .then((response) => {
        playbackData.value = response.data
        isInSession.value = true
        isError.value = false
        attachListeners()
      })
      .catch((error) => {
        console.log(error)
        isInSession.value = false
        isError.value = true
      });
}

function initWebSocketConnection() {
  let socket = new SockJS(apiUrl + '/chat')
  stompClient = Stomp.over(socket)
  stompClient.connect({ 'Authorization': `Bearer ${ authTokens.value['access_token'] }` }, function (frame) {
    console.log('Connected: ' + frame)
    stompClient.subscribe('/topic/messages', function (messageOutput) {
      console.log(messageOutput.body)
    });
    stompClient.subscribe(`/user/${ authRefs.user.value['id'] }/queue/messages`, (message) => {
      console.log(`filebased playback message: ${message.body}`)
      let json = JSON.parse(message.body)
      console.log(json)
    });
  });
}

// function sendMessage() {
//     stompClient.publish({
//         destination: "/app/chat",
//         body:
//             `{
//           "chat_id": ${ props.currentChat.id },
//           "content": "${ chatInput.value }"
//         }`
//     })
//     chatInput.value = ''
// }

function updatePlaybackData(newPlaybackData) {
  playbackData.value = newPlaybackData
}

</script>

<template>
  <div>
    <Button v-if="!isInSession" @click="joinFilebasedPlayback(chatId ? chatId : 402)">Join file-based playback</Button>
    <ErrorMessage v-if="isError">Error while joining playback</ErrorMessage>
    <div v-if="isInSession && !isError">
      <PlaybackControls class="my-2"/>
      <CurrentlyListeningUsers :users="playbackData['active_users']" class="my-2"/>
      <SongQueueTable :music="playbackData['song_queue']" :backtrack='backtrack'/>
      <FilesInput :playbackData="playbackData" @update:playbackData="updatePlaybackData"/>
    </div>
  </div>
</template>

<style scoped>

</style>