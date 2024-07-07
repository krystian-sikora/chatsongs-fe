<script setup>

import { onMounted, ref } from "vue";
import router from "@/router/router.js";
import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { spotifyCallback } from "@/api/api.js";
import { Button } from "@/components/ui/button/index.js";
import { usePlaybackStore } from "@/store/playbackStore.js";

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const spotifyStore = usePlaybackStore()

const token = authRefs.tokens.value['access_token']

const error = ref(null)

onMounted(() => {
  if (!token) console.log('No token')

  spotifyCallback(token, router.currentRoute.value.query)
      .then(() => {
        spotifyStore.isLoggedIn = true
        router.push('/')
      })
      .catch((e) => {
        spotifyStore.isLoggedIn = false
        error.value = e
      })
})

</script>

<template>
  <div v-if="!error">
    <h1>Connecting...</h1>
  </div>
  <div v-else>
    <h1>There was an error trying to connect your chatsongs account with Spotify</h1>
    <Button @click="router.push({path: '/'})" variant="outline">Click here to return</Button>
  </div>
</template>

<style scoped>

</style>