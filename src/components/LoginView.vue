<script setup>

import { toTypedSchema } from "@vee-validate/zod";
import * as z from 'zod'
import { useForm } from "vee-validate";
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
    await router.push('/')
  } else {
    console.warn('no tokens detected')
  }
})

</script>

<template>
  <form class="w-2/3 space-y-6" @submit="onSubmit">
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
    <Button type="submit">
      Submit
    </Button>
  </form>
</template>