<script setup>

import IconNewChat from "@/components/icons/IconNewChat.vue";
import ChatPreview from "@/components/ChatPreview.vue";
import { ScrollArea } from "@/components/ui/scroll-area/index.js";
import { useChatStore } from "@/store/chatStore.js";
import { storeToRefs } from "pinia";
import router from "@/router/router.js";
import { computed } from "vue";
import { useContactStore } from "@/store/contactStore.js";

const props = defineProps(['id', 'isCreatingNewChat', 'currentChat'])
const emit = defineEmits(['update:isCreatingNewChat', 'update:currentChat'])

const chatStore = useChatStore()
const chatRefs = storeToRefs(chatStore)

const contactStore = useContactStore()
const contactRefs = storeToRefs(contactStore)

const chats = computed(() => {
  return !!chatRefs.chats.value;
})

function viewChat(chat) {
  emit('update:isCreatingNewChat', false)
  emit('update:currentChat', chat.id)
  router.push({ path: `/chat/${chat.id}` })
}

function toggleChat() {
  emit('update:isCreatingNewChat', !props.isCreatingNewChat)
}

function isCurrentChat(chatId) {
  return Number(props.id) === chatId
}

</script>

<template>
  <ScrollArea class="h-[75vh]">
    <div v-if="chats" v-for="chat in chatRefs.chats.value"
         @click="viewChat(chat)" class="cursor-pointer first:mt-20 pl-2 pr-4">
      <ChatPreview :chat="chat" :contactRefs="contactRefs"
                   :isCurrentChat="isCurrentChat(chat.id)"></ChatPreview>
    </div>
  </ScrollArea>
  <div class="absolute top-0 w-full border-b rounded-t backdrop-blur drop-shadow h-16 flex justify-center flex-col">
    <div class="*:inline-block">
      <IconNewChat @click="toggleChat();"
                   class="w-8 m-2 float-end cursor-pointer"></IconNewChat>
    </div>
  </div>
</template>