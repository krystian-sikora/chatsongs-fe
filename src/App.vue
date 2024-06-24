<script setup>
import { useAuthStore } from "@/store/authStore.js";

const authStore = useAuthStore()
</script>

<template>
  <Button @click="authStore.logout()">Sign out</Button>
  <main>
    <RouterView/>
  </main>
</template>
