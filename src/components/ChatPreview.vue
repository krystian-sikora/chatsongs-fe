<script setup>
import { Avatar } from "@/components/ui/avatar/index.js";

const props = defineProps(['chat'])
</script>

<template>
    <div class="inline-block">
      <Avatar class="my-2 mx-2">
        <!--      <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />-->
        <!--      <AvatarFallback>CN</AvatarFallback>-->
        {{ props.chat.name.substring(0,1) }}
      </Avatar>
    </div>
    <div class="inline-block text-nowrap contain-inline-size">
      <h1> {{ props.chat.name }} </h1>
    </div>

</template>

<style scoped>

</style>