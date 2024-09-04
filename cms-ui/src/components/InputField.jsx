import React from "react";
import { Form } from "react-bootstrap";

export const InputField = ({ label, name, type = 'text', formik, as }) => {
    const isPassword = type === 'password';
    const autoCompleteValue = isPassword ? 'off' : 'on';

    return (
        <Form.Group className="mb-3">
            <Form.Label htmlFor={name}>{label}</Form.Label>
            <Form.Control
                type={!as ? type : undefined}
                as={as}
                name={name}
                id={name}
                required 
                autoComplete={autoCompleteValue}
                value={formik.values[name]}
                isInvalid={formik.touched[name] && formik.errors[name]}
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
            />
            {formik.touched[name] && formik.errors[name] && (
                <Form.Control.Feedback type="invalid">
                    {formik.errors[name]}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
};

