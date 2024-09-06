<script setup>

import IconInviteUser from "@/components/icons/IconInviteUser.vue";
import IconChats from "@/components/icons/IconChats.vue";
import { useAuthStore } from "@/store/authStore.js";
import IconLogout from "@/components/icons/IconLogout.vue";
import router from "@/router/router.js";

const authStore = useAuthStore()
const { fillColor, strokeColor } = defineProps(['fillColor', 'strokeColor'])

</script>

<template>
  <div>
    <IconChats :strokeColor="strokeColor"></IconChats>
    <IconInviteUser @click="router.push({ path: '/contacts' })" :fillColor="fillColor"></IconInviteUser>
    <IconLogout @click="authStore.logout()" :fillColor="fillColor"/>
  </div>
</template>

<style scoped>

</style>