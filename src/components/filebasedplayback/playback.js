import { useFilebasedPlaybackStore } from "@/store/filebasedPlaybackStore.js";
import { storeToRefs } from "pinia";

const apiUrl = import.meta.env.VITE_API_URL

const hasNext = (playbackData) => {
    return playbackData.value.song_queue.length > 1
}

const hasPrevious = (backtrack) => {
    return backtrack.value.length > 0
}

const getBacktrack = () => {
    const pbStore = useFilebasedPlaybackStore()
    const { backtrack } = storeToRefs(pbStore)
    return backtrack
}

const maintainState = (audioElement) => {
    const pbStore = useFilebasedPlaybackStore()
    const { isPlaying } = storeToRefs(pbStore)
    if (isPlaying.value) audioElement.play()
}

const getPlaybackData = () => {
    const pbStore = useFilebasedPlaybackStore()
    const { playbackData } = storeToRefs(pbStore)
    return playbackData
}

export function getSongUri(song) {
    return apiUrl + '/songs/' + song
}

export function getCurrentSong() {
    const playbackData = getPlaybackData()
    return playbackData.value.song_queue[0]
}

export function attachListeners() {
    const audioElement = document.querySelector('audio')
    audioElement.onended = () => {
        next()
    }
}

export function previous() {
    const audioElement = document.querySelector('audio')
    const playbackData = getPlaybackData()
    const backtrack = getBacktrack()

    if (audioElement.currentTime > 3 || !hasPrevious(backtrack)) {
        audioElement.currentTime = 0
    } else {
        let shifted = backtrack.value.shift();

        audioElement.src = getSongUri(shifted.song.id)
        playbackData.value.song_queue.unshift(shifted)
    }
    maintainState(audioElement)
}

export function next() {
    const audioElement = document.querySelector('audio')
    const playbackData = getPlaybackData()
    const backtrack = getBacktrack()

    if (!hasNext(playbackData)) {
        backtrack.value.unshift(playbackData.value.song_queue.shift())
        return
    }

    backtrack.value.unshift(playbackData.value.song_queue.shift())
    audioElement.src = getSongUri(playbackData.value.song_queue[0].song.id)

    maintainState(audioElement)
}

export function play() {
    const audioElement = document.querySelector('audio')
    const playbackData = getPlaybackData()

    if (!audioElement?.src) {
        audioElement.src = getSongUri(playbackData.value.song_queue[0].song.id)
    }

    audioElement.play()
    return true
}

export function pause() {
    const audioElement = document.querySelector('audio')
    audioElement.pause()
    return false
}

export function skipTo(index) {
    const audioElement = document.querySelector('audio')
    const playbackData = getPlaybackData()
    const backtrack = getBacktrack()

    backtrack.value = [...backtrack.value, ...playbackData.value.song_queue.slice(0, index)].reverse()

    playbackData.value.song_queue = playbackData.value.song_queue.slice(index)
    audioElement.src = getSongUri(playbackData.value.song_queue[0].song.id)
    maintainState(audioElement)
}