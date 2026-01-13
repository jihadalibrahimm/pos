import axios from 'axios'

const API = axios.create({
    baseURL : "https://pos-system-3tnt.onrender.com/api",
    withCredentials:true,
})

export default API;