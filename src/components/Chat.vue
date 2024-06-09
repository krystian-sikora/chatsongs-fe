<script setup>

import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button/index.js";
import { ref } from "vue";

const props = defineProps(['chat', 'stompClient'])

const chatInput = ref('')

function sendMessage() {
  console.log(chatInput.value)
  chatInput.value = ''
}

</script>

<template>
  <h1 class="mb-auto">Selected chat: {{ props.chat }}</h1>
  <div class="flex">messages</div>
  <div>
    <Input type="text" v-model="chatInput"></Input>
    <Button class="inline" @click="sendMessage()">Send</Button>
  </div>
</template>

<style scoped>

</style>