import http from "@/http"
import { setValidationError } from "@/lib"
import { useFormik } from "formik"
import { Col, Row } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import * as Yup from "Yup"
import { DataForm } from "./DataForm"
import { useEffect, useState } from "react"
import { Loading } from "@/components"

export const Edit = ()=>{
   const [loading, setLoading] = useState(false)

   const params = useParams()
   const navigate = useNavigate()
   
   const formik = useFormik({
      initialValues: {
         name:"",
         phone:"",
         address:"",
         status:true,
      },

      validationSchema: Yup.object({
          name: Yup.string().required(),
          phone: Yup.string().required(),
          address: Yup.string().required(),
          status:Yup.boolean().required(),
      }),
      onSubmit: ((values, {setSubmitting})=>{
          http.patch(`/cms/staffs/${params.id}`, values)
            .then(()=>navigate("/staffs"))
            .catch(({response})=>setValidationError(formik, response))
            .finally(()=>setSubmitting(false))
      })
  })

  useEffect(() => {
   setLoading(true)
   http.get(`/cms/staffs/${params.id}`)
     .then(({data}) => formik.setValues({
      name:data.name,
      phone:data.phone,
      address:data.address,
      status:data.status,
     }))
     .catch(err=>{})
     .finally(()=>setLoading(false))
  }, [])

   return <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
   <Row>
      <Col>
      <h1>Edit Staff </h1>
      </Col>
   </Row>
   { loading ? <Loading/> :
      <Row>
      <Col>
      <DataForm formik={formik} isEdit/>
      </Col>
   </Row>
   }
   </Col>
}