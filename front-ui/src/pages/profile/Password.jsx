import { DataTable, InputField, Loading, SubmitBtn } from "@/components";
import http from "@/http";
import { setValidationError } from "@/lib";
import { useFormik } from "formik";
import { Col, Form, Row, Table } from "react-bootstrap";
import * as Yup from "Yup"
import YupPassword from 'yup-password'
YupPassword(Yup)

export const Password = () => {
  const formik = useFormik({
    initialValues: {
     oldPassword:"",
     newPassword:"",
     confirmPassword:"",
    },

    validationSchema: Yup.object({
        oldPassword: Yup.string().required(),
        newPassword: Yup.string().required().min(6).max(16).minNumbers(1).minLowercase(1).minUppercase(1).minSymbols(1),
        confirmPassword: Yup.string().required().oneOf([Yup.ref('newPassword')]),
        
    }),
    onSubmit: ((values, {setSubmitting, resetForm})=>{
        http.patch("/profile/password", values)
          .then(()=>resetForm())
          .catch(({response})=>setValidationError(formik, response))
          .finally(()=>setSubmitting(false))
    })
})

  return (
    <Row>
      <Col className="my-3">
          <Form onSubmit={formik.handleSubmit}>
          <InputField name="oldPassword" label="Old Password" type="password" formik={formik} required/>
          <InputField name="newPassword" label="New Password" type="password" formik={formik} required/>
          <InputField name="confirmPassword" label="Confirm Password" type="password" formik={formik} required/>
          
          <Form.Group>
              <SubmitBtn disabled={formik.isSubmitting}/>
          </Form.Group>
        </Form>
        
      </Col>
    </Row>
  );
};
