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
import { watch } from "vue";
import { storeToRefs } from "pinia";
import router from "@/router/router.js";

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(6).max(30),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
  authStore.login(values.email, values.password)
})

watch(authRefs.tokens, async (tokens) => {
  if (tokens['access_token'] && tokens['refresh_token']) {
    await router.push({ path: `/chat` })
  } else {
    console.warn('no tokens detected')
  }
})

</script>

<template>
  <div v-if="authStore.error">
    {{ authStore.error }}
  </div>
  <div class="flex items-center justify-center h-screen">
    <form class="w-11/12 max-w-96 space-y-6 p-7 border rounded-md" @submit="onSubmit">
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
        Submit
      </Button>
      <p class="text-gray-400 text-center m-auto">Don't have an account?
        <RouterLink to="/register" class="hover:underline underline-offset-4">Click here.</RouterLink>
      </p>
    </form>
  </div>

</template>
