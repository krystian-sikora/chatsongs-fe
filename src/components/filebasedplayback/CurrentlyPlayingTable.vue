<script setup>

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table/index.js";
import IconThreeDots from "@/components/icons/IconThreeDots.vue";
import { ref } from "vue";
import IconPauseSong from "@/components/icons/IconPauseSong.vue";
import { useFilebasedPlaybackStore } from "@/store/filebasedPlaybackStore.js";
import { storeToRefs } from "pinia";
import IconResumeSong from "@/components/icons/IconResumeSong.vue";
import { pause, play, skipTo } from "@/components/filebasedplayback/playback.js";

const { music } = defineProps(['music'])
const hoverMap = ref(new Map())

const pbStore = useFilebasedPlaybackStore()
const { isPlaying } = storeToRefs(pbStore)

function alterState() {
  if (isPlaying.value) {
    isPlaying.value = pause()
  } else isPlaying.value = play()
}

</script>

<template>
  <h1 class="text-sm my-4" v-if="music.length === 0">
    There are currently no songs in the queue. Add some songs below to start listening!
  </h1>

  <Table>
    <TableHeader>
      <TableRow>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(songQueueObj, index) in music" :key="songQueueObj.id"
                :class="index === 0 ? 'bg-gradient-to-br from-primary-700 to-rose-500 text-transparent bg-clip-text font-bold': '' "
                class="hover:cursor-pointer"
                @click="index === 0 ? alterState() : skipTo(index)"
                @mouseover="hoverMap.set(index, true)" @mouseleave="hoverMap.set(index, false)">
        <TableCell v-if="index === 0" class="relative w-10">
          <IconPauseSong v-if="hoverMap.get(index) & isPlaying" class="absolute top-[calc(50%-10px)] left-[calc(50%-10px)] w-5"/>
          <IconResumeSong v-else-if="hoverMap.get(index) & !isPlaying" class="absolute top-[calc(50%-10px)] left-[calc(50%-10px)] w-5"/>
          <span v-else>{{ index }}</span>
        </TableCell>
        <TableCell v-else class="relative w-10">
          <IconResumeSong v-if="hoverMap.get(index)" class="absolute top-[calc(50%-10px)] left-[calc(50%-10px)] w-5"/>
          <span v-else>{{ index }}</span>
        </TableCell>
        <TableCell class="text-xs">
          {{ songQueueObj.song.name }}
        </TableCell>
        <TableCell class="text-right">
          <IconThreeDots class="w-5 "/>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
