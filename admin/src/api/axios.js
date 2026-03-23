import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

const instance = axios.create({
    baseURL : apiBaseUrl,
    withCredentials:true,
})

export const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, "")

export default instance;