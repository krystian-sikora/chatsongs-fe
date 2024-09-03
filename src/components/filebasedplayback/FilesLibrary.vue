<script setup>

import axios from "axios";
import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { getSongUri } from "@/components/utils/songUtils.js";

const apiUrl = import.meta.env.VITE_API_URL
const authStore = useAuthStore()
const { tokens: authTokens } = storeToRefs(authStore)

const userSongs = ref([])

onMounted(() => {
  getUserSongs()
})

function getUserSongs() {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: apiUrl + '/api' + '/songs',
    headers: {
      'Authorization': `Bearer ${ authTokens.value['access_token'] }`
    }
  }

  axios.request(config)
      .then((response) => {
        userSongs.value = response.data
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      });
}



</script>

<template>
  <h1>Files Library</h1>
  <div v-for="song in userSongs" :key="song.id">
    <h2>{{ song.name }}</h2>
    <audio :src="getSongUri(song.id)" controls/>
  </div>
</template>

<style scoped>

</style>