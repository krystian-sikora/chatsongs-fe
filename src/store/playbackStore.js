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
                        console.log(res.data)
                        this.tokens = {
                            'access_token': res.data['access_token'],
                            'refresh_token': res.data['refresh_token']
                        }
                        this.isLoggedIn = true
                        console.log('refreshed token', this.tokens)
                    })
                .catch(
                    (res) => {
                        console.warn('could not refresh token', res)
                        this.isLoggedIn = false
                    })
        },
        setDevice(token, deviceId, isActive) {
            this.device.device_id = deviceId
            this.device.is_active = isActive

            setPlaybackDevice(token, this.device)
                .then(
                    (res) => {
                        console.log('device playback set', res.data)
                    })
                .catch(
                    (res) => {
                        console.warn('could not set device', res)
                    })
        },
        join(token, chatId) {
            joinPlayback(token, chatId)
                .then(
                    (res) => {
                        this.playbacks.set(chatId, res.data)
                        this.currentPlayback = res.data
                        console.log('joined playback', res.data)
                        console.log(this.playbacks)
                    })
                .catch(
                    (res) => {
                        this.handleError(res, token)
                        console.warn('could not join playback', res)
                    })
        },
        quit(token, chatId) {
            quitPlayback(token, chatId)
                .then(
                    (res) => {
                        this.currentPlayback = null
                        this.playbacks.set(chatId, null)
                        console.log('quit playback', res.data)
                    })
                .catch(
                    (res) => {
                        this.handleError(res)
                        console.warn('could not quit playback', res)
                    })
        },
        getPlayback(token, chatId) {
            getPlayback(token, chatId)
                .then(
                    (res) => {
                        this.playbacks.set(chatId, res.data)
                        console.log('got playback', res.data)
                        console.log(this.playbacks)
                    })
                .catch(
                    (res) => {
                        console.warn('could not get playback', res.response.status)
                    })
        },
        action(token, chatId, action) {
            playbackAction(token, chatId, action)
                .then(
                    (res) => {
                        console.log('playback action', action, res.data)
                    })
                .catch(
                    (res) => {
                        this.handleError(res)
                        console.warn('could not perform action', action, res)
                    })
        },
        handleError(res, token) {
            if (res.response.status === 401) {
                this.refresh(token)
            }
        }
    },
})