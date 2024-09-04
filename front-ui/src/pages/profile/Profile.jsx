import { DataTable, InputField, Loading, SubmitBtn } from "@/components";
import http from "@/http";
import { dt, setValidationError } from "@/lib";
import { setUser } from "@/store";
import { useFormik } from "formik";
import { useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "Yup"

export const Profile = () => {
  const user = useSelector(state => state.user.value)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);

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

  return (
    <Row>
      <Col className="my-3">
          { loading ? <Loading/> :
          <Form onSubmit={formik.handleSubmit}>
        <InputField name="name" label="Name" formik={formik} required/>
        <InputField name="phone" label="Phone" formik={formik} required/>
        <InputField as="textarea" name="address" label="Address" formik={formik} required/>
        <Form.Group>
            <SubmitBtn disabled={formik.isSubmitting}/>
        </Form.Group>
      </Form>
          }
        
      </Col>
    </Row>
  );
};
