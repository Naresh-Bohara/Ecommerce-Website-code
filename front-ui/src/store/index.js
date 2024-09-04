import { configureStore } from "@reduxjs/toolkit"
import userReducer, {setUser, clearUser} from "./user.slice"
import cartReducer, {setCart, clearCart} from "./card.slice"

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer
    }
})

export default store

export {setUser, clearUser, setCart, clearCart}