<script setup>

import { Button } from "@/components/ui/button/index.js";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { ErrorMessage } from "vee-validate";
import CurrentlyListeningUsers from "@/components/filebasedplayback/CurrentlyListeningUsers.vue";
import SongQueueTable from "@/components/filebasedplayback/MusicTabs.vue";
import FilesInput from "@/components/filebasedplayback/FilesInput.vue";
import PlaybackControls from "@/components/filebasedplayback/PlaybackControls.vue";
import { joinFilebasedPlayback, quitSession, splitSongQueue } from "@/components/filebasedplayback/playback.js";
import { useAuthStore } from "@/store/authStore.js";
import IconLogout from "@/components/icons/IconLogout.vue";
import SimpleTooltip from "@/components/SimpleTooltip.vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert/index.js";
import { AlertCircle } from 'lucide-vue-next'
import { HollowDotsSpinner } from "epic-spinners";

const { chatId, filebasedPlaybackStore } = defineProps(['chatId', 'filebasedPlaybackStore'])
const { isInSession, queue, backtrack, playbackData, isError, sessionChatId } = storeToRefs(filebasedPlaybackStore)
const authStore = useAuthStore()
const isJoinPending = ref(false)

watch(isInSession, (isInSession) => {
  if (isInSession) {
    isJoinPending.value = false
  }
})

onMounted(() => {
  authStore.isAuthenticated()
})

</script>

<template>
  <div>

    <div v-if="!isInSession" class="  ">
      <h1 class="text-xl my-3 text-justify">This is the place where you will be able to listen to
        <span class="bg-gradient-to-br from-primary-700 to-rose-500 text-transparent bg-clip-text font-bold">music</span>
        with your friends!
      </h1>
      <div class="flex items-center justify-center">
        <Button class="text-xl p-6 w-52" @click="isJoinPending=true; joinFilebasedPlayback(chatId ? chatId : 402)">
          <HollowDotsSpinner v-if="isJoinPending"/>
          <span v-else>Join playback now!</span>
        </Button>
      </div>
    </div>

    <ErrorMessage v-if="isError">Error while joining playback</ErrorMessage>
    <div v-if="isInSession && !isError">
      <div class="flex">
        <PlaybackControls class="my-2"/>
        <span class="flex-1"></span>
        <SimpleTooltip onHoverText="quit session">
          <IconLogout @click="quitSession()" class="float-end w-8">Quit</IconLogout>
        </SimpleTooltip>
      </div>
      <Alert v-if="chatId !== sessionChatId" variant="destructive">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Careful!</AlertTitle>
        <AlertDescription>
          This session is not from this chat
        </AlertDescription>
      </Alert>
      <CurrentlyListeningUsers :users="playbackData['active_users']" class="my-2"/>
      <SongQueueTable :music="queue" :backtrack='backtrack' class="mb-2"/>
      <FilesInput :playbackData="playbackData" @update:playbackData="splitSongQueue"/>
    </div>
  </div>
</template>

<style scoped>

</style>