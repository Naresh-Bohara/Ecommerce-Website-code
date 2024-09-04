import { useState } from "react"
import { SubmitBtn } from "./SubmitBtn"
import { useDispatch, useSelector } from "react-redux"
import { setCart } from "@/store"
import { toast } from "react-toastify"

export const AddToCart = ({product, qty=1}) =>{
    const cart = useSelector(state => state.cart.value)

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const handleClick = () =>{
        setLoading(true)

        const id = product._id
        let qt = qty

        if(id in cart){
          qt += cart[id].qty
        }

        let temp = {...cart,
            [id]:{
                product,
                qty: qt,
            }
        }

        dispatch(setCart(temp))
        toast.success('Product added to cart.')
        setLoading(false)

    }

    return <SubmitBtn label="Add To Cart" icon="fa-cart-plus" disabled={loading}
     onClick={handleClick} />
}