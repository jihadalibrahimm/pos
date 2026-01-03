import axios from 'axios'

const instance = axios.create({
    baseURL : "http://localhost:5000/api",
    withCredentials:true,
})

// instance.interceptors.request.use(
//     (config) => {
//         const token = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token="))
        
//         if(token){
//             config.headers["Authorization"] = `Bearer ${token.split("=")[1]}`
//         }
//         return config
//     },
//     (error) => Promise().reject(error)
// )

export default instance;