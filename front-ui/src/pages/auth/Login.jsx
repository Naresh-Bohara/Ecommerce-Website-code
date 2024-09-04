import { useFormik } from "formik";
import * as Yup from "Yup"
import { Button, Col, Form, Row } from "react-bootstrap";
import { InputField, SubmitBtn } from "@/components";
import { useState } from "react";
import http from "@/http";
import { inStorage, setValidationError } from "@/lib";
import { useDispatch } from "react-redux";
import { setUser } from "@/store";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [remember, setRemember] = useState(false)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const formik = useFormik({
        initialValues:{
            email:'',
            password:'',
        },

        validationSchema:Yup.object({
            email:Yup.string().required('Please enter a valid email address.').email(),
            password:Yup.string().required(),
        }),

        onSubmit:(values, {setSubmitting})=>{
            console.log(import.meta.env.VITE_API_URL)
          http.post('/auth/login', values)
          .then(({data})=>{
            inStorage('FrontAccessToken', data.token, remember)

           return http.get('/profile')
          })
          .then(({data})=>{
            dispatch(setUser(data))
            navigate('/profile')
          })
          .catch(({response})=> setValidationError(response))
          .finally(()=>setSubmitting(false))
        }
    })
 

    return  <div className="col-12">
    <div className="row">
        <div className="col-12 mt-3 text-center text-uppercase">
            <h2>Log in</h2>
        </div>
    </div>  
 
    <main className="row">
        <div className="col-lg-4 col-md-6 col-sm-8 mx-auto bg-white py-3 mb-4">
            <div className="row">
                <div className="col-12">
                <Form onSubmit={formik.handleSubmit}>
                        <InputField label="Email" name="email" type="email" formik={formik}/>
                        <InputField label="Password" name="password" type="password" formik={formik}/>
                        <Form.Check className="mb-3">
                            <Form.Check.Input name="remember" id="remember" checked={remember} onChange={()=>setRemember(!remember)} />
                            <Form.Check.Label htmlFor="remember">
                            Remember Me
                            </Form.Check.Label>
                        </Form.Check>

                        <div className="d-grid">
                           <SubmitBtn icon="fa-solid fa-right-to-bracket" label="Log In" disabled={formik.isSubmitting}/>
                        </div>
                    </Form>
                </div>
            </div>
        </div>

    </main>
</div>
}