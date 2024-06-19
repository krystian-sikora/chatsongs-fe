<script setup>

import { Input } from '@/components/ui/input'
import { useContactStore } from "@/store/contactStore.js";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/store/authStore.js";
import { Avatar } from "@/components/ui/avatar/index.js";
import { Checkbox } from "@/components/ui/checkbox/index.js";
import { Button } from '@/components/ui/button'
import { useChatStore } from "@/store/chatStore.js";

const props = defineProps(['currentChat', 'isCreatingNewChat'])

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)
const token = authRefs.tokens.value['access_token']

const chatStore = useChatStore()
const chatRefs = storeToRefs(chatStore)

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
  let c = chatStore.createChat(token, toInvite.value)

  props.isCreatingNewChat = false
  props.currentChat = chat['id']
}

onMounted(() => {
  contactStore.getContacts(token)
})

</script>

<template>
  <div>
    <div class="flex mb-2">
      <Input placeholder="Search" v-model="searchInput" class="inline-block mr-3"></Input>
      <Button class="inline-block" @click="create()">Create chat</Button>
    </div>
    <div v-for="contact in filteredContacts" class="p-2">
      <Checkbox class="mx-2 gray" @click="checkboxClick(contact['id'])" :checked="isChecked(contact['id'])">
      </Checkbox>
      <Avatar class="mx-2">
        {{ contact['nickname'].substring(0,1)}}
      </Avatar>
      <span>{{ contact['nickname'] }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>