<script setup>

import IconThreeDots from "@/components/icons/IconThreeDots.vue";
import { Button } from "@/components/ui/button/index.js";
import { Input } from "@/components/ui/input/index.js";
import IconBack from "@/components/icons/IconBack.vue";
import { ScrollArea } from "@/components/ui/scroll-area/index.js";
import IconMusicNote from "@/components/icons/IconMusicNote.vue";

const emit = defineEmits(['update:showChatPreviews'])

function updateShowChatPreviews() {
  emit('update:showChatPreviews', true)
}
</script>

<template>
  <div class="relative">
    <ScrollArea ref="scrollAreaRef" class="h-[100%] px-1 md:px-6 text-center first:pt-52 last:pb-16">
      <h1 class="text-3xl">
        This is the place you will chat and
        <span class="drop-shadow-[1px_1px_1px_rgba(255,255,255,1)] bg-gradient-to-br from-primary-700 to-rose-500 text-transparent bg-clip-text font-bold">
            co-listen to music
        </span>
        with friends! But first...
      </h1>

      <p>You should invite someone and create a chat with them!</p>
    </ScrollArea>
    <div class="hi border-b rounded-t-md px-2 md:px-6 h-16 absolute top-0 w-full backdrop-blur drop-shadow flex justify-center flex-col">
      <div>
        <IconBack @click="updateShowChatPreviews" class="lg:hidden inline-block w-6 mr-3 hover:cursor-pointer "/>
        <h1 class="inline-block align-middle truncate contain-inline-size w-[calc(100%-88px-36px)]">
          <span class="drop-shadow-[1px_1px_1px_rgba(255,255,255,1)] bg-gradient-to-br from-primary-700 to-rose-500 text-transparent bg-clip-text font-bold">
            Welcome
          </span>
        </h1>
        <div class="*:inline-block *:w-6 *:ml-5 hover:cursor-not-allowed float-end drop-shadow">
          <IconMusicNote/>
          <IconThreeDots fillColor="fill-white"/>
        </div>
      </div>
    </div>
    <div class="absolute bottom-[2vh] px-5 flex w-full bg-transparent">
      <Input class="inline-block w-[100%] mx-2 drop-shadow" type="text" disabled/>
      <Button class="inline-block drop-shadow" disabled>Send</Button>
    </div>
  </div>
</template>

<style scoped>

</style>