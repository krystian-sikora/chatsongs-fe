<script setup>

import IconInviteUser from "@/components/icons/IconInviteUser.vue";
import IconChats from "@/components/icons/IconChats.vue";
import { useAuthStore } from "@/store/authStore.js";
import IconLogout from "@/components/icons/IconLogout.vue";

const authStore = useAuthStore()
</script>

<template>
  <IconChats class="rounded-md bg-gray-200 drop-shadow"></IconChats>
  <IconInviteUser class=""></IconInviteUser>
  <IconLogout @click="authStore.logout()"/>
</template>

<style scoped>

</style>