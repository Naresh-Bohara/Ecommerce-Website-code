import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
dayjs.extend(localizedFormat);

export const dt = (datetime, format = 'lll')=>dayjs(datetime).format(format)

const inStorage = (key, value, remember=false)=>{
    remember ? localStorage.setItem(key, value) : sessionStorage.setItem(key, value)
}

const fromStorage = key=>{
    return localStorage.getItem(key) || sessionStorage.getItem(key)
}

const removeStorage = key=>{
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
}

const setValidationError = (formik, response)=>{
    if( response && 'errors' in response?.data){
        formik.setErrors(response.data.errors)
    }
}

const imgUrl = filename=> `${import.meta.env.VITE_API_URL}/image/${filename}`

export {inStorage, fromStorage, removeStorage, imgUrl, setValidationError}