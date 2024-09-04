// Edit.jsx

import http from "@/http";
import { setValidationError } from "@/lib";
import { useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "Yup";
import { DataForm } from "./DataForm";
import { useEffect, useState } from "react";
import { Loading } from "@/components";

export const Edit = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      status: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      phone: Yup.string().required(),
      address: Yup.string().required(),
      status: Yup.boolean().required(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      http.patch(`/cms/customers/${id}`, values)
        .then(() => {
          navigate("/customers");
          // Optionally show success message to the user
          alert("Customer updated successfully!");
        })
        .catch(({ response }) => {
          setValidationError(formik, response);
          // Optionally show error message to the user
          alert("Failed to update customer. Please check the form and try again.");
        })
        .finally(() => setSubmitting(false));
    }
  });

  useEffect(() => {
    setLoading(true);
    http.get(`/cms/customers/${id}`)
      .then(({ data }) => {
        formik.setValues({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          status: data.status,
        });
      })
      .catch(err => {
        // Handle error (optional)
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
      <Row>
        <Col>
          <h1>Edit Customer</h1>
        </Col>
      </Row>
      {loading ? (
        <Loading />
      ) : (
        <Row>
          <Col>
            <DataForm formik={formik} isEdit />
          </Col>
        </Row>
      )}
    </Col>
  );
};

