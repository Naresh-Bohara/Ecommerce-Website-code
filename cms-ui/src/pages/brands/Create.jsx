import http from "@/http";
import { setValidationError } from "@/lib";
import { useFormik } from "formik";
import { Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "Yup";
import { DataForm } from "./DataForm";

export const Create = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            status: true,
        },
        validationSchema: Yup.object({
            name: Yup.string().required(),
            status: Yup.boolean().required(),
        }),
        onSubmit: ((values, { setSubmitting }) => {
            http.post("/cms/brands", values)
                .then(() => navigate("/brands"))
                .catch(({ response }) => setValidationError(formik, response))
                .finally(() => setSubmitting(false))
        })
    });

    return (
        <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
            <Row>
                <Col>
                    <h1>Add Brand</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DataForm formik={formik} />
                </Col>
            </Row>
        </Col>
    );
};
