<script setup>
import { Avatar } from "@/components/ui/avatar/index.js";
import { computed, onUpdated, ref } from "vue";
import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import IconMusicSingleNote from "@/components/icons/IconMusicSingleNote.vue";

const props = defineProps(['id', 'chat', 'isCurrentChat', 'contactRefs', 'lastMsg', 'isCurrentPlayback'])

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const messagePreview = ref(constructMsgPreview())

function constructMsgPreview() {
  if (props.chat.messages.length === 0) return ''

  let msgContent = props.lastMsg.content
  let isUserMessage = props.lastMsg.senderId === authRefs.user.value.id

  if (isUserMessage) return `You: ${ msgContent }`

  let sender = computed(() => props.contactRefs.contacts.value.find(c => c.id === props.lastMsg.senderId))
  if (!sender.value) return `Unknown: ${ msgContent }`
  return `${ sender.value.nickname }: ${ msgContent }`
}

onUpdated(() => {
  messagePreview.value = constructMsgPreview()
})

</script>

<template>
  <div :class="props.isCurrentChat ? 'rounded-md bg-gray-200 drop-shadow' : ''"
       class="hover:rounded-md hover:bg-gray-200 hover:drop-shadow mb-1">
    <div class="inline-block relative">
      <Avatar class="my-2 mx-2 drop-shadow">
        {{ props.chat.name.substring(0, 1) }}
      </Avatar>

    </div>
    <div class="inline-block contain-inline-size w-[calc(100%-56px)] my-auto align-middle pr-2">

      <p class="truncate">
        <IconMusicSingleNote v-if="props.isCurrentPlayback" class="w-4 -mr-1 animate-pulse inline-block self-baseline"/>
        {{ props.chat.name }}
      </p>
      <p class="truncate text-gray-500"> {{ messagePreview }}</p>
    </div>
  </div>
</template>
