import { createSlice } from "@reduxjs/toolkit"
import {fromStorage, inStorage, removeStorage} from "@/lib"




const cartSlice = createSlice({
    name: 'cart',
    initialState:{
        value:JSON.parse(fromStorage('cart') || '{}' )
    },

    reducers:{
        setCart:(state, action)=>{
          state.value = action.payload
          inStorage('cart', JSON.stringify(action.payload), true)
        },
        clearCart:state=>{
            state.value = {}
            removeStorage('cart')

        }
    }
})

export default cartSlice.reducer

export const {setCart, clearCart} = cartSlice.actions