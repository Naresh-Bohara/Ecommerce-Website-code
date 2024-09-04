import { Loading } from "@/components";
import http from "@/http";
import { imgUrl } from "@/lib";
import { clearCart, setCart } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
    const cart = useSelector(state => state.cart.value);
    const [loading, setLoading] = useState(false);
    const [totalQty, setTotalQty] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        if(Object.keys(cart).length > 0){
           let qt = 0, tp = 0
   
           for(let id in cart){
             const product = cart[id].product
             const price = product.discountedPrice > 0 ? product.discountedPrice : product.price
   
             qt += cart[id].qty
             tp += cart[id].qty * price
           }
   
           setTotalQty(qt)
           setTotalPrice(tp)
        }else{
         setTotalQty(0)
         setTotalPrice(0)
        }
     }, [cart])


     const handleChange = (id, qty) =>{
       let temp = {
        ...cart,
        [id]: {
            product: cart[id].product,
            qty,
        }
      }

      dispatch(setCart(temp))
     }

     const handleClick = id => {
        let temp = {}

        for(let k in cart){
            if(k != id){
                temp = {
                    ...temp,
                    [k]: cart[k]
                }
            }
        }

        dispatch(setCart(temp))
     }

     const handleCheckout = () =>{
        setLoading(true)

        let data = []

        for(let k in cart){
            data.push({
                productId: k,
                qty: cart[k].qty
            })
        }

        http.post('/checkout', data)
           .then(()=>{
             dispatch(clearCart())
             navigate('/profile')
           })

           .catch(()=>{})
           .finally(()=>setLoading(false))
     }

    return loading ? <Loading/> : <div className="col-12">
    <div className="row">
        <div className="col-12 mt-3 text-center text-uppercase">
            <h2>Shopping Cart</h2>
        </div>
    </div>

    <main className="row">
        <div className="col-12 bg-white py-3 mb-3">
            <div className="row">
                <div className="col-lg-6 col-md-8 col-sm-10 mx-auto table-responsive">
                    {Object.keys(cart).length > 0 ?
                     <form className="row">
                        <div className="col-12">
                            <table className="table table-striped table-hover table-sm">
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Amount</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                               {Object.keys(cart).map(k => {
                                const product = cart[k].product
                                const qty = cart[k].qty
                                const price = product.discountedPrice > 0 ? product.discountedPrice : product.price

                                return  <tr key={k}>
                                <td>
                                    <img src={imgUrl(product.images[0])} className="img-fluid me-3" />
                                    {product.name}
                                </td>
                                <td>
                                   Rs. {price.toLocaleString('en-NP')}
                                </td>
                                <td>
                             <input type="number" min="1" value={qty}
                                onChange={({target})=>handleChange(k, parseInt(target.value))} />
                                </td>
                                <td>
                                    Rs. {(price*qty).toLocaleString('en-NP')}
                                </td>
                                <td>
                                    <button className="btn btn-link text-danger"
                                    onClick={()=>handleClick(k)}><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                               })}
                                </tbody>
                                <tfoot>
                                <tr>
                                <th colSpan="2" className="text-right">Total</th>
                                    <th>{totalQty}</th>
                                    <th>Rs. {totalPrice.toLocaleString('en-NP')} </th>
                                    <th></th>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="col-12 text-right">
                            <button className="btn btn-outline-secondary me-3"
                            onClick={()=>dispatch(clearCart())} type="button">
                                Clear Cart</button>
                                <button type="button" className="btn btn-outline-success" onClick={handleCheckout}>Checkout</button>

                        </div>
                    </form> :
                      <h4 className="text-center">Cart is empty.</h4>
                    }
                </div>
            </div>
        </div>

    </main>
</div>
}