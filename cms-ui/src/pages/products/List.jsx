import { DataTable, Loading } from "@/components"
import http from "@/http"
import { useEffect, useState } from "react"
import { Button, Col, Row } from "react-bootstrap"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Link } from "react-router-dom"
import { confirmAlert } from "react-confirm-alert"
import { dt, imgUrl } from "@/lib"
dayjs.extend(localizedFormat);

export const List = ()=>{
   const [products, setProducts] = useState([])
   const [loading, setLoading] = useState(false)

   useEffect (()=>{
      loadProduct()
   }, []);

   const loadProduct = ()=>{
     setLoading(true)

      http.get("cms/products")
        .then(({data})=>setProducts(data))
        .catch((err)=>console.log(err))
        .finally(()=>setLoading(false))
   }

   const handleDelete = id =>{
     confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure to delete this Product?",
      buttons: [
         {
            label: "Yes",
            className:"btn-sm text-bg-danger",
            onClick:() => {
               setLoading(true)
               http.delete(`/cms/products/${id}`)
                  .then(() => loadProduct())
                  .catch((err) => console.log(err))
                  .finally(() => setLoading(false))
            },
         },

         {
            label: "No",
            className:"text-bg-secondary",
            onClick:() => {},
         }
      ]
     })
   }

   return <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
   <Row>
      <Col>
      <h1>Products</h1>
      </Col>

      <Col xs="auto">
      <Link to="/products/create" className="btn btn-dark">
         <i className="fa-solid fa-plus me-2"></i> Add Product
      </Link>
      </Col>
   </Row>
   {loading ? <Loading/> : <Row>
      <Col>
      <DataTable sortable={['Name', 'Category', 'Brand', 'Price', 'Dis. Price', 'Status', 'Featured', 'Created At', 'Updated At']} searchable={['Name', 'Category', 'Brand', 'Price', 'Dis. Price', 'Status', 'Featured', 'Created At', 'Updated At']} data={products.map(product=>{
         return{
            Name:product.name,
            Image:<img src={imgUrl(product.images[0])} className="img-sm" /> ,
            // Discription:product.description,
            // Summary:product.summary,
            Category:product.category.name,
            Brand:product.brand.name,
            Price:product.price,
            "Dis. Price":product.discountedPrice,
            Status:product.status ? 'Active' : 'Inactive',
            Featured:product.featured ? 'Yes' : 'No',
            'Created At':dt(product.createdAt),
            'Updated At':dt(product.updatedAt),
            'Action': <>
              <Link to={`/products/edit/${product._id}`} className="btn btn-dark btn-sm me-2">
               <i className="fa-solid fa-edit me-2"></i>Edit
              </Link>
              <Button type="button" className="btn btn-danger btn-sm" onClick={()=>handleDelete(product._id)}>
               <i className="fa-solid fa-trash me-2"></i>Delete
              </Button>
            </>
         }
        })}/>
      </Col>
      </Row>}
   </Col>
}