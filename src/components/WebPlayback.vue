<script setup>

import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";

const props = defineProps(['spotifyStore'])

const script = document.createElement('script')
script.src = 'https://sdk.scdn.co/spotify-player.js'
script.async = true
document.body.appendChild(script)

const { tokens, device } = storeToRefs(props.spotifyStore)

const playerS = ref(null)

onMounted(() => {
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
})

function initPlayer() {
  if (device.value['is_active'] === true) return

  const player = new window.Spotify.Player({
    name: 'ChatSongs Player',
    getOAuthToken: cb => { cb(tokens.value['access_token']) },
    volume: 0.5
  });

  player.addListener('ready', ({ device_id }) => {
    device.value['device_id'] = device_id
    device.value['is_active'] = true
    console.log('Ready with Device ID', device_id);
  });

  player.addListener('not_ready', ({ device_id }) => {
    device.value['device_id'] = device_id
    device.value['is_active'] = false
    console.log('Device ID has gone offline', device_id);
  });

  player.connect();

  playerS.value = player
}


</script>

<template>
  <div>
    <h1>Web Playback</h1>
  </div>
</template>

<style scoped>

</style>