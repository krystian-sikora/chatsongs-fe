<script setup>

import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { Button } from "@/components/ui/button/index.js";
import PlaybackInstructions from "@/components/PlaybackInstructions.vue";

const props = defineProps(['playbackStore', 'authToken', 'chatId'])

const { playbacks, currentPlayback } = storeToRefs(props.playbackStore)


onMounted(() => {
  props.playbackStore.getPlayback(props.authToken, props.chatId)
})

function joinSession() {
  props.playbackStore.join(props.authToken, props.chatId)
}

</script>

<template>
  <div>
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