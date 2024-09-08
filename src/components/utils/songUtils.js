
const apiUrl = import.meta.env.VITE_API_URL

export function getSongUri(song) {
    return apiUrl + '/songs/' + song
}