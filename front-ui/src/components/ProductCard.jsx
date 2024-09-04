import { Link } from "react-router-dom"
import { imgUrl } from "../lib"
import { AddToCart } from "./AddToCart"

export const ProductCard = ({product = {}, latest = false}) => {
    return  <div className="col my-3">
    <div className="col-12 bg-white text-center h-100 product-item">
          
       {latest && <span className="new"> New </span>}

      <div className="row h-100">
        <div className="col-12 p-0 mb-3">
          <Link to={`/products/${product._id}`}>
            <img
              src={imgUrl(product.images[0])}
              className="img-fluid"
            />
          </Link>
        </div>
        <div className="col-12 mb-3">
          <Link to={`/products/${product._id}`} className="product-name">
            {product.name}
          </Link>
        </div>
        <div className="col-12 mb-3">
        {product.discountedPrice > 0 ? <>
         <span className="product-price-old">Rs. {product.price.toLocaleString('en-NP')} </span>
         <br />
         <span className="product-price">Rs. {product.discountedPrice.toLocaleString('en-NP')}</span> </> :
         <span className="product-price">Rs. {product.price.toLocaleString('en-NP')}</span>
          }
         
        </div>
        <div className="col-12 mb-3 align-self-end">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  </div>
}