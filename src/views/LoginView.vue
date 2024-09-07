<script setup>

import { toTypedSchema } from "@vee-validate/zod";
import * as z from 'zod'
import { useForm } from "vee-validate";
import { Button } from '@/components/ui/button/index.js'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form/index.js'
import { Input } from '@/components/ui/input/index.js'
import { useAuthStore } from "@/store/authStore.js";
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import router from "@/router/router.js";
import Logo from "@/components/Logo.vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert/index.js";
import { AlertCircle } from "lucide-vue-next";
import { HollowDotsSpinner } from "epic-spinners";

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)
const { error } = authRefs
const errorMap = ref(new Map())
const isPending = ref(false)

watch(error, (error) => {
  if (error) {
    isPending.value = false
  }
})

onMounted(() => {
  errorMap.value.set(422, 'Invalid credentials')
  errorMap.value.set(500, 'Server error')
})

const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(6).max(30),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  isPending.value = true
  authStore.login(values.email, values.password)
})

watch(authRefs.tokens, async (tokens) => {
  if (tokens?.access_token && tokens?.refresh_token) {
    await router.push({ path: `/chat` })
  }
})

</script>

<template>
  <Transition>
    <Alert v-if="error" class="absolute left-1/2 transform -translate-x-1/2 right-auto top-0 mx-auto my-4 bg-white/70 max-w-80" variant="destructive">
      <AlertCircle class="w-4 h-4" />
      <div class="flex justify-between">
        <AlertTitle class="mt-1">An error occurred</AlertTitle>
        <span class="-mt-1 hover:cursor-pointer" @click="error = null">X</span>
      </div>
      <AlertDescription class="*:whitespace-pre-wrap">
        {{ errorMap.get(error.response.status) }}
      </AlertDescription>
    </Alert>
  </Transition>
  <div class="flex flex-col items-center justify-center h-screen">
    <Logo class=""/>
    <form class="bg-secondary w-11/12 max-w-96 space-y-6 p-7 border rounded-md" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="example@email.com" type="text" v-bind="componentField"/>
          </FormControl>
          <FormDescription>
            This is your email.
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" v-bind="componentField"/>
          </FormControl>
          <FormDescription>
            This is your password.
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>
      <Button class="w-full" type="submit">
        <HollowDotsSpinner v-if="isPending" :animation-duration="1000"/>
        <span v-else>Submit</span>

      </Button>
      <p class="text-gray-400 text-center m-auto">Don't have an account?
        <RouterLink to="/register" class="hover:underline underline-offset-4">Click here.</RouterLink>
      </p>
    </form>
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
