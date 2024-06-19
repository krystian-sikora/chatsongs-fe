<script setup>

import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/store/chatStore.js";
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import ChatPreview from "@/components/ChatPreview.vue";
import { Button } from "@/components/ui/button/index.js";
import Chat from "@/components/Chat.vue";
import { ScrollArea } from "@/components/ui/scroll-area/index.js";
import CreateChat from "@/components/CreateChat.vue";
import router from "@/router/router.js";

const props = defineProps(['id'])

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const token = authRefs.tokens.value['access_token']

const chatStore = useChatStore()
const chatRefs = storeToRefs(chatStore)

const chats = computed(() => {
  return !!chatRefs.chats.value;
})

const currentChat = ref(chatRefs.chats.value[0])
const isCreatingNewChat = ref(false)

function loadChat() {
  if (props.id && chatRefs.chats.value.length !== 0) {
    currentChat.value = chatRefs.chats.value.find(c => c.id === Number(props.id))
    return
  }

  if (props.id) {
    watch(
        () => chatStore.chats,
        (newChats) => {
          if (newChats.length > 0) {
            currentChat.value = chatRefs.chats.value.find(c => c.id === Number(props.id))
          }
        }
    )
    return
  }

  if (chatStore.chats.length !== 0) {
    router.push(`chat/${chatStore.chats[0].id}`)
    return
  }

  watch(
      () => chatStore.chats,
      (newChats) => {
        if (newChats.length > 0) {
          router.push(`chat/${newChats[0].id}`)
        }
      }
  )
}

onMounted(() => {
  if (!token) return

  chatStore.getChats(token)

  loadChat()
})

onUpdated(() => {
  loadChat()
})

function createDummyChat() {
  const id = authRefs.user.value['id']
  chatStore.createChat(token, [id, id+1])
}

function viewChat(chat) {
  isCreatingNewChat.value = false
  currentChat.value = chat
  router.push({ path: `/chat/${chat.id}` })
}

function updateIsCreatingNewChat(bool) {
  isCreatingNewChat.value = bool
  loadChat()
}

</script>

<template>
  <div class="h-6" >
    <h1 v-if="authRefs.tokens.value['access_token']">Hello, {{ authRefs.user.value['nickname']}}</h1>
    <div class="grid grid-cols-12 h-5/6">

      <ScrollArea class="col-span-3 p-6 border rounded-md mx-5 pt-20">
        <Button @click="isCreatingNewChat=!isCreatingNewChat" class="absolute top-5">Create new chat</Button>
        <div v-if="chats" v-for="chat in chatRefs.chats.value" @click="viewChat(chat)" class="cursor-pointer">
          <ChatPreview v-bind:chat="chat"></ChatPreview>
        </div>
      </ScrollArea>

      <div class="col-span-8 p-6 border rounded-md mx-5">
        <CreateChat class="h-[75vh]" v-if="isCreatingNewChat"
                    :currentChat="currentChat"
                    :isCreatingNewChat="isCreatingNewChat"
                    @update:isCreatingNewChat="updateIsCreatingNewChat">
        </CreateChat>
        <Chat class="h-[75vh]" v-else-if="props.id && currentChat" :currentChat="currentChat"></Chat>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>