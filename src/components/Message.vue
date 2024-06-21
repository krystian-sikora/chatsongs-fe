<script setup>

import { Avatar } from "@/components/ui/avatar/index.js";
import { computed, onMounted, onUpdated, ref } from "vue";

const props = defineProps(['message', 'authRefs', 'contactRefs'])

const senderId = ref()
const userId = ref()

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
}

</script>

<template>
  <div v-if="isUserMessage" class="float-right">
    <h1 class="inline-block border rounded-md my-2 p-2 max-w-[calc(100%-112px)] ml-[56px]"> {{ props.message.content }} </h1>
    <div class="inline-block float-right">
      <Avatar class="my-2 mx-2 flex drop-shadow">
        {{ props.authRefs.user.value.nickname.substring(0,1) }}
      </Avatar>
    </div>
  </div>
  <div v-else-if="sender">
    <Avatar class="my-2 mx-2 float-left drop-shadow">
      {{ sender.nickname.substring(0,1) }}
    </Avatar>
    <h1 class="inline-block border rounded-md my-2 p-2 max-w-[calc(100%-112px)]"> {{ props.message.content }} </h1>
  </div>
  <div v-else>
    <Avatar class="my-2 mx-2 float-left drop-shadow">
      null
    </Avatar>
    <h1 class="inline-block border rounded-md my-2 p-2 max-w-[calc(100%-112px)]"> {{ props.message.content }} </h1>
  </div>
  <div class="clear-both"></div>
</template>
