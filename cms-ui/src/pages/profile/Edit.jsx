import { InputField, SubmitBtn } from "@/components"
import http from "@/http"
import { setValidationError } from "@/lib"
import { setUser } from "@/store"
import { useFormik } from "formik"
import { Col, Form, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import * as Yup from "Yup"


export const Edit = ()=>{
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.value)

    const formik = useFormik({
        initialValues: {
         name:user.name,
         phone:user.phone,
         address:user.address,
        },

        validationSchema: Yup.object({
            name: Yup.string().required(),
            phone: Yup.string().required(),
            address: Yup.string().required()
        }),
        onSubmit: ((values, {setSubmitting})=>{
            http.patch("/profile/edit", values)
              .then(()=>http.get("/profile"))
              .then(({data})=>dispatch(setUser(data)))
              .catch(({response})=>setValidationError(formik, response))
              .finally(()=>setSubmitting(false))
        })
    })

   return <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
   <Row>
      <Col>
      <h1>Edit Profile</h1>
      </Col>
   </Row>

   <Row>
      <Col>
      <Form onSubmit={formik.handleSubmit}>
        <InputField name="name" label="Name" formik={formik} required/>
        <InputField name="phone" label="Phone" formik={formik} required/>
        <InputField as="textarea" name="address" label="Address" formik={formik} required/>
        <Form.Group>
            <SubmitBtn disabled={formik.isSubmitting}/>
        </Form.Group>
      </Form>
      </Col>
   </Row>
   </Col>
}