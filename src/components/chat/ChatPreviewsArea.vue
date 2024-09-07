<script setup>

import IconNewChat from "@/components/icons/IconNewChat.vue";
import ChatPreview from "@/components/chat/ChatPreview.vue";
import { ScrollArea } from "@/components/ui/scroll-area/index.js";
import { useChatStore } from "@/store/chatStore.js";
import { storeToRefs } from "pinia";
import router from "@/router/router.js";
import { computed, ref, watch } from "vue";
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

console.log(chatRefs.chats.value)

watch(chatRefs.chats.value , (newChats) => {
  let x = new Array(...newChats)
  filteredChats.value = x.sort((c1, c2) => {
    let date1 = new Date(c1.messages.length === 0 ? c1.created_at : c1.messages[c1.messages.length - 1]?.createdAt);
    let date2 = new Date(c2.messages.length === 0 ? c2.created_at : c2.messages[c2.messages.length - 1]?.createdAt);
    return date2 - date1;
  })
})

function sortByMessages(c1, c2) {
  console.log('sorting')
  return
}

const filteredChats = ref([...chatRefs.chats.value])

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
  <div class="bg-secondary h-max lg:rounded-md">
    <ScrollArea class="h-[calc(100vh-60px)] lg:rounded-md">
      <div v-for="chat in filteredChats" v-if="chats"
           class="cursor-pointer first:mt-20 pl-2 pr-2 last:mb-20" @click="viewChat(chat)">
        <ChatPreview :chat="chat" :contactRefs="contactRefs" :isCurrentChat="isCurrentChat(chat.id)"
                     :lastMsg="chat.messages[chat.messages.length - 1]"
                     :isCurrentPlayback="isCurrentPlayback(chat.id)"/>
      </div>
      <div v-if="chatRefs.chats.value.length === 0" class="mt-20 first:mt-20 pl-2 pr-4">
        <DummyChatPreview @click="[emit('update:showChatPreviews', false), emit('update:isCreatingNewChat', false)]" class="rounded-md bg-secondary drop-shadow hover:cursor-pointer"/>
      </div>
    </ScrollArea>
    <div class="absolute bottom-0 w-full drop-shadow h-16 justify-center flex-col flex lg:hidden">
      <SidebarIcons class="rounded-md bg-white mx-4 mb-2 py-1 drop-shadow flex justify-center space-x-7 *:w-10 *:p-1"/>
    </div>
    <div class="absolute top-0 w-full border-b rounded-t-md backdrop-blur drop-shadow h-16 flex justify-center flex-col">
      <div class="*:inline-block">
        <IconNewChat class="drop-shadow w-7 m-2 float-end cursor-pointer"
                     @click="toggleChat();"/>
      </div>
    </div>
  </div>
</template>