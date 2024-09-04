import React from 'react';
import { Form } from 'react-bootstrap';
import ReactSwitch from 'react-switch';
import { InputField, SubmitBtn } from '@/components'; // Assuming these components are correctly defined

export const DataForm = ({ formik, isEdit = false }) => {
  return (
    <Form onSubmit={formik.handleSubmit}>
      <InputField name="name" label="Name" formik={formik} required />

      {!isEdit && (
        <>
          <InputField name="email" label="Email" type="email" formik={formik} required />
          <InputField name="password" label="Password" type="password" formik={formik} required />
          <InputField name="confirmPassword" label="Confirm Password" type="password" formik={formik} required />
        </>
      )}

      <InputField name="phone" label="Phone" formik={formik} required />
      <InputField as="textarea" name="address" label="Address" formik={formik} required />

      <Form.Group className="mb-3">
        <Form.Label htmlFor="status">Status</Form.Label> <br />
        <ReactSwitch
          id="status"
          checked={formik.values.status}
          onChange={(checked) => formik.setFieldValue('status', checked)}
        />
      </Form.Group>

      <Form.Group>
        <SubmitBtn disabled={formik.isSubmitting} />
      </Form.Group>
    </Form>
  );
};


