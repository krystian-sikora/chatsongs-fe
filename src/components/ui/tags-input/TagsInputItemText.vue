<script setup>
import { computed } from "vue";
import { TagsInputItemText, useForwardProps } from "radix-vue";
import { cn } from "@/lib/utils";

const props = defineProps({
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TagsInputItemText
      :class="cn('py-1 px-2 text-sm rounded bg-transparent', props.class)"
      v-bind="forwardedProps"
  />
</template>
