<script setup>

import { useAuthStore } from "@/store/authStore.js";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/store/chatStore.js";
import { onMounted, onUpdated, ref, watch } from "vue";
import Chat from "@/components/Chat.vue";
import CreateChat from "@/components/CreateChat.vue";
import router from "@/router/router.js";
import ChatPreviewsArea from "@/components/ChatPreviewsArea.vue";
import { useContactStore } from "@/store/contactStore.js";
import SidebarIcons from "@/components/SidebarIcons.vue";

const props = defineProps(['id'])

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const token = authRefs.tokens.value['access_token']

const chatStore = useChatStore()
const chatRefs = storeToRefs(chatStore)

const contactStore = useContactStore()

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
    router.push(`chat/${ chatStore.chats[0].id }`)
    return
  }

  watch(
      () => chatStore.chats,
      (newChats) => {
        if (newChats.length > 0) {
          router.push(`chat/${ newChats[0].id }`)
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

const showChatPreviews = ref(false)

function updateShowChatPreviews(bool) {
  showChatPreviews.value = bool
  console.log(bool)
}

</script>

<template>
  <div class="lg:mt-3 overflow-x-hidden">
<!--    <h1 v-if="authRefs.tokens.value['access_token']">Hello, {{ authRefs.user.value['nickname'] }}</h1>-->
    <div class="flex lg:*:ml-3 lg:last:mr-3">
      <div class="flex-none border rounded-md *:p-1 *:w-10 *:m-2 *:hover:cursor-pointer hidden lg:block">
        <SidebarIcons/>
      </div>
      <div class="flex-1 max-w-72 border rounded-md lg:block transition-transform duration-300 fixed top-0 left-0 z-30 w-64 lg:relative lg:ml-3 lg:translate-x-0"
           :class="showChatPreviews ? 'translate-x-0' : '-translate-x-full'">
        <ChatPreviewsArea :id="props.id" :currentChat="currentChat" :isCreatingNewChat="isCreatingNewChat"
                          @update:isCreatingNewChat="updateIsCreatingNewChat"
                          @update:currentChat="updateCurrentChat"
                          @update:showChatPreviews="updateShowChatPreviews">
        </ChatPreviewsArea>
      </div>
<!--      The *:h-[calc(100vh-60px)] subtracts mobile web browser ui so the app won't need scrolling.
          This might not be an issue in PWA?

          The md:*:h-[calc(100vh-1.5rem)] subtracts margins that are only on medium+ screens -->
      <div class="flex-1 transition-transform duration-300 w-[1200px] border rounded-md *:h-[calc(100vh-60px)] lg:*:h-[calc(100vh-1.5rem)] relative"
           :class="showChatPreviews ? 'transform translate-x-64' : 'transform translate-x-0'">
        <CreateChat v-if="isCreatingNewChat" :currentChat="currentChat"
                    :isCreatingNewChat="isCreatingNewChat"
                    @update:isCreatingNewChat="updateIsCreatingNewChat"
                    @update:showChatPreviews="updateShowChatPreviews">
        </CreateChat>
        <Chat v-else-if="props.id && currentChat" :currentChat="currentChat"
              @update:showChatPreviews="updateShowChatPreviews">
        </Chat>
      </div>
    </div>
  </div>
</template>
