<script setup>

import { Avatar } from "@/components/ui/avatar/index.js";
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import SimpleTooltip from "@/components/SimpleTooltip.vue";

const props = defineProps(['message', 'authRefs'])

const senderId = ref()
const userId = ref()

const isUserMessage = computed(() => props.message.senderId === props.authRefs.user.value?.id)

onMounted(() => {
  evalMessage()
})

onUpdated(() => {
  evalMessage()
})

watch(() => props.authRefs.user.value, () => {
  evalMessage()
})

async function evalMessage() {
  senderId.value = props.message.senderId
  userId.value = props.authRefs.user.value?.id
}

function getDate(createdAt) {
  let date = new Date(createdAt)
  return `Sent at ${ date.toLocaleTimeString() } on ${ date.toLocaleDateString() }`
}

</script>

<template>
  <div>
    <div v-if="isUserMessage" class="float-right">
      <SimpleTooltip :onHoverText="getDate(props.message.createdAt)">
        <h1 class="break-words inline-block bg-gradient-to-br from-primary-700 to-rose-500 text-secondary  border rounded-md mt-2 py-2 px-3 max-w-[calc(100%-112px)] ml-[56px]">
          {{ props.message.content }}
        </h1>
      </SimpleTooltip>
      <div class="inline-block float-right">
        <SimpleTooltip :onHoverText="props.message.senderName">
          <Avatar class="mt-2 mx-2 flex drop-shadow">
            {{ props.authRefs.user.value.nickname.substring(0, 1) }}
          </Avatar>
        </SimpleTooltip>
      </div>
    </div>
    <div v-else>
      <SimpleTooltip :onHoverText="props.message.senderName">
        <Avatar class="mt-2 mx-2 float-left drop-shadow">
          {{ props.message.senderName.substring(0, 1) }}
        </Avatar>
      </SimpleTooltip>
      <SimpleTooltip :onHoverText="getDate(props.message.createdAt)">
        <h1 class="break-words inline-block bg-white border rounded-md mt-2 py-2 px-3 max-w-[calc(100%-112px)]"> {{ props.message.content }} </h1>
      </SimpleTooltip>
    </div>
    <div class="clear-both"></div>
  </div>
</template>
