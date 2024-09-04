import { useFormik } from "formik";
import * as Yup from "Yup"
import { Col, Form, Row } from "react-bootstrap";
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
            inStorage('accessToken', data.token, remember)

           return http.get('/profile')
          })
          .then(({data})=>{
            dispatch(setUser(data))
            navigate('/')
          })
          .catch(({response})=> setValidationError(response))
          .finally(()=>setSubmitting(false))
        }
    })

    return (
        <Col lg={4} md={6} sm={8} className="mx-auto my-5 bg-white py-3 shadow-sm">
            <Row className="text-center">
                <Col>
                    <h1>Login</h1>
                </Col>
            </Row>
            <Row>
                <Col>
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
                </Col>
            </Row>
        </Col>
    );
}
