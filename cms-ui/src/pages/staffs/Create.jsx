import http from "@/http"
import { setValidationError } from "@/lib"
import { useFormik } from "formik"
import { Col, Form, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import * as Yup from "Yup"
import YupPassword from 'yup-password'
import { DataForm } from "./DataForm"
YupPassword(Yup)

export const Create = ()=>{

   const navigate = useNavigate()
   
   const formik = useFormik({
      initialValues: {
         name:"",
         email:"",
         phone:"",
         address:"",
         status:true,
         password:"",
         confirmPassword:"",
      },

      validationSchema: Yup.object({
          name: Yup.string().required(),
          email: Yup.string().required().email(),
          phone: Yup.string().required(),
          address: Yup.string().required(),
          status:Yup.boolean().required(),
          password:Yup.string().required().min(6).max(16).minNumbers(1).minLowercase(1).minUppercase(1).minSymbols(1),
          confirmPassword: Yup.string().required().oneOf([Yup.ref('password')]),
      }),
      onSubmit: ((values, {setSubmitting})=>{
          http.post("/cms/staffs", values)
            .then(()=>navigate("/staffs"))
            .catch(({response})=>setValidationError(formik, response))
            .finally(()=>setSubmitting(false))
      })
  })

   return <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
   <Row>
      <Col>
      <h1>Add Staffs</h1>
      </Col>
   </Row>
   <Row>
      <Col>
      <DataForm formik={formik}/>
      </Col>
   </Row>
   </Col>
}