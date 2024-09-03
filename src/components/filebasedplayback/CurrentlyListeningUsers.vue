<script setup>

import { Avatar } from "@/components/ui/avatar/index.js";
import Tooltip from "@/components/SimpleTooltip.vue";

const { users } = defineProps(['users'])

</script>

<template>
  <div>
    <h2 class="inline-block mr-2">Currently listening:</h2>
    <div v-for="user in users" :key="user.id" class="*:-mr-4 inline-block">
      <Tooltip :onHoverText="user.nickname">
        <Avatar class="border-2 border-white">
          {{ user.nickname.substring(0, 5) }}
        </Avatar>
      </Tooltip>
    </div>
  </div>
</template>

<style scoped>

</style>