<script setup>

import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/store/chatStore.js";
import { onMounted, onUpdated, ref, watch } from "vue";
import Chat from "@/components/Chat.vue";
import CreateChat from "@/components/CreateChat.vue";
import router from "@/router/router.js";
import IconChats from "@/components/icons/IconChats.vue";
import ChatPreviewsArea from "@/components/ChatPreviewsArea.vue";
import { useContactStore } from "@/store/contactStore.js";

const props = defineProps(['id'])

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const token = authRefs.tokens.value['access_token']

const chatStore = useChatStore()
const chatRefs = storeToRefs(chatStore)

const contactStore = useContactStore()
const contactRefs = storeToRefs(contactStore)

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
  contactStore.getContacts(token)

  loadChat()
})

onUpdated(() => {
  loadChat()
})

function updateIsCreatingNewChat(bool) {
  isCreatingNewChat.value = bool
  loadChat()
}

function updateCurrentChat(id) {
  currentChat.value = chatRefs.chats.value.find(c => c.id === id)
}

</script>

<template>
  <div>
    <h1 v-if="authRefs.tokens.value['access_token']">Hello, {{ authRefs.user.value['nickname']}}</h1>
    <div class="flex *:ml-3 last:mr-3">
      <div class="flex-none border rounded-md ">
        <IconChats class="w-10 m-2"></IconChats>
      </div>
      <div class="flex-initial w-1/6 border rounded-md relative">
        <ChatPreviewsArea :isCreatingNewChat="isCreatingNewChat" :currentChat="currentChat" :id="props.id"
                          @update:isCreatingNewChat="updateIsCreatingNewChat"
                          @update:currentChat="updateCurrentChat">
        </ChatPreviewsArea>
      </div>
      <div class="flex-initial w-[1200px] border rounded-md">
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
