<script setup>
import { Avatar } from "@/components/ui/avatar/index.js";
import { onUpdated } from "vue";

const props = defineProps(['id', 'chat', 'isCurrentChat'])

onUpdated(() => {
  console.log(props.id)
})

</script>

<template>
  <div :class="props.isCurrentChat ? 'rounded-md bg-gray-200 drop-shadow' : ''"
       class="hover:rounded-md hover:bg-gray-200 hover:drop-shadow mb-1">
    <div class="inline-block">
      <Avatar class="my-2 mx-2 drop-shadow">
        <!--      <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />-->
        <!--      <AvatarFallback>CN</AvatarFallback>-->
        {{ props.chat.name.substring(0,1) }}
      </Avatar>
    </div>
    <div class="inline-block contain-inline-size w-[calc(100%-56px)] my-auto align-middle pr-2">
      <p class="truncate"> {{ props.chat.name }} </p>
    </div>
  </div>
</template>
