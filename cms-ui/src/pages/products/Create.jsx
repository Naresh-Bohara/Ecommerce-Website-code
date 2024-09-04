import http from "@/http"
import { setValidationError } from "@/lib"
import { useFormik } from "formik"
import { Col, Form, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import * as Yup from "Yup"
import { DataForm } from "./DataForm"

export const Create = () => {
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
      images: Yup.array()
        .test('imgCount', 'select at least one image', items => items && items.length > 0)
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
      categoryId: Yup.string().required(),
      brandId: Yup.string().required(),
      status: Yup.boolean().required(),
      featured: Yup.boolean().required(),
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
 
       http.post("/cms/products", fd, {
          headers:{
             "Content-Type":"multipart/form-data"
            }
         })
         .then(() => navigate("/products"))
         .catch(({ response }) => setValidationError(formik, response))
         .finally(() => setSubmitting(false))
     }
  })

  return (
    <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
      <Row>
        <Col>
          <h1>Add Products</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataForm formik={formik} />
        </Col>
      </Row>
    </Col>
  )
}
