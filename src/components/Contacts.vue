<script setup>

import { Button } from "@/components/ui/button/index.js";
import { onMounted, ref } from "vue";
import { useContactStore } from "@/store/contactStore.js";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore.js";
import { Input } from '@/components/ui/input'


const contactId = ref(undefined)
const contactStore = useContactStore()
const contactRefs = storeToRefs(contactStore)

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const token = authRefs.tokens.value['access_token']

function addContact() {
  if (contactId.value === undefined) {}
  contactStore.addContact(token, contactId.value)
  contactId.value = null
}

onMounted(() => {
  contactStore.getContacts(token)
})

</script>

<template>
  <Input type="number" v-model="contactId" class="w-96"></Input>
  <Button @click="addContact()">add contact</Button>
  <ul>
    <li v-for="contact in contactRefs.contacts.value">
      {{ contact }}
    </li>
  </ul>
</template>
