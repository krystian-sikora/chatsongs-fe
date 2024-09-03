<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const { onHoverText } = defineProps(['onHoverText'])

</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <slot/>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ onHoverText }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>