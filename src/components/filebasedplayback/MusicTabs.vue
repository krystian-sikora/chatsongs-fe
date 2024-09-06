<script setup>

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/index.js";
import CurrentlyPlayingTable from "@/components/filebasedplayback/CurrentlyPlayingTable.vue";
import RecentlyPlayedTable from "@/components/filebasedplayback/RecentlyPlayedTable.vue";

const { music, backtrack } = defineProps(['music', 'backtrack'])



</script>

<template>
  <div>

    <Tabs default-value="musicQueue">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="musicQueue">
          music queue
        </TabsTrigger>
        <TabsTrigger value="recentlyPlayed">
          backtrack
        </TabsTrigger>
      </TabsList>
      <TabsContent value="musicQueue">
        <CurrentlyPlayingTable :music="music"/>
      </TabsContent>
      <TabsContent value="recentlyPlayed">
        <RecentlyPlayedTable :backtrack="backtrack"/>
      </TabsContent>
    </Tabs>


  </div>
</template>