import { InputField, Loading, SubmitBtn } from "@/components"
import http from "@/http"
import { imgUrl } from "@/lib"
import { useEffect, useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import ReactSwitch from "react-switch"

export const DataForm = ({ formik, loading= false, setLoading=()=>{}, images=[], onDelete=()=>{} }) => {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  useEffect(() => {
    setLoading(true)
    Promise.all([
      http.get("/cms/categories"),
      http.get("/cms/brands")
    ])
    .then(result => {
      const [{ data: catList }, { data: brnList }] = result
      setCategories(catList)
      setBrands(brnList)
      formik.setFieldValue('categoryId', catList.length > 0 ? catList[0]._id : '')
      formik.setFieldValue('brandId', brnList.length > 0 ? brnList[0]._id : '')
    })
    .catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const handleFileChange = ({ target }) => {
    formik.setFieldValue('images', [...target.files])
  }

  return loading ? <Loading /> : (
    <Form onSubmit={formik.handleSubmit}>
      <InputField name="name" label="Name" formik={formik} required />
      <InputField name="description" label="Description" as="textarea" formik={formik} required />
      <InputField name="summary" label="Summary" as="textarea" formik={formik} required />
      <InputField name="price" label="Price" type="number" formik={formik} required />
      <InputField name="discountedPrice" label="Discounted Price" type="number" formik={formik} />
      
      <Form.Group className="mb-3">
        <Form.Label htmlFor="images">Images</Form.Label>
        <Form.Control
          type="file"
          name="images"
          id="images"
          accept="image/*"
          multiple
          onBlur={formik.handleBlur}
          onChange={handleFileChange}
          isInvalid={formik.touched.images && formik.errors.images}
        />
        {formik.touched.images && formik.errors.images && (
          <Form.Control.Feedback type="invalid">{formik.errors.images}</Form.Control.Feedback>
        )}
        {formik.values.images?.length > 0 && (
          <Row>
            {formik.values.images.map((image, i) => (
              <Col sm={3} className="mt-3" key={i}>
                <img src={URL.createObjectURL(image)} className="img-fluid" alt="preview" />
              </Col>
            ))}
          </Row>
        )}
        {images.length > 0 && <Row>
          { images.map((image, i)=> <Col sm={3} className="mt-3" key={i}>
            <Row>
            <Col xs={12} className="mb-3">
                 <img src={imgUrl(image)} className="img-fluid" />
              </Col>
              <Col xs={12} className="text-center">
                <Button size="sm" variant="danger" onClick={()=>onDelete(image)}>
                  <i className="fa-solid fa-trash me-2"></i>Delete
                </Button>
              </Col>
            </Row>
          </Col>)}
          </Row>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="categoryId">Category</Form.Label>
        <Form.Select
          name="categoryId"
          id="categoryId"
          value={formik.values.categoryId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.categoryId && formik.errors.categoryId}
          required
        >
          {categories.map(category => (
            <option value={category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
        {formik.touched.categoryId && formik.errors.categoryId && (
          <Form.Control.Feedback type="invalid">{formik.errors.categoryId}</Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="brandId">Brand</Form.Label>
        <Form.Select
          name="brandId"
          id="brandId"
          value={formik.values.brandId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.brandId && formik.errors.brandId}
          required
        >
          {brands.map(brand => (
            <option value={brand._id} key={brand._id}>
              {brand.name}
            </option>
          ))}
        </Form.Select>
        {formik.touched.brandId && formik.errors.brandId && (
          <Form.Control.Feedback type="invalid">{formik.errors.brandId}</Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="status">Status</Form.Label> <br />
        <ReactSwitch
          id="status"
          checked={formik.values.status}
          onChange={() => formik.setFieldValue("status", !formik.values.status)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="featured">Featured</Form.Label> <br />
        <ReactSwitch
          id="featured"
          checked={formik.values.featured}
          onChange={() => formik.setFieldValue("featured", !formik.values.featured)}
        />
      </Form.Group>

      <Form.Group>
        <SubmitBtn disabled={formik.isSubmitting} />
      </Form.Group>
    </Form>
  )
}
