import { defineStore } from 'pinia'
import { ref } from "vue";
import {
    getPlayback,
    joinPlayback,
    playbackAction, quitPlayback,
    refreshSpotifyCredentials,
    setPlaybackDevice,
} from "@/api/api.js";

export const usePlaybackStore = defineStore('playback', {
    state: () => {
        return {
            isLoggedIn: ref(false),
            tokens: ref({
                'access_token': null,
                'refresh_token': null
            }),
            device: ref({
                'device_id': null,
                'is_active': false
            }),
            playbacks: ref(new Map()),
            currentPlayback: ref(null)
        }
    },
    actions: {
        refresh(token) {
            refreshSpotifyCredentials(token)
                .then(
                    (res) => {
                        this.tokens = {
                            'access_token': res.data['access_token'],
                            'refresh_token': res.data['refresh_token']
                        }
                        this.isLoggedIn = true
                    })
                .catch(
                    () => {
                        this.isLoggedIn = false
                    })
        },
        setDevice(token, deviceId, isActive) {
            this.device.device_id = deviceId
            this.device.is_active = isActive

            setPlaybackDevice(token, this.device)
        },
        join(token, chatId) {
            joinPlayback(token, chatId)
                .then(
                    (res) => {
                        this.playbacks.set(chatId, res.data)
                        this.currentPlayback = res.data
                    })
                .catch(
                    (res) => {
                        this.handleError(res, token)
                    })
        },
        quit(token, chatId) {
            quitPlayback(token, chatId)
                .then(
                    () => {
                        this.currentPlayback = null
                        this.playbacks.set(chatId, null)
                    })
                .catch(
                    (res) => {
                        this.handleError(res)
                    })
        },
        getPlayback(token, chatId) {
            getPlayback(token, chatId)
                .then(
                    (res) => {
                        this.playbacks.set(chatId, res.data)
                    })
                .catch(
                    () => {
                    })
        },
        action(token, chatId, action) {
            playbackAction(token, chatId, action)
                .then(
                    () => {
                    })
                .catch(
                    (res) => {
                        this.handleError(res)
                    })
        },
        handleError(res, token) {
            if (res.response.status === 401) {
                this.refresh(token)
            }
        }
    },
})