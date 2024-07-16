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
import Badge from "@/components/ui/badge/Badge.vue";
import IconBack from "@/components/icons/IconBack.vue";

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
  <div>
    <div class="border-b rounded-t px-2 md:px-6 h-16 w-full backdrop-blur drop-shadow flex justify-center flex-col">
      <div>
        <IconBack @click="updateShowChatPreviews" class="lg:hidden inline-block w-6 mr-3 hover:cursor-pointer "/>
        <h1 class="inline-block align-middle">Create new chat</h1>
<!--        <Input v-model="searchInput" class="inline-block mr-3 w-1/2" placeholder="Search"></Input>-->
<!--        <Button class="inline-block" @click="create()">Create chat</Button>-->
      </div>
    </div>
    <div class="*:mx-2">
      <div class="flex my-4">
        <Input v-model="searchInput" class="inline-block mr-3" placeholder="Search"></Input>
        <Button class="inline-block" @click="create()">Create chat</Button>
      </div>
      <Badge v-for="id in toInvite" class="mr-1">
        <p>{{ contactRefs.contacts.value.find(c => c.id === id).nickname }}
          <a class="cursor-pointer font-light" @click="deleteInvite(id);"> X </a>
        </p>
      </Badge>
      <div v-for="contact in filteredContacts" class="p-2">
        <Checkbox :checked="isChecked(contact['id'])" class="mx-2 gray" @click="checkboxClick(contact['id'])">
        </Checkbox>
        <Avatar class="mx-2">
          {{ contact['nickname'].substring(0, 1) }}
        </Avatar>
        <span>{{ contact['nickname'] }}</span>
      </div>
    </div>
  </div>
</template>
