import http from "@/http"
import { setValidationError } from "@/lib"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import * as Yup from "Yup"
import YupPassword from 'yup-password'
import { InputField, SubmitBtn } from "@/components"
import { Form } from "react-bootstrap"
YupPassword(Yup)

export const Register = () => {
    const navigate = useNavigate()
   
    const formik = useFormik({
       initialValues: {
          name:"",
          email:"",
          phone:"",
          address:"",
          password:"",
          confirmPassword:"",
       },
 
       validationSchema: Yup.object({
           name: Yup.string().required(),
           email: Yup.string().required().email(),
           phone: Yup.string().required(),
           address: Yup.string().required(),
           password:Yup.string().required().min(6).max(16).minNumbers(1).minLowercase(1).minUppercase(1).minSymbols(1),
           confirmPassword: Yup.string().required().oneOf([Yup.ref('password')]),
       }),
       onSubmit: ((values, {setSubmitting})=>{
           http.post("/auth/register", values)
             .then(()=>navigate("/login"))
             .catch(({response})=>setValidationError(formik, response))
             .finally(()=>setSubmitting(false))
       })
   })
 

    return  <div className="col-12">
    <div className="row">
        <div className="col-12 mt-3 text-center text-uppercase">
            <h2>Register</h2>
        </div>
    </div>

    <main className="row">
        <div className="col-lg-4 col-md-6 col-sm-8 mx-auto bg-white py-3 mb-4">
            <div className="row">
                <div className="col-12">
                <Form onSubmit={formik.handleSubmit}>
    <InputField name="name" label="Name" formik={formik} required/>
    <InputField name="email" label="Email" type="email" formik={formik} required/>
        <InputField name="password" label="Password" type="password" formik={formik} required/>
    <InputField name="confirmPassword" label="Confirm Password" type="password" formik={formik} required/>

    <InputField name="phone" label="Phone" formik={formik} required/>
    <InputField as="textarea" name="address" label="Address" formik={formik} required/>
    
    <Form.Group>
        <SubmitBtn disabled={formik.isSubmitting} label = 'Register' icon = "fa-user-plus"/>
    </Form.Group>
  </Form>
                </div>
            </div>
        </div>

    </main>
</div>
}