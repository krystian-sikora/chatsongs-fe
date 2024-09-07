<script setup>

import { Label } from "@/components/ui/label/index.js";
import { Input } from "@/components/ui/input/index.js";
import { Button } from "@/components/ui/button/index.js";
import axios from "axios";
import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert/index.js";
import { AlertCircle } from "lucide-vue-next";
import { HollowDotsSpinner } from "epic-spinners";

const { playbackData } = defineProps(['playbackData'])
const emits = defineEmits(['update:playbackData'])

const apiUrl = import.meta.env.VITE_API_URL + '/api'
const authStore = useAuthStore()
const { tokens: authTokens } = storeToRefs(authStore)

const isSent = ref(false);
const isSendPending = ref(false);
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
        isSendPending.value = false
        isError.value = false
        playbackData ? emits('update:playbackData', response.data) : null
      })
      .catch((error) => {
        isSendPending.value = false
        isError.value = true
        console.log(error)
      });
}

</script>

<template>
  <Label for="song">Add an audio file from device</Label>
  <div class="flex flex-wrap md:flex-nowrap gap-1">
    <div class=" max-w-sm items-center gap-1.5">
      <Input id="song" accept="audio/*" type="file"/>
    </div>
    <Button class="min-w-[122px]" @click="isSendPending = true; addSong()">
      <HollowDotsSpinner v-if="isSendPending" :size="5"/>
      <span v-else>Add song</span>
    </Button>
  </div>
  <Transition>
    <Alert v-if="isError" class="mx-auto my-2 bg-white" variant="destructive">
      <AlertCircle class="w-4 h-4" />
      <div class="flex justify-between">
        <AlertTitle class="mt-1">Error while sending file</AlertTitle>
        <span class="-mt-1 hover:cursor-pointer" @click="isError = false">X</span>
      </div>
      <AlertDescription class="*:whitespace-pre-wrap">
        Make sure to check that the file:
        <ol class="list-disc *:ml-5">
          <li>is correctly selected</li>
          <li>has size less than 50Mb</li>
          <li>has correct audio format</li>
        </ol>
      </AlertDescription>
    </Alert>
  </Transition>
  <h2 v-if="isSent && !isError">file sent successfully</h2>
</template>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
