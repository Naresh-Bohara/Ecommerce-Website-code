import { configureStore } from "@reduxjs/toolkit"
import useReducer, {setUser, clearUser} from "./user.slice"

const store = configureStore({
    reducer: {
        user: useReducer
    }
})

export default store

export {setUser, clearUser}