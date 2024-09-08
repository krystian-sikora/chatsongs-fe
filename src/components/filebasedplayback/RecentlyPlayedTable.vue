<script setup>

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table/index.js";
import IconThreeDots from "@/components/icons/IconThreeDots.vue";
import { ScrollArea } from "@/components/ui/scroll-area/index.js";

const { backtrack } = defineProps(['backtrack'])

</script>

<template>
  <h1 v-if="backtrack?.length === 0" class="text-sm my-4">There are no recently played songs in this session</h1>
  <Table>
    <TableHeader>
      <TableRow>

      </TableRow>
    </TableHeader>
    <TableBody>
      <ScrollArea v-if="backtrack?.length !== 0" class="h-[200px] rounded-md bg-white">
        <TableRow v-for="(songQueueObj, index) in backtrack" :key="songQueueObj.id">
          <TableCell>
            {{ -index - 1 }}
          </TableCell>
          <TableCell class="text-xs">
            {{ songQueueObj.song.name }}
          </TableCell>
          <TableCell class="text-right">
            <IconThreeDots class="w-5 float-end"/>
          </TableCell>
        </TableRow>
      </ScrollArea>
    </TableBody>
  </Table>
</template>
