<script setup>

import { Button } from "@/components/ui/button/index.js";
import { onMounted, ref, watch } from "vue";
import { useContactStore } from "@/store/contactStore.js";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore.js";
import { Input } from '@/components/ui/input'
import IconCross from "@/components/icons/IconCross.vue";
import router from "@/router/router.js";
import { addContact } from "@/api/api.js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert/index.js";



const contactId = ref(undefined)
const contactStore = useContactStore()

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const token = authRefs.tokens.value['access_token']

const addedContacts = ref([])

const newContact = ref(null)

function invite() {
  if (contactId.value === undefined || contactId.value === null) return

  addContact(token, contactId.value).then(
    (response) => {
      contactStore.contacts.push(response.data)
      addedContacts.value.push(response.data)
      newContact.value = response.data
      console.log(response)
    }
  )

  contactId.value = null

}

onMounted(() => {
  contactStore.getContacts(token)
})

watch(newContact, (newVal) => {
  if (newVal !== null) {
    setTimeout(() => {
      newContact.value = null
    }, 5000)
  }
})

</script>

<template>
  <div class="container max-w-xl px-0">
    <IconCross class="w-6 m-6" @click="router.push({path: 'chat'})"/>
    <div class="text-center my-12">
      <h1>This is your user code:</h1>
      <p class="text-6xl">{{ authRefs.user.value.id }}</p>
    </div>
    <div class="*:m-2 justify-center text-center">
      <h2>Enter a friend's user code below to invite them</h2>
      <div class="*:inline-block flex space-x-2 justify-center">
        <Input v-model="contactId" class="w-96" type="number"></Input>
        <Button @click="invite()">add contact</Button>
      </div>
    </div>

    <Transition>
      <Alert v-if="newContact" class="mx-auto w-11/12">
        <AlertTitle>Invite Successful!</AlertTitle>
        <AlertDescription>
          You have successfully added user <i>{{ newContact.nickname }}</i> to your contacts.
        </AlertDescription>
      </Alert>
    </Transition>
  </div>
</template>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>