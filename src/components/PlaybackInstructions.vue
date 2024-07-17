<script setup>

import { Alert } from "@/components/ui/alert/index.js";
import { AlertCircle } from 'lucide-vue-next'

</script>

<template>
  <div>
    <h1><strong>Playback Instructions</strong></h1>
    <ol class="list-decimal *:ml-4">
      <li>Open Spotify</li>
      <li>Start a playlist, album or track</li>
      <li>Click the "Create session" button below</li>
      <li>Anyone who joins the session from now on will synchronize to your playback!</li>
      <li>Enjoy!</li>
    </ol>
    <Alert variant="destructive" class="mt-7">
      <AlertCircle class="w-4 h-4"/>
      <p class="text-xs">Remember that your saved playlists that are set to <strong class="underline">private</strong> will stop everyone from joining your session!</p>
    </Alert>
  </div>
</template>

<style scoped>

</style>