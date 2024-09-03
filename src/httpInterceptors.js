import axios from "axios";
import router from "@/router/router.js";

axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    if (error.response.status === 401) {
        localStorage.clear()
        router.push({ path: '/login' })
    }
    return Promise.reject(error)
})