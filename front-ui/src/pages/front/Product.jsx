import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import http from "@/http"
import { AddToCart, Loading, ProductSection } from "@/components"
import { imgUrl } from "@/lib"
import dayjs from "dayjs"
import  relativeTime  from "dayjs/plugin/relativeTime"
import {useSelector} from "react-redux"

dayjs.extend(relativeTime)

export const Product = () => {
    const user = useSelector(state => state.user.value)

    const [product, setProduct] = useState({})
    const [loading, setLoading] = useState(false)
    const [similars, setSimilars] = useState([])
    const [bigImg, setBigImg] = useState('')
    const [review, setReview] = useState({comment: '', rating:1})
    const [avgRating, setAvgRating] = useState(0)
    const [stars, setStars] = useState({1:0, 2:0, 3:0, 4:0, 5:0})
    const [qty, setQty] = useState(1)

    const params= useParams()

    useEffect(() => {
      loadProduct()

    }, [params.id])

    useEffect(()=>{
     if(product?.reviews?.length > 0){
       let avg = 0
       let strs = {1:0, 2:0, 3:0, 4:0, 5:0}
       
       for(let review of product.reviews){
        avg += review.rating

        strs[review.rating] += 1
       }

       avg = avg / product.reviews.length

       for(let i in strs){
        strs[i] = strs[i] / product.reviews.length * 100
       }

       setAvgRating(avg)
       setStars(strs)

     }else{
        setAvgRating(0)
        setStars({1:0, 2:0, 3:0, 4:0, 5:0})
     }
    }, [product.reviews])

    const loadProduct = () =>{
        setLoading(true)

        Promise.all([
            http.get(`/products/${params.id}`),
            http.get(`/products/${params.id}/similar`)
        ])
        .then(([{data:prod}, {data:simList}])=>{
            setProduct(prod)
            setSimilars(simList)
            setBigImg(prod?.images[0])
        })
        .catch(()=>{})
        .finally(()=>setLoading(false))
    }

    const handleSubmit = e =>{
      e.preventDefault()

      setLoading(true)

      http.post(`/products/${params.id}/review`, review)
         .then(()=>{
            loadProduct()
            setReview({comment:'', rating:1})
         })
         .catch(()=>{})
         .finally(()=>setLoading(false))
    }

    return loading ? <Loading/> :  <div className="col-12">
    <main className="row">
        <div className="col-12 bg-white py-3 my-3">
            <div className="row">

                <div className="col-lg-5 col-md-12 mb-3">
                    <div className="col-12 mb-3">
                        <div className="img-large border" style={{backgroundImage: `url('${imgUrl(bigImg)}')`}}></div>
                    </div>
                    <div className="col-12">
                        <div className="row">

                         { product?.images?.map((image, i ) =><div className="col-sm-2 col-3" key={i} onMouseEnter={()=>setBigImg(image)} onClick={()=>setBigImg(image)}>
                                <div className="img-small border" 
                                style={{backgroundImage: `url('${imgUrl(image)}')`}} 
                                data-src="images/image-1.jpg"></div>
                            </div>
                        )}
                            
                        </div>
                    </div>
                </div>

                <div className="col-lg-5 col-md-9">
                    <div className="col-12 product-name large">
                        {product.name}
                        <small>By <Link to={`/brands/${product.brandId}`}>{product?.brand?.name}</Link></small>
                    </div>
                    <div className="col-12 px-0">
                        <hr />
                    </div>
                    <div className="col-12">
                        {product.summary}
                    </div>
                </div>

                <div className="col-lg-2 col-md-3 text-center">
                    <div className="col-12 sidebar h-100">
                        <div className="row">
                            <div className="col-12">
                            <div className="col-12">
                      {product?.discountedPrice > 0 ? (
                        <>
                         <span className="detail-price">
                         {product.discountedPrice?.toLocaleString("en-NP")}
                        </span>
                         <span className="detail-price-old">
                         {product.price?.toLocaleString("en-NP")}
                         </span>
                         </>
            
                        ) : (
                            <span className="detail-price">
                            {product.price?.toLocaleString("en-NP")}
                          </span>
                        )}
                        </div>

                            
                            </div>
                            <div className="col-xl-5 col-md-9 col-sm-3 col-5 mx-auto mt-3">
                                <div className="mb-3">
                                    <label htmlFor="qty">Quantity</label>
                                    <input type="number"id="qty"min="1" value={qty}
                                      className="form-control"required
                                       onChange={({target})=>setQty(parseInt(target.value))}/>

                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <AddToCart product={product} qty={qty}/>
                            </div>
                            <div className="col-12 mt-3">
                                <button className="btn btn-outline-secondary btn-sm" type="button"><i className="fas fa-heart me-2"></i>Add to wishlist</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div className="col-12 mb-3 py-3 bg-white text-justify">
            <div className="row">

                <div className="col-md-7">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 text-uppercase">
                                <h2><u>Details</u></h2>
                            </div>
                            <div className="col-12" id="details">
                               {product.description}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="col-12 px-md-4 sidebar h-100">

                        <div className="row">
                            <div className="col-12 mt-md-0 mt-3 text-uppercase">
                                <h2><u>Ratings & Reviews</u></h2>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-sm-4 text-center">
                                        <div className="row">
                                            <div className="col-12 average-rating">
                                                {avgRating.toFixed(1)}
                                            </div>
                                            <div className="col-12">
                                                of {product?.reviews?.length} reviews
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <ul className="rating-list mt-3">
                                            {[1, 2, 3, 4, 5].map(i => <li key={i}>
                                                <div className="progress">
                                                 <div className="progress-bar bg-dark" role="progressbar" style={{width:`${stars[i]}%`}} aria-valuenow="45" aria-valuemin={stars[i]} aria-valuemax="100">{stars[i].toFixed(1)}%</div>
                                                </div>
                                                <div className="rating-progress-label">
                                                    {i}<i className="fas fa-star ms-1"></i>
                                                </div>
                                            </li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 px-md-3 px-0">
                                <hr />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <h4>Add Review</h4>
                            </div>
                            <div className="col-12">
                                {user ?
                                    <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <textarea className="form-control" placeholder="Give your review" value={review.comment} onChange={({target})=> setReview({...review, comment:target.value})}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex ratings justify-content-end flex-row-reverse">
                                            <input type="radio" value="5" name="rating" id="rating-5" checked={review.rating == 5} onChange={()=>setReview({...review, rating:5})} /><label
                                                htmlFor="rating-5"></label>
                                            <input type="radio" value="4" name="rating" id="rating-4" checked={review.rating == 4} onChange={()=>setReview({...review, rating:4})} /><label
                                                htmlFor="rating-4"></label>
                                            <input type="radio" value="3" name="rating" id="rating-3" checked={review.rating == 3} onChange={()=>setReview({...review, rating:3})} /><label
                                                htmlFor="rating-3"></label>
                                            <input type="radio" value="2" name="rating" id="rating-2" checked={review.rating == 2} onChange={()=>setReview({...review, rating:2})} /><label
                                                htmlFor="rating-2"></label>
                                            <input type="radio" value="1" name="rating" id="rating-1" checked={review.rating == 1} onChange={()=>setReview({...review, rating:1})} /><label
                                                htmlFor="rating-1"></label>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <button type="submit" className="btn btn-outline-dark">Add Review</button>
                                    </div>
                                </form> : <div className="col-12 text-justify py-2 px-3 mb-3 bg-gray">
                                    Please login to leave a review for this product.
                                </div>
                                }
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 px-md-3 px-0">
                                <hr />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">

                               {product?.reviews?.length > 0 ? product.reviews.map(review =>  <div className="col-12 text-justify py-2 px-3 mb-3 bg-gray"
                                key={review._id}>
                                    <div className="row">
                                        <div className="col-12">
                                            <strong className="me-2"> {review?.user.name} </strong>
                                        <small>
                                             {[1, 2, 3, 4, 5].map(i => 
                                              <i key={i} className={`fa${i <= review.rating ? 's' : 'r'} fa-star`}></i>
                                               )}
                                        </small>

                                        </div>
                                        <div className="col-12">
                                           {review.comment}
                                        </div>
                                        <div className="col-12">
                                            <small>
                                                <i className="fas fa-clock me-2"></i>
                                                {dayjs(review.createdAt).fromNow()}
                                            </small>
                                        </div>
                                    </div>
                                </div>) :  <div className="col-12 text-justify py-2 px-3 mb-3 bg-gray">
                                    No review given for this product
                                </div>}

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
        

        {similars && similars.length > 0 && <ProductSection products={similars} title="Similar Products" />}


    </main>
</div>
} 