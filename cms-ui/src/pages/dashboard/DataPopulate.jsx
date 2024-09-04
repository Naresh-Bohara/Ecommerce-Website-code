import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import http from "@/http";

export const DataPopulate = () => {
  const [num, setNum] = useState(1);
  const [loading, setLoading] = useState(true); // Initially set to true to start data population

  useEffect(() => {
    populate();
  }, []);

  const populate = async () => {
    if (!loading) return; // Check if data population is already completed
    setLoading(true); // Set loading status to true when starting data population

    for (let i = 1; i <= 25; i++) {
      try {
        setNum(i);

        let data = {
          name: `Staff ${i}`,
          email: `staff.${i}@email.com`,
          password: "Naresh@123",
          confirmPassword: "Naresh@123",
          phone: `981234569${i}`,
          address: `Location ${i}`,
          status: true,
        };

        await http.post("/cms/staffs", data);
      } catch (e) {
        console.error("Error while populating data:", e);
      }
    }
    setLoading(false); 
  };

  return (
    <Col className="bg-white my-3 py-3 rounded-2 shadow-sm">
      <Row>
        <Col>
          <h1>Populate Data</h1>
        </Col>
      </Row>

      <Row>
        <Col>
          {loading ?
            <h4 className="text-center">
            <i  className="fa-solid fa-spinner fa-spin me-2"></i>Loading data {num} of 25 
          </h4> :
          <h4 className="text-center text-success">Data population done!</h4>}
        </Col>
      </Row>  
    </Col>
  );
};
  