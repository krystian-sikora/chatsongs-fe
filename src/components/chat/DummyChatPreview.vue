<script setup>

import { Avatar } from "@/components/ui/avatar/index.js";
</script>

<template>
  <div class="rounded-md bg-gray-200 drop-shadow">
    <div class="inline-block">
      <Avatar class="my-2 mx-2 drop-shadow">
        W
      </Avatar>
    </div>
    <div class="inline-block contain-inline-size w-[calc(100%-56px)] my-auto align-middle pr-2">
      <p class="truncate"> Welcome! </p>
      <p class="truncate text-gray-500"> glad you are with us. </p>
    </div>
  </div>
</template>

<style scoped>

</style>