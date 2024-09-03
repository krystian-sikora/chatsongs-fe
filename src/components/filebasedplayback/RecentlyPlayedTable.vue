<script setup>

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table/index.js";
import IconThreeDots from "@/components/icons/IconThreeDots.vue";

const { backtrack } = defineProps(['backtrack'])

</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>

      </TableRow>
    </TableHeader>
    <TableBody>
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
    </TableBody>
  </Table>
  <h1 v-if="backtrack.length === 0" class="text-xs text-red-500 my-2">There are no recently played songs in this session</h1>
</template>
