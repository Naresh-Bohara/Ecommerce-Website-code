import { fromStorage } from "@/lib"
import axios from "axios"
import { toast } from "react-toastify"

const http = axios.create({
    headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }, 
    baseURL: import.meta.env.VITE_API_URL,
})

http.interceptors.request.use(config => {
    const token = fromStorage('FrontAccessToken')
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
}, error=>Promise.reject(error))

http.interceptors.response.use(resp=>{
    if('message' in resp?.data){
        toast.success(resp.data.message)
    }
    
    return resp
}, error=>{
    if('message' in error?.response?.data){
        toast.error(error.response.data.message)
    }

    return Promise.reject(error)
})

export default http