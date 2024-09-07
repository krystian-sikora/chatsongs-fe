import { useFilebasedPlaybackStore } from "@/store/filebasedPlaybackStore.js";
import { storeToRefs } from "pinia";
import axios from "axios";
import { useAuthStore } from "@/store/authStore.js";
import { Stomp } from "@stomp/stompjs";

const apiUrl = import.meta.env.VITE_API_URL
let stompClient = null

const hasNext = (playbackData) => {
    return playbackData.value?.length > 1
}

const hasPrevious = (backtrack) => {
    return backtrack.value?.length > 0
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
    const { queue } = storeToRefs(pbStore)
    return { queue }
}

const getFbPbStore = () => {
    const pbStore = useFilebasedPlaybackStore()
    return storeToRefs(pbStore)
}

export function getSongUri(song) {
    return apiUrl + '/songs/' + song
}

export function getCurrentSong() {
    const playbackData = getPlaybackData()
    return playbackData.value[0]
}

export function attachListeners() {
    const audioElement = document.querySelector('audio')
    audioElement.onended = () => {
        next()
    }
    audioElement.ondurationchange = () => {
        patchSongs()
    }
}

export function previous(post = true) {
    const audioElement = document.querySelector('audio')

    const { queue, backtrack } = getFbPbStore()

    if (audioElement.currentTime > 3 || !hasPrevious(backtrack)) {
        audioElement.currentTime = 0
    } else {
        let shifted = backtrack.value.shift();

        audioElement.src = getSongUri(shifted.song.id)
        queue.value.unshift(shifted)
    }

    if (post) postAction("PREVIOUS")

    maintainState(audioElement)
}

export function next(post = true) {
    const audioElement = document.querySelector('audio')
    const { queue, backtrack } = getFbPbStore()

    if (!hasNext(queue)) {
        backtrack.value.unshift(queue.value.shift())
        return
    }

    backtrack.value.unshift(queue.value.shift())
    audioElement.src = getSongUri(queue.value[0].song.id)

    if (post) {
        postAction("NEXT")
    }

    maintainState(audioElement)
}

export function play(post = true) {
    const audioElement = document.querySelector('audio')
    const { queue, isPlaying } = getFbPbStore()

    if (!audioElement?.src) {
        audioElement.src = getSongUri(queue.value[0].song.id)
    }

    audioElement.play().then(() => {
        isPlaying.value = true
        if (!post) return
        postAction("PLAY")
    })

    return true
}

export function pause(post = true) {
    const audioElement = document.querySelector('audio')
    const { isPlaying } = getFbPbStore()

    audioElement.pause()
    isPlaying.value = false

    if (post) postAction("PAUSE")

    return false
}

export function skipTo(index, post = true) {
    const audioElement = document.querySelector('audio')
    const { queue, backtrack } = getFbPbStore()

    backtrack.value = [...backtrack.value, ...queue.value.slice(0, index)].reverse()

    queue.value = queue.value.slice(index)
    audioElement.src = getSongUri(queue.value[0].song.id)

    if (post) postAction("SKIP_TO", index)

    maintainState(audioElement)
}

function patchSongs() {
    const pbStore = useFilebasedPlaybackStore()
    const { sessionChatId, backtrack, queue } = storeToRefs(pbStore)
    const authStore = useAuthStore()
    const { tokens } = storeToRefs(authStore)

    let songQueue = queue.value;

    for (let i = 0; i < backtrack.value.length; i++) {
        backtrack.value[i].position = -i - 1
    }

    for (let i = 0; i < songQueue.length; i++) {
        songQueue[i].position = i
    }

    let newQueue = []

    for (let track of backtrack.value) {
        newQueue.push(track)
    }

    for (let track of songQueue) {
        newQueue.push(track)
    }

    console.log('newQueue', newQueue)

    let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: apiUrl + '/api' + '/filebased-playback/' + sessionChatId.value,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ tokens.value['access_token'] }`
        },
        data: newQueue
    }

    axios.request(config)
        .then((response) => {
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        });
}

function postAction(action, index = 0) {
    const pbStore = useFilebasedPlaybackStore()
    const { sessionChatId, isPlaying } = storeToRefs(pbStore)
    const audioElement = document.querySelector('audio')

    stompClient.publish({
        destination: "/app/playback",
        body:
            `{
          "chat_id": ${ sessionChatId.value },
          "action": "${ action }",
          "timestamp": "${ new Date().toISOString() }",
          "current_time": ${ audioElement.currentTime },
          "is_playing": ${ isPlaying.value },
            "index": ${ index }
        }`
    })
}

export function initWebSocketConnection() {
    const authStore = useAuthStore()
    const { user, tokens } = storeToRefs(authStore)

    let socket = new SockJS(apiUrl + '/playback')
    stompClient = Stomp.over(socket)
    stompClient.connect({ 'Authorization': `Bearer ${ tokens.value['access_token'] }` }, function (frame) {
        console.log('Connected: ' + frame)
        stompClient.subscribe(`/user/${ user.value['id'] }/queue/playback`, (message) => {
            console.log(`filebased playback message: ${message.body}`)
            let json = JSON.parse(message.body)
            console.log(json)
            let delay = new Date() - new Date(json.timestamp)

            switch (json.action) {
                case 'PLAY':
                    play(false)
                    break
                case 'PAUSE':
                    pause(false)
                    break
                case 'NEXT':
                    next(false)
                    break
                case 'PREVIOUS':
                    previous(false)
                    break
                case 'UPDATE':
                    refreshPlaybackData()
                    break
                case 'SKIP_TO':
                    skipTo(json.index, false)
                    break
                case 'REQUEST_STATE':
                    postAction('UPDATE_STATE')
                    refreshPlaybackData()
                    break
                case 'UPDATE_STATE':
                    updateState(json.timestamp, json.current_time, json.is_playing)
            }

            fixDelay(delay)
        });
        postAction('REQUEST_STATE')

    });
}

function fixDelay(delay) {
    const audioElement = document.querySelector('audio')
    audioElement.currentTime += delay / 1000
}

function updateState(timestamp, currentTime, isPlaying) {
    const audioElement = document.querySelector('audio')
    if (isPlaying) play(false)
    else pause(false)
    let delay = new Date() - new Date(timestamp)
    audioElement.currentTime = currentTime + (delay / 1000)
}

export function joinFilebasedPlayback(chatId) {
    const authStore = useAuthStore()
    const { tokens } = storeToRefs(authStore)

    const pbStore = useFilebasedPlaybackStore()
    const { sessionChatId, playbackData, isInSession, isError } = storeToRefs(pbStore)

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/api' + '/filebased-playback',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ tokens.value['access_token'] }`
        },
        data: chatId
    }

    axios.request(config)
        .then((response) => {
            playbackData.value = response.data
            splitSongQueue(response.data)
            isInSession.value = true
            isError.value = false
            attachListeners()
        })
        .catch((error) => {
            console.log(error)
            isInSession.value = false
            isError.value = true
        });

    sessionChatId.value = chatId
    initWebSocketConnection()
}

export function refreshPlaybackData() {
    const authStore = useAuthStore()
    const { tokens } = storeToRefs(authStore)

    const pbStore = useFilebasedPlaybackStore()
    const { sessionChatId, playbackData, isInSession, isError } = storeToRefs(pbStore)

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: apiUrl + '/api' + '/filebased-playback/' + sessionChatId.value,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ tokens.value['access_token'] }`
        },
    }

    axios.request(config)
        .then((response) => {
            playbackData.value = response.data
            splitSongQueue(response.data)
            isInSession.value = true
            isError.value = false
        })
        .catch((error) => {
            console.log(error)
            isInSession.value = false
            isError.value = true
        });
}

export function splitSongQueue(playbackResponse) {
    const pbStore = useFilebasedPlaybackStore()
    const { sessionChatId, backtrack, queue, currentlyListeningUsers} = storeToRefs(pbStore)

    backtrack.value = []
    queue.value = []
    currentlyListeningUsers.value = playbackResponse.active_users
    sessionChatId.value = playbackResponse.chat_id

    playbackResponse.song_queue.forEach(qSong => {
        if (qSong.position < 0) {
            backtrack.value.push(qSong)
        } else {
            queue.value.push(qSong)
        }
    })
}

export function quitSession() {
    const authStore = useAuthStore()
    const { tokens } = storeToRefs(authStore)

    const pbStore = useFilebasedPlaybackStore()
    const { sessionChatId, playbackData, isInSession, isError, queue, backtrack, currentlyListeningUsers } = storeToRefs(pbStore)

    playbackData.value = null
    isInSession.value = false
    isError.value = false
    queue.value = []
    backtrack.value = []
    currentlyListeningUsers.value = []

    let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: apiUrl + '/api' + '/filebased-playback/' + sessionChatId.value,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ tokens.value['access_token'] }`
        },
    }

    axios.request(config)
}

