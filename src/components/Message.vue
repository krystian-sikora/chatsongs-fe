<script setup>

import { Avatar } from "@/components/ui/avatar/index.js";
import {computed, onMounted, onUpdated, ref, watch} from "vue";
import {useContactStore} from "@/store/contactStore.js";
import {storeToRefs} from "pinia";

const props = defineProps(['message', 'authRefs', 'contactRefs'])

const senderId = ref()
const userId = ref()

const contactStore = useContactStore()
const contactRefs = storeToRefs(contactStore)

const isUserMessage = computed(() => props.message.senderId === props.authRefs.user.value.id)

const sender = computed(() => props.contactRefs.contacts.value.find(c => c.id === senderId.value))

onMounted(() => {
  evalMessage()
})

onUpdated(() => {
  evalMessage()
})

async function evalMessage() {
  senderId.value = props.message.senderId
  userId.value = props.authRefs.user.value.id
  // if (isUserMessage.value) return
  // sender.value = props.contactRefs.contacts.value.find(c => c.id === senderId.value)
  // console.log(props.contactRefs.contacts.value)
  // console.log('sender: ', sender.value)
  // console.log(`Evaluating message: ${props.message.content}\nWith sender id: ${senderId.value}\nisUserMessage: ${isUserMessage.value}`)
}

</script>

<template>
  <div v-if="isUserMessage" class="float-right">
    <h1 class="inline-block border rounded-md my-2 p-2 max-w-[calc(100%-112px)] ml-[56px]"> {{ props.message.content }} </h1>
    <div class="inline-block float-right">
      <Avatar class="my-2 mx-2 flex">
        {{ props.authRefs.user.value.nickname.substring(0,1) }}
      </Avatar>
    </div>
  </div>
  <div v-else-if="sender">
    <Avatar class="my-2 mx-2 float-left">
      {{ sender.nickname.substring(0,1) }}
    </Avatar>
    <h1 class="inline-block border rounded-md my-2 p-2 max-w-[calc(100%-112px)]"> {{ props.message.content }} </h1>
  </div>
  <div v-else>
    <Avatar class="my-2 mx-2 float-left">
      null
    </Avatar>
    <h1 class="inline-block border rounded-md my-2 p-2 max-w-[calc(100%-112px)]"> {{ props.message.content }} </h1>
  </div>
  <div class="clear-both"></div>
</template>

<style scoped>

</style>