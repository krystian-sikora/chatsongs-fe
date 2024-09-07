<script setup>

import AudioPlayer from "@/components/filebasedplayback/AudioPlayer.vue";


</script>

<template>
  <main>
    <RouterView/>
<!--    Global svg gradient def -->
    <svg style="position: absolute; width: 0; height: 0">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4a238e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f43f5e;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>
    <AudioPlayer/>
  </main>
</template>
