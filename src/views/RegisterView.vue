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
import router from "@/router/router.js";
import { storeToRefs } from "pinia";

const authStore = useAuthStore()
const authRefs = storeToRefs(authStore)

const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(30),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
  authStore.register(values.email ,values.username, values.password)
})

watch(authRefs.tokens, async (tokens) => {
  if (tokens['access_token'] && tokens['refresh_token']) {
    await router.push('/')
  } else {
    console.warn('no tokens detected')
  }
})

</script>

<template>
  <form class="w-2/5 space-y-6 container mt-40 p-7 border rounded-md" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="text" placeholder="example@email.com" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your email.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input type="text" placeholder="chatsongs" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your public display name.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your password.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" class="w-full">
      Submit
    </Button>
    <p class="text-gray-400 text-center m-auto">Already have an account? <RouterLink to="/login">Click here.</RouterLink></p>
  </form>
</template>
