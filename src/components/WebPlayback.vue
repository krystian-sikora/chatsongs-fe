<script setup>

import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { Button } from "@/components/ui/button/index.js";
import PlaybackInstructions from "@/components/PlaybackInstructions.vue";
import IconResumeSong from "@/components/icons/IconResumeSong.vue";

const props = defineProps(['playbackStore', 'authToken', 'chatId'])
const emit = defineEmits(['update:currentlyPlaying'])

const { tokens, device, playbacks, currentPlayback } = storeToRefs(props.playbackStore)


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

  player.addListener('player_state_changed', ({position, duration, track_window: { current_track } }) => {
    setCurrentlyPlaying(current_track)
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

function setCurrentlyPlaying(current_track) {
  console.log('setting cp', current_track)
  emit('update:currentlyPlaying', current_track)
  currentlyPlaying.value = current_track

}

function joinSession() {
  props.playbackStore.join(props.authToken, props.chatId)
}

</script>

<template>
  <div>
    <Button @click="emit('update:currentlyPlaying', 'xdddddd')">emit</Button>
    <div v-if="playbacks.get(chatId)">
      <div v-if="currentPlayback && currentPlayback.chat_id === chatId">
        <div class="my-7">
          <strong>You are currently in a session.</strong>
          <p>Click the "Quit session" button below to leave the session.</p>
        </div>
        <Button @click="playbackStore.quit(props.authToken, props.chatId)">Quit session</Button>
      </div>
      <div v-else>
        <div class="my-7">
          <strong>This chat has a current session active.</strong>
          <p>Click the "Join Session" button below to synchronize your playback with session host!</p>
        </div>
        <Button @click="joinSession">Join session</Button>
      </div>
    </div>
    <div v-else>
      <PlaybackInstructions class="my-7"/>
      <Button @click="joinSession" class="text-center">Create session</Button>
    </div>
  </div>
</template>

<style scoped>

</style>