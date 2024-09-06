<script setup>

import IconResumeSong from "@/components/icons/IconResumeSong.vue";
import IconPauseSong from "@/components/icons/IconPauseSong.vue";
import IconPreviousSong from "@/components/icons/IconPreviousSong.vue";
import { previous, next, play, pause } from "@/components/filebasedplayback/playback.js";
import { useFilebasedPlaybackStore } from "@/store/filebasedPlaybackStore.js";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const pbStore = useFilebasedPlaybackStore()
const { isPlaying, queue, backtrack } = storeToRefs(pbStore)

const hasPrevious = computed(() => backtrack.value.length > 0)
const hasNext = computed(() => queue.value.length > 1)
const isEmpty = computed(() => queue.value.length === 0)

function handlePlay() {
  if (isEmpty.value) return
  isPlaying.value = play()
}

function handlePause() {
  isPlaying.value = pause()
}

function handlePrevious() {
  if (!isEmpty || hasPrevious) previous()
}

function handleNext() {
  if (hasNext.value) next()
}

</script>

<template>
  <div class="*:w-5 *:h-6 -my-1 py-1 px-5 flex rounded-2xl bg-white drop-shadow shadow-accent space-x-2 w-fit">
    <IconPreviousSong @click="handlePrevious" :color="!isEmpty || hasPrevious ? null : '#b8b3b3'" :class="!isEmpty || hasPrevious ? 'hover:cursor-pointer' : ''"/>
    <IconResumeSong v-if="!isPlaying || isEmpty" @click="handlePlay" :color="isEmpty ? '#b8b3b3' : null" :class="!isEmpty ? 'hover:cursor-pointer' : ''"/>
    <IconPauseSong v-else @click="handlePause" class="hover:cursor-pointer"/>
    <IconPreviousSong class="rotate-180" @click="handleNext" :color="hasNext ? null: '#b8b3b3'" :class="hasNext ? 'hover:cursor-pointer' : ''"/>
  </div>
</template>

<style scoped>

</style>