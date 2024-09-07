<script setup>

import IconNewChat from "@/components/icons/IconNewChat.vue";
import ChatPreview from "@/components/chat/ChatPreview.vue";
import { ScrollArea } from "@/components/ui/scroll-area/index.js";
import { useChatStore } from "@/store/chatStore.js";
import { storeToRefs } from "pinia";
import router from "@/router/router.js";
import { computed } from "vue";
import { useContactStore } from "@/store/contactStore.js";
import SidebarIcons from "@/components/SidebarIcons.vue";
import DummyChatPreview from "@/components/chat/DummyChatPreview.vue";
import { usePlaybackStore } from "@/store/playbackStore.js";

const props = defineProps(['id', 'isCreatingNewChat', 'currentChat'])
const emit = defineEmits(['update:isCreatingNewChat', 'update:currentChat', "update:showChatPreviews"])

const chatStore = useChatStore()
const chatRefs = storeToRefs(chatStore)

const contactStore = useContactStore()
const contactRefs = storeToRefs(contactStore)

const playbackRefs = storeToRefs(usePlaybackStore())

const chats = computed(() => {
  return !!chatRefs.chats.value;
})

function viewChat(chat) {
  emit('update:showChatPreviews', false)
  if (window.screen.width >= 1024) {
    handleChatEmits(chat)
  } else {
    setTimeout(() => {
      handleChatEmits(chat)
    }, 300)
  }
}

function handleChatEmits(chat) {
  emit('update:isCreatingNewChat', false)
  emit('update:currentChat', chat.id)
  router.push({ path: `/chat/${chat.id}` })
}

function toggleChat() {
  emit('update:showChatPreviews', false)
  if (window.screen.width >= 1024) {
    emit('update:isCreatingNewChat', true)
  } else {
    setTimeout(() => {
      emit('update:isCreatingNewChat', true)
    }, 300)
  }
}

function isCurrentChat(chatId) {
  return Number(props.id) === chatId
}

function isCurrentPlayback(chatId) {
  return playbackRefs.currentPlayback.value && playbackRefs.currentPlayback.value.chat_id === chatId
}


</script>

<template>
  <div class="bg-secondary h-max md:rounded-md">
    <ScrollArea class="h-[calc(100vh-60px)] md:rounded-md">
      <div v-for="chat in chatRefs.chats.value" v-if="chats"
           class="cursor-pointer first:mt-20 pl-2 pr-2" @click="viewChat(chat)">
        <ChatPreview :chat="chat" :contactRefs="contactRefs" :isCurrentChat="isCurrentChat(chat.id)"
                     :lastMsg="chat.messages[chat.messages.length - 1]"
                     :isCurrentPlayback="isCurrentPlayback(chat.id)"/>
      </div>
      <div v-if="chatRefs.chats.value.length === 0" class="mt-20 first:mt-20 pl-2 pr-4">
        <DummyChatPreview @click="[emit('update:showChatPreviews', false), emit('update:isCreatingNewChat', false)]" class="rounded-md bg-secondary drop-shadow hover:cursor-pointer"/>
      </div>
    </ScrollArea>
    <div class="absolute bottom-0 w-full border-t drop-shadow h-16 justify-center flex-col flex lg:hidden">
      <SidebarIcons class="rounded-md bg-white m-1 py-1 drop-shadow flex justify-center space-x-7 *:w-10 *:p-1"/>
    </div>
    <div class="absolute top-0 w-full border-b rounded-t-md backdrop-blur drop-shadow h-16 flex justify-center flex-col">
      <div class="*:inline-block">
        <IconNewChat class="drop-shadow w-7 m-2 float-end cursor-pointer"
                     @click="toggleChat();"/>
      </div>
    </div>
  </div>
</template>