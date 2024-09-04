import { Col, Row } from "react-bootstrap"

export const Loading = ()=>{
    return <Row>
        <Col className="text-center my-5">
        <h4><i className="fa-solid fa-spinner fa-spin me-2"></i>Loading</h4>
        </Col>
    </Row>
}