<script setup>

import IconInviteUser from "@/components/icons/IconInviteUser.vue";
import IconChats from "@/components/icons/IconChats.vue";
import { useAuthStore } from "@/store/authStore.js";
import IconLogout from "@/components/icons/IconLogout.vue";
import router from "@/router/router.js";

const authStore = useAuthStore()
</script>

<template>
  <IconChats class="rounded-md bg-gray-200 drop-shadow"></IconChats>
  <IconInviteUser @click="router.push({ path: '/contacts' })"></IconInviteUser>
  <IconLogout @click="authStore.logout()"/>
  <h1 @click="router.push({ path: '/test' })">FILES</h1>
</template>

<style scoped>

</style>