import { InputField, SubmitBtn } from "@/components";
import { Form } from "react-bootstrap";

export const DataForm = ({formik}) => {
    return <Form onSubmit={formik.handleSubmit}>
        <InputField name="name" label="Name" formik={formik} required/>
        <Form.Group className="mb-3">
            <Form.Label htmlFor="status">Status</Form.Label> <br />
            <Form.Check
                type="switch"
                id="status"
                label="Active"
                checked={formik.values.status}
                onChange={()=>formik.setFieldValue("status", !formik.values.status)}
            />
        </Form.Group>
        <Form.Group>
            <SubmitBtn disabled={formik.isSubmitting}/>
        </Form.Group>
    </Form>
};
