import http from "@/http"
import { setValidationError } from "@/lib"
import { useFormik } from "formik"
import { Col, Row } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import * as Yup from "Yup"
import { DataForm } from "./DataForm"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export const Edit = ()=>{
   const [images, setImages] = useState([])
   const [loading, setLoading] = useState(false)

   const params = useParams()
   const navigate = useNavigate()
   
   const formik = useFormik({
      initialValues: {
         name: "",
         description: "",
         summary: "",
         price: 0,
         discountedPrice: 0,
         images: [],
         categoryId: "",
         brandId: "",
         status: true,
         featured: false,
       },

      validationSchema: Yup.object({
         name: Yup.string().required(),
         description: Yup.string().required(),
         summary: Yup.string().required(),
         price: Yup.number().required(),
         discountedPrice: Yup.number().nullable(),
         images: Yup.array().nullable()
           .test('imgType', 'only images allowed', items => {
             if (items) {
               for (let img of items) {
                 if (!img.type.startsWith('image/')) {
                   return false;
                 }
               }
             }
             return true;
           }),
      }),
      onSubmit: (values, { setSubmitting }) => {
         let fd = new FormData
    
         for(let k in values){
          if(k == 'images'){
            for(let img of values[k]){
             fd.append(k, img)
            }
          }else{
             fd.append(k, values[k])
          }
         }
    
          http.patch(`/cms/products/${params.id}`, fd, {
             headers:{
                "Content-Type":"multipart/form-data"
               }
            })
            .then(() => navigate("/products"))
            .catch(({ response }) => setValidationError(formik, response))
            .finally(() => setSubmitting(false))
        }
  })

  useEffect(() => {
    loadProduct()
  }, [])

  const loadProduct = () => {
   setLoading(true)
   http.get(`/cms/products/${params.id}`)
     .then(({data}) => {
      formik.setValues({
         name:data.name,
         description: data.description,
         summary: data.summary,
         price: data.price,
         discountedPrice: data.discountedPrice,
         categoryId: data.categoryId,
         brandId: data.brandId,
         status: data.status,
         featured: data.featured,
        })
        setImages(data.images)
     })
     .catch(err=>{})
     .finally(()=>setLoading(false))
  }

  const handleDelete = filename=>{
   if(images.length >1){
      setLoading(true)

   http.delete(`/cms/products/${params.id}/image/${filename}`)
     .then(() => loadProduct())
     .catch(()=>{})
     .finally(()=>setLoading(false))
   }else{
      toast.error(`At least one image is compulsory`)
   }
  }

   return <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
   <Row>
      <Col>
      <h1>Edit Product </h1>
      </Col>
   </Row>
   <DataForm formik={formik} loading={loading} setLoading={setLoading} images={images} onDelete={handleDelete} />
   </Col>
}