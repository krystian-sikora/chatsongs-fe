<script setup>

import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { Button } from "@/components/ui/button/index.js";

const props = defineProps(['playbackStore', 'authToken', 'chatId'])

const { tokens, device, playbacks, currentPlayback } = storeToRefs(props.playbackStore)

const playerS = ref(null)

onMounted(() => {
  props.playbackStore.getPlayback(props.authToken, props.chatId)
  loadScript()
})

function loadScript() {
  const script = document.createElement('script')
  script.src = 'https://sdk.scdn.co/spotify-player.js'
  script.async = true
  document.body.appendChild(script)

  window.onSpotifyWebPlaybackSDKReady = () => {
    if (!tokens.value['access_token']) {
      // console.log('no token, watching for changes', tokens.value)
      watch(() => tokens, (newTokens) => {
        // console.log('new token', tokens.value)
        if (!newTokens['access_token']) return
        // console.log(tokens.value)
        initPlayer()
      })
    } else {
      // console.log('token found', tokens.value)
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
    props.playbackStore.setDevice(props.authToken, device_id, true)
    console.log('Ready with Device ID', device_id);
  });

  player.addListener('not_ready', ({ device_id }) => {
    props.playbackStore.setDevice(props.authToken, device_id, false)
    console.log('Device ID has gone offline', device_id);
  });

  player.connect();

  playerS.value = player
}

function joinSession() {
  props.playbackStore.join(props.authToken, props.chatId)
}

</script>

<template>
  <div>
    <div v-if="playbacks.get(chatId)">
      <div v-if="currentPlayback && currentPlayback.chat_id === chatId">
        {{ currentPlayback }}
      </div>
      <div v-else>
        <Button @click="joinSession">Join session</Button>
      </div>
    </div>
    <div v-else>
      <Button @click="joinSession">Create session</Button>
    </div>
  </div>
</template>

<style scoped>

</style>