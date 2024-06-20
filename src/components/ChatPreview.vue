<script setup>
import { Avatar } from "@/components/ui/avatar/index.js";
import { computed } from "vue";

const props = defineProps(['chat', 'id'])

const isCurrentChat = computed(() => Number(props.id) === props.chat.id)

</script>

<template>
  <div :class="isCurrentChat ? 'rounded-md bg-gray-200 drop-shadow' : ''" class="">
    <div class="inline-block">
      <Avatar class="my-2 mx-2 drop-shadow">
        <!--      <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />-->
        <!--      <AvatarFallback>CN</AvatarFallback>-->
        {{ props.chat.name.substring(0,1) }}
      </Avatar>
    </div>
    <div class="inline-block  contain-inline-size w-[calc(100%-56px)] my-auto align-middle">
      <h1 class="truncate"> {{ props.chat.name }} </h1>
    </div>
  </div>
</template>

<style scoped>

</style>