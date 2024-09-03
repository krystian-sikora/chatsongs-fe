import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useFilebasedPlaybackStore = defineStore('filebasedPlayback', {
    state: () => ({
        isInSession: ref(false),
        sessionId: ref(null),
        sessionChatId: ref(null),
        playbackData: ref(null),
        backtrack: ref([]),
        isPlaying: ref(false)
    }),
})



