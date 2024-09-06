<script setup>

import { Avatar } from "@/components/ui/avatar/index.js";
</script>

<template>
  <div class="rounded-md bg-gradient-to-br from-primary-700 to-rose-500 drop-shadow">
    <div class="inline-block">
      <Avatar class="my-2 mx-2 drop-shadow">
        W
      </Avatar>
    </div>
    <div class="inline-block contain-inline-size w-[calc(100%-56px)] my-auto align-middle pr-2">
      <p class="truncate text-primary-50 font-bold"> Welcome! </p>
      <p class="truncate text-primary-100"> glad you are with us. </p>
    </div>
  </div>
</template>

<style scoped>

</style>