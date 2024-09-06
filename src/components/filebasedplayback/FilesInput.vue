<script setup>

import { Label } from "@/components/ui/label/index.js";
import { Input } from "@/components/ui/input/index.js";
import { Button } from "@/components/ui/button/index.js";
import axios from "axios";
import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { playbackData } = defineProps(['playbackData'])
const emits = defineEmits(['update:playbackData'])

const apiUrl = import.meta.env.VITE_API_URL + '/api'
const authStore = useAuthStore()
const { tokens: authTokens } = storeToRefs(authStore)

const isSent = ref(false);
const isError = ref(false);

async function addSong() {
  const song = document.getElementById('song').files[0]
  postSong(song)
}

function postSong(song) {
  let data = new FormData()
  data.append("file", song)
  const url = playbackData ? apiUrl + '/filebased-playback/' + playbackData.id : apiUrl + '/songs'

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Authorization': `Bearer ${ authTokens.value['access_token'] }`
    },
    data: data
  }

  axios.request(config)
      .then((response) => {
        isSent.value = true
        isError.value = false
        playbackData ? emits('update:playbackData', response.data) : null
      })
      .catch((error) => {
        isError.value = true
        console.log(error)
      });
}

</script>

<template>
  <Label for="song">Add an MP3 song file from device</Label>
  <div class="flex gap-1">
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Input id="song" accept="audio/*" type="file"/>
    </div>
    <Button @click="addSong">Add</Button>
    <h2 v-if="isError">error while sending file</h2>
    <h2 v-if="isSent && !isError">file sent successfully</h2>
  </div>
</template>

<style scoped>

</style>