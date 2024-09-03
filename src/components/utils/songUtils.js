
const apiUrl = import.meta.env.VITE_API_URL

export function getSongUri(song) {
    let uri = apiUrl + '/songs/' + song
    console.log(uri)

    return uri
}