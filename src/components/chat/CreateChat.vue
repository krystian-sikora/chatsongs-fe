<script setup>

import { Input } from '@/components/ui/input/index.js'
import { useContactStore } from "@/store/contactStore.js";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/store/authStore.js";
import { Avatar } from "@/components/ui/avatar/index.js";
import { Checkbox } from "@/components/ui/checkbox/index.js";
import { Button } from '@/components/ui/button/index.js'
import { useChatStore } from "@/store/chatStore.js";
import Badge from "../ui/badge/Badge.vue";
import IconBack from "@/components/icons/IconBack.vue";
import Contacts from "@/components/Contacts.vue";
import { ScrollArea } from "@/components/ui/scroll-area/index.js";

const props = defineProps(['currentChat', 'isCreatingNewChat'])
const emit = defineEmits(['update:isCreatingNewChat', 'update:showChatPreviews'])

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)
const token = authRefs.tokens.value['access_token']

const chatStore = useChatStore()

const contactStore = useContactStore()
const contactRefs = storeToRefs(contactStore)

const searchInput = ref('')
const toInvite = ref([])

const filteredContacts = computed(() => {
  return contactRefs.contacts.value.filter(contact => {
    return contact['nickname'].toLowerCase().indexOf(searchInput.value) !== -1
  })
})

function checkboxClick(contactId) {
  if (toInvite.value.indexOf(contactId) === -1) {
    toInvite.value.push(contactId)
  } else {
    toInvite.value.splice(toInvite.value.indexOf(contactId), 1)
  }
}

function isChecked(contactId) {
  return toInvite.value.indexOf(contactId) !== -1
}

function create() {
  emit('update:isCreatingNewChat', false)
  chatStore.createChat(token, toInvite.value)
}

onMounted(() => {
  contactStore.getContacts(token)
})

function deleteInvite(id) {
  let index = toInvite.value.indexOf(id)
  toInvite.value.splice(index, 1)
}

function updateShowChatPreviews() {
  emit('update:showChatPreviews', true)
}

</script>

<template>
  <div class="relative">
    <div class="font-bold border-b rounded-t-md px-2 md:px-6 h-16 w-full backdrop-blur drop-shadow flex justify-center flex-col">
      <div>
        <IconBack @click="updateShowChatPreviews" class="lg:hidden inline-block w-6 mr-3 hover:cursor-pointer "/>
        <h1 class="drop-shadow-[1px_1px_1px_rgba(255,255,255,1)] bg-gradient-to-br from-primary-700 to-rose-500 text-transparent bg-clip-text font-bold inline-block align-middle">
          Create new chat
        </h1>
<!--        <Input v-model="searchInput" class="inline-block mr-3 w-1/2" placeholder="Search"></Input>-->
<!--        <Button class="inline-block" @click="create()">Create chat</Button>-->
      </div>
    </div>
    <div>
      <div class="flex mt-4 mx-2" :class="toInvite.length === 0 ? 'mb-[2.3rem]' : 'mb-1'">
        <Input v-model="searchInput" class="flex-1 mr-3 shrink" placeholder="Search"></Input>
        <Button class="flex-initial" @click="create()">Create</Button>
      </div>
      <Badge v-for="id in toInvite" class="ml-2 -mr-1 bg-gradient-to-br from-primary-700 to-rose-500">
        <p>{{ contactRefs.contacts.value.find(c => c.id === id).nickname }}
          <a class="cursor-pointer font-light" @click="deleteInvite(id);"> X </a>
        </p>
      </Badge>
      <ScrollArea class="bg-white rounded-md mx-2 my-2 h-56 drop-shadow">
        <div v-for="contact in filteredContacts" class="w-fit p-2 hover:cursor-pointer" @click="checkboxClick(contact['id'])">
          <Checkbox :checked="isChecked(contact['id'])"
                    class="mx-2 border-gray-300 align-middle"/>
          <Avatar class="mx-2 drop-shadow">
            {{ contact['nickname'].substring(0, 1) }}
          </Avatar>
          <span>{{ contact['nickname'] }}</span>
        </div>
      </ScrollArea>

<!--      If you don't see the person you're looking for, you can invite them by entering their user code below:-->
      <Contacts noX="true"/>
    </div>
  </div>
</template>
