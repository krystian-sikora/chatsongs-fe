<script setup>

import {Avatar} from "@/components/ui/avatar/index.js";
import {computed, onMounted, ref} from "vue";

const props = defineProps(['message', 'authRefs', 'contactRefs'])

const senderId = computed(() => props.message.senderId)
const userId = computed(() => props.authRefs.user.value.id)

const isUserMessage = computed(() => {
  // console.log(`sender: ${senderId.value}, user: ${userId.value}`)
  // console.log('sender? ',props.message.senderId)
  return senderId.value === userId.value
})
const sender = computed(() => {
  if (!isUserMessage.value) {
    return props.contactRefs.contacts.value.find(c => c.id === senderId.value)
  }
  return null
})


onMounted(() => {
  // evalMessage()
})

async function evalMessage() {
  console.log(`Evaluating message: ${props.message.content}\nWith sender id: ${senderId.value}\nisUserMessage: ${isUserMessage.value}`)
}

</script>

<template>
  <div v-if="isUserMessage" class="float-right">
    <h1 class="inline border rounded-md my-2 p-2"> {{ props.message.content }} </h1>
    <div class="inline">
      <Avatar class="my-2 mx-2">
        {{ props.authRefs.user.value.nickname.substring(0,1) }}
      </Avatar>
    </div>
  </div>
  <div v-else v-if="sender">
    <Avatar class="my-2 mx-2">
      {{ sender.nickname.substring(0,1) }}
    </Avatar>
    <h1 class="inline-block border rounded-md my-2 p-2"> {{ props.message.content }} </h1>
  </div>
  <div class="clear-both"></div>
</template>

<style scoped>

</style>