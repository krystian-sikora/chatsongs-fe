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
import { AlertCircle } from "lucide-vue-next";

const { noX } = defineProps(['noX'])

const contactId = ref(undefined)
const contactStore = useContactStore()

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const token = authRefs.tokens.value['access_token']

const addedContacts = ref([])

const newContact = ref(null)
const errorCode = ref(null)
const errorMap = ref(new Map())

function invite() {
  if (contactId.value === undefined || contactId.value === null) return

  addContact(token, contactId.value).then(
    (response) => {
      contactStore.contacts.push(response.data)
      addedContacts.value.push(response.data)
      newContact.value = response.data
    }
  ).catch(
    (err) => {
      errorCode.value = err.response.status
    }
  )

  contactId.value = null

}

onMounted(() => {
  contactStore.getContacts(token)

  errorMap.value.set(404, 'User not found')
  errorMap.value.set(500, 'Server error')
  errorMap.value.set(409, 'User already in contacts')
})

watch(newContact, (newVal) => {
  if (newVal !== null) {
    errorCode.value = null
    setTimeout(() => {
      newContact.value = null
    }, 5000)
  }
})

</script>

<template>
  <div class="container max-w-xl px-0">
    <IconCross v-if="!noX" class="w-6 m-6 hover:cursor-pointer" @click="router.push({path: 'chat'})"/>
    <div class="text-center my-12">
      <h1>This is your user code:</h1>
      <p class="text-6xl drop-shadow-[1px_1px_1px_rgba(255,255,255,1)] bg-gradient-to-br from-primary-700 to-rose-500 text-transparent bg-clip-text font-bold">{{ authRefs.user.value?.id }}</p>
    </div>
    <div class="*:m-2 justify-center text-center">
      <h2>Enter a friend's user code below to invite them</h2>
      <div class="*:inline-block flex space-x-2 justify-center">
        <Input v-model="contactId" type="number"></Input>
        <Button @click="invite()">add contact</Button>
      </div>
    </div>

    <Transition>
      <Alert v-if="newContact" class="absolute left-1/2 transform -translate-x-1/2 right-auto top-0 mx-auto my-4 bg-white/70 max-w-80">
        <AlertTitle>Invite Successful!</AlertTitle>
        <AlertDescription>
          You have successfully added user <i>{{ newContact.nickname }}</i> to your contacts.
        </AlertDescription>
      </Alert>
    </Transition>
    <Transition>
      <Alert v-if="errorCode" class="absolute left-1/2 transform -translate-x-1/2 right-auto top-0 mx-auto my-4 bg-white/70 max-w-80" variant="destructive">
        <AlertCircle class="w-4 h-4" />
        <div class="flex justify-between">
          <AlertTitle class="mt-1">An error occurred</AlertTitle>
          <span class="-mt-1 hover:cursor-pointer" @click="errorCode = null">X</span>
        </div>
        <AlertDescription class="*:whitespace-pre-wrap">
          {{ errorMap.get(errorCode) }}
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