<script setup>
import { Avatar } from "@/components/ui/avatar/index.js";

const props = defineProps(['chat'])
</script>

<template>
    <Avatar class="my-2 mx-2">
<!--      <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />-->
<!--      <AvatarFallback>CN</AvatarFallback>-->
      CN
    </Avatar>
    <h1 class="inline-block"> {{ props.chat.name }} </h1>
</template>

<style scoped>

</style>