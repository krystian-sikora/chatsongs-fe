import { defineStore } from "pinia";
import { ref } from "vue";

export const useFilebasedPlaybackStore = defineStore('filebasedPlayback', {
    state: () => ({
        isInSession: ref(false),
        sessionId: ref(null),
        sessionChatId: ref(null),
        queue: ref(null),
        backtrack: ref([]),
        isPlaying: ref(false),
        currentlyListeningUsers: ref([]),
        playbackData: ref(null),
        stompClientR: ref(null),
        isError: ref(false),
    }),
})



